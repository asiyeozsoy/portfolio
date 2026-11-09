# Slot Games showcase

The public site contains only encrypted render media and an encrypted project manifest. The existing public cover thumbnails provide the blurred gate background. Source projects, rigs and editable assets are not included.

Private input, password and download metadata live in the Git-ignored `.private/` folder. Browser exports and temporary previews live in `.codex-tmp/`. Do not force-add either directory to Git.

To rebuild from the existing private source manifest:

```sh
node tools/build-showcase.mjs
```

The builder reuses and authenticates existing encrypted media before downloading anything. New media is fetched from the Behance/Adobe URLs in the private manifest and encrypted immediately. The generated password is saved locally in `.private/portfolio-password.txt`; it is never written into the public HTML or JavaScript.

For new or updated projects, save their signed-in Behance pages as HTML Only, then run:

```sh
python3 tools/prepare-showcase.py path/to/saved-pages
node tools/build-showcase.mjs
```

Expected source filenames are listed in `prepare-showcase.py`. Video source links can expire, so refresh the saved page if a new download fails. YouTube videos already embedded in the Behance presentations remain embedded players inside the unlocked page.

Encryption uses PBKDF2-HMAC-SHA-256 (600,000 iterations, random 16-byte salt) and AES-256-GCM (random 12-byte nonce per file). Keys and decrypted media live only in the browser session; locking clears the gallery, stops media and revokes object URLs. Serve through HTTPS or localhost. This is a shared-password portfolio, with no visitor accounts or server-side access revocation.
