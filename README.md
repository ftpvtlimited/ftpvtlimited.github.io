# FT PVT. LIMITED website

A lightweight, original dark website featuring **All Document Reader only**. Static HTML, one local stylesheet and a small navigation script. No runtime packages, external fonts, trackers, database or form service are required.

## Start here

The finished website is in `dist/`. The archive also includes its editable source, reference inspection, verification results and selected screenshots.

**Before public launch:** set your verified HTTPS domain in `site.config.json`, then rebuild with `--production`. The supplied build is deliberately in preview mode because no production domain was provided. It has `noindex` metadata and a crawl-blocking robots file; its valid preview sitemap uses localhost. Do not publish the preview build expecting search indexing.

The official All Document Reader store/download URL was not provided. The functional availability CTA opens an email enquiry. Add the verified URL to `download_url` to replace it with a download CTA. No unrelated store listing or fictitious URL is used.

## Preview locally

With Python 3.12 or newer available:

```text
python build.py
python serve.py
```

Open `http://127.0.0.1:4173`. On systems that expose Python as `python3` or `py`, use that command instead. Serve over HTTP; opening index.html directly from the filesystem does not resolve the root-relative site links. The preview server returns the branded 404 page with status 404 for missing routes.

## Configure and publish

1. Edit `site.config.json`: set `site_url` to your real HTTPS origin without a subdirectory. Set `download_url` only to the official app listing or download page.
2. Run `python build.py --production`, then `python verify.py`.
3. Upload **only the contents of `dist/`** to a static host at the domain root. Do not upload source, documentation, screenshots, the reference archive or test tools.
4. Configure the host to serve directory index.html pages, enable HTTPS, and serve `404.html` with status 404 for missing URLs. Do not enable a single-page-app catch-all.
5. Where supported, use the supplied `_redirects` and `_headers` files. Otherwise configure equivalent /privacy/ and /terms/ permanent redirects and security headers in the hosting dashboard. HTML fallback redirects also exist. `.nojekyll` supports static publishing on GitHub Pages; use a root/custom domain, not a repository subpath.
6. The production build writes absolute canonical URLs, Open Graph URLs, a real-domain sitemap and its robots directive. Verify the final live domain before submitting the sitemap to search engines.

## Pages

| Path | Purpose |
|---|---|
| `/` | Company and featured product introduction |
| `/apps/` | Single-product listing |
| `/apps/all-document-reader/` | Features, benefits, formats, availability, privacy and FAQ |
| `/about/` | Company focus and principles |
| `/contact/` | Direct email support and privacy requests |
| `/support/` | App help and common questions |
| `/privacy-policy/` | Website privacy |
| `/terms-and-conditions/` | Website/app terms |
| `/apps/all-document-reader/privacy/` | Detailed app-specific policy |
| `/404.html` | Branded missing-page recovery |
| `/privacy/`, `/terms/` | Compatibility redirects |

## Editing

- `build.py`: shared layouts and original page copy. Rebuild after changes.
- `assets/site.css`: colorful dark design with violet, cyan, coral and yellow accents, grids and responsive styles.
- `assets/site.js`: progressive mobile navigation. Content and links work without JavaScript.
- `assets/favicon.svg`: original simple FT monogram.
- `content/app-privacy.json`: 20 company-specific app disclosures extracted from the supplied target policy, reformatted into the new layout. App SDK behavior was not independently audited; these disclosures are based on the supplied material.
- `site.config.json`: domain, verified app download URL and owner-confirmed supported formats.

The owner confirmed PDF, DOC/DOCX, XLS/XLSX, PPT/PPTX and TXT support during this task. No target app icon or screenshot was available; unrelated product icons were not reused. The design uses typography and layout rather than fabricated app screenshots. No social accounts, ratings, download counts, awards or availability dates are invented.

## Verification

Run `python verify.py` for static checks. `browser-checks.cjs` provides browser regression checks if Playwright and browser binaries are available; `PLAYWRIGHT_MODULE` can point to an existing Playwright installation. The Chromium suite uses installed Microsoft Edge. WebKit emulates mobile browser dimensions, not physical iPhone hardware.

See `docs/QA-REPORT.md`, `docs/REQUIREMENTS-CHECKLIST.md`, `docs/REFERENCE-AUDIT.md`, and the machine-readable reports for exact coverage and limitations. These docs are not public pages.
