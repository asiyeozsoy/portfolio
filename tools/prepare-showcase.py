"""Extract only project modules from Behance HTML saved by the signed-in owner.
Usage: python3 tools/prepare-showcase.py path/to/saved-pages
The private manifest stays outside Git. No account data is retained in it.
"""
import html
import json
import re
import sys
from pathlib import Path
from html.parser import HTMLParser
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
PRIVATE = ROOT / '.private'
PRIVATE.mkdir(mode=0o700, exist_ok=True)
SOURCES = Path(sys.argv[1])
PROJECTS = [
    ('monkey', 'Monkey Mike', 'monkey-mike'),
    ('scarlett', 'Scarlett Journey', 'scarlett-journey-mf'),
    ('tipsy', 'The Tipsy Tourist', 'the-tipsy-tourist'),
    ('heist', 'Heist Bank Rush', 'heist-bank-rush'),
    ('stampede', 'Stampede Gold', 'stampede-gold'),
    ('gold', 'Gold Nugget Rush', 'gold-nugget-rush'),
]

class PlainText(HTMLParser):
    def __init__(self, value):
        super().__init__(); self.parts = []; self.feed(value or '')
    def handle_data(self, data): self.parts.append(data)
    def text(self): return ' '.join(' '.join(self.parts).split())

def asset(module):
    sizes = module.get('imageSizes') or {}
    available = sizes.get('allAvailable') or []
    candidates = [v for v in available if v.get('url')]
    # Prefer the actual animated original, never a still preview of a GIF.
    original = next((v['url'] for v in candidates if '/source/' in v['url']), None)
    url = original or module.get('src') or (sizes.get('size_disp') or {}).get('url')
    if not url: raise ValueError('Image module has no usable source')
    return {'url': url, 'alt': module.get('altText') or '', 'caption': PlainText(module.get('caption')).text()}

def video(module):
    embed = module.get('embed') or module.get('originalEmbed') or module.get('fluidEmbed') or ''
    match = re.search(r'src=["\']([^"\']+)', embed)
    if not match: raise ValueError('Video module has no source')
    url = html.unescape(match[1])
    if 'cdn.behance.net/v1/ccvembed/' not in url:
        return {'link': url, 'label': 'Watch the featured video ↗'}
    player = urlopen(url, timeout=45).read().decode()
    # Behance's own player supplies the signed MP4 rendition URL.
    match = re.search(r'"(?:mp4URL|mp4Url)"\s*:\s*"([^"]+)"', player)
    if not match: raise ValueError('Behance video has no MP4 rendition')
    return {'assets': [{'url': html.unescape(match[1].replace('\\/', '/')), 'mime': 'video/mp4', 'caption': PlainText(module.get('caption')).text()}]}

result = {'projects': []}
for slug, title, cover in reversed(PROJECTS):
    path = SOURCES / (slug + '.html')
    if not path.exists():
        raise FileNotFoundError('Missing source: ' + title + '. Existing manifest was not changed.')
    source = path.read_text()
    match = re.search(r'<script type="application/json" id="beconfig-store_state">(.*?)</script>', source, re.S)
    project = json.loads(match[1])['project']['project']
    rows = []
    for module in project['modules']:
        kind = module.get('__typename')
        if kind == 'ImageModule': rows.append({'assets': [asset(module)]})
        elif 'components' in module: rows.append({'assets': [asset(item) for item in module['components']]})
        elif kind in ('VideoModule', 'EmbedModule'): rows.append(video(module))
        elif kind == 'TextModule':
            value = PlainText(module.get('text')).text()
            if value: rows.append({'text': value})
        else: raise ValueError('Unsupported module: ' + str(kind))
    result['projects'].append({'title': title, 'cover': '../thumbs/' + cover + '.jpg', 'rows': rows, 'sourceProject': project['id']})
    print(title, ':', len(rows), 'sections,', sum(len(r.get('assets', [])) for r in rows), 'media items')
(PRIVATE / 'source-manifest.json').write_text(json.dumps(result, ensure_ascii=False, indent=2))
