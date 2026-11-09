(() => {
  'use strict';
  const form = document.querySelector('#unlock-form');
  const password = document.querySelector('#password');
  const status = document.querySelector('#status');
  const submit = document.querySelector('#unlock-button');
  const gate = document.querySelector('#gate');
  const portfolio = document.querySelector('#portfolio');
  const projects = document.querySelector('#projects');
  let key = null;
  let generation = 0;
  const blobs = new Set();
  const jobs = new Set();
  const observers = new Set();
  const decode64 = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
  const element = (tag, text, className) => {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    if (className) el.className = className;
    return el;
  };
  async function fetchBytes(path) {
    if (!/^data\/[a-zA-Z0-9.-]+$/.test(path)) throw new Error('Invalid asset path');
    const controller = new AbortController();
    jobs.add(controller);
    try {
      const response = await fetch(path, { signal: controller.signal });
      if (!response.ok) throw new Error('Portfolio content is unavailable. Please try again later.');
      return new Uint8Array(await response.arrayBuffer());
    } finally { jobs.delete(controller); }
  }
  async function decrypt(bytes, activeKey) {
    return crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes.slice(0, 12) }, activeKey, bytes.slice(12));
  }
  function lock() {
    generation++;
    key = null;
    jobs.forEach(job => job.abort());
    jobs.clear();
    observers.forEach(observer => observer.disconnect());
    observers.clear();
    projects.querySelectorAll('video').forEach(video => { video.pause(); video.removeAttribute('src'); video.load(); });
    projects.replaceChildren();
    blobs.forEach(url => URL.revokeObjectURL(url));
    blobs.clear();
    portfolio.hidden = true;
    gate.hidden = false;
    password.value = '';
    status.textContent = '';
    password.focus();
  }
  async function attachMedia(asset, holder, activeKey, session) {
    const loading = element('p', 'Loading…');
    holder.append(loading);
    try {
      const plain = await decrypt(await fetchBytes(asset.path), activeKey);
      if (generation !== session || !key || !holder.isConnected) return;
      const url = URL.createObjectURL(new Blob([plain], { type: asset.mime }));
      blobs.add(url);
      const media = element(asset.mime.startsWith('video/') ? 'video' : 'img');
      if (media.tagName === 'VIDEO') {
        media.controls = true;
        media.playsInline = true;
        media.preload = 'metadata';
        media.controlsList = 'nodownload';
      } else { media.alt = asset.alt || 'Animation showcase'; }
      media.src = url;
      media.addEventListener('error', () => { loading.textContent = 'This preview could not be played.'; holder.prepend(loading); }, { once: true });
      holder.replaceChildren(media);
      if (asset.caption) holder.append(element('figcaption', asset.caption));
    } catch (error) {
      if (generation !== session) return;
      holder.replaceChildren(element('p', 'Preview unavailable. Reopen this project to retry.', 'media-error'));
      holder.dataset.failed = 'true';
    }
  }
  function renderProject(project, activeKey, session) {
    const detail = element('details', '', 'project');
    const summary = element('summary');
    if (project.cover) {
      const image = element('img'); image.src = project.cover; image.alt = ''; summary.append(image);
    }
    const heading = element('div');
    heading.append(element('h2', project.title), element('p', 'Animation showcase'));
    summary.append(heading);
    const body = element('div', '', 'project-body');
    detail.append(summary, body);
    let loaded = false;
    let observer;
    detail.addEventListener('toggle', () => {
      if (!detail.open) {
        body.querySelectorAll('video').forEach(video => video.pause());
        body.querySelectorAll('iframe').forEach(frame => { frame.src = 'about:blank'; });
        return;
      }
      body.querySelectorAll('iframe[data-embed-src]').forEach(frame => { frame.src = frame.dataset.embedSrc; });
      if (loaded && !body.querySelector('[data-failed]')) return;
      loaded = true;
      observer?.disconnect();
      body.replaceChildren();
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          if (generation !== session || !key) return;
          attachMedia(entry.target.asset, entry.target, activeKey, session);
        });
      }, { rootMargin: '500px' });
      observers.add(observer);
      project.rows.forEach(row => {
        if (row.text) { body.append(element('p', row.text)); return; }
        if (row.link) {
          const url = new URL(row.link);
          if (url.protocol !== 'https:') return;
          if (['www.youtube.com', 'www.youtube-nocookie.com'].includes(url.hostname) && /^\/embed\/[\w-]+$/.test(url.pathname)) {
            const frame = element('iframe', '', 'showcase-embed');
            frame.src = url.href;
            frame.dataset.embedSrc = url.href;
            frame.title = project.title + ' — featured video';
            frame.loading = 'lazy';
            frame.allow = 'fullscreen; picture-in-picture';
            frame.referrerPolicy = 'strict-origin-when-cross-origin';
            frame.allowFullscreen = true;
            body.append(frame);
            return;
          }
          const link = element('a', row.label || 'Watch video ↗', 'access-link');
          link.href = url.href; link.target = '_blank'; link.rel = 'noopener noreferrer';
          body.append(link); return;
        }
        const grid = element('div', '', 'media-row');
        grid.style.setProperty('--columns', String(Math.min(row.assets.length, 4)));
        row.assets.forEach(asset => {
          const figure = element('figure', '', 'media-item');
          figure.asset = asset;
          figure.style.minHeight = '100px';
          grid.append(figure);
          observer.observe(figure);
        });
        body.append(grid);
      });
    });
    return detail;
  }
  document.querySelector('#show-password').addEventListener('click', event => {
    const visible = password.type === 'password';
    password.type = visible ? 'text' : 'password';
    event.currentTarget.textContent = visible ? 'Hide' : 'Show';
    event.currentTarget.setAttribute('aria-pressed', String(visible));
    event.currentTarget.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
  });
  document.querySelector('#lock-button').addEventListener('click', lock);
  window.addEventListener('pagehide', lock);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!crypto.subtle) { status.textContent = 'Please open this page using HTTPS.'; return; }
    submit.disabled = true;
    status.textContent = 'Opening portfolio…';
    try {
      const response = await fetch('config.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('This portfolio is being prepared. Please check back shortly.');
      const config = await response.json();
      const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password.value), 'PBKDF2', false, ['deriveKey']);
      const candidate = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: decode64(config.salt), iterations: config.iterations, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
      const bytes = await fetchBytes(config.manifest);
      let manifest;
      try { manifest = JSON.parse(new TextDecoder().decode(await decrypt(bytes, candidate))); }
      catch { throw new Error('That password doesn’t match. Please try again.'); }
      key = candidate;
      generation++;
      projects.replaceChildren(...manifest.projects.map(project => renderProject(project, key, generation)));
      password.value = '';
      gate.hidden = true;
      portfolio.hidden = false;
      status.textContent = '';
      document.querySelector('#lock-button').focus();
    } catch (error) { status.textContent = error.message || 'Unable to open portfolio. Please try again.'; }
    finally { submit.disabled = false; }
  });
})();
