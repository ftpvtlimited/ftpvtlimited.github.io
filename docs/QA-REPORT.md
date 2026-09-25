# Website verification

## Scope and result

The deliverable is a fresh static adaptation of the supplied reference. All requested public pages exist. All Document Reader is the only marketed product. No reference assets or unrelated product directories are copied into `dist/`.

The release is ready for final domain configuration and static hosting. The provided output is deliberately a non-indexable preview because the owner has not supplied the real domain. Download availability uses a working email enquiry because the official store URL is also unknown. These are explicit launch inputs, not fake or broken links.

## Colorful UI revision

The owner requested a more colorful interface after the initial dark design. The final version uses a vivid violet product panel, cyan and coral feature cards, yellow rounded buttons, a pink-to-yellow headline, bolder headings and violet background accents. The same palette extends across every page and the favicon. The original dark-theme requirement remains intact. Browser and responsive checks were rerun after this revision.

## Static checks

`static-checks.json` records:

- 12 HTML files: nine content pages, one 404 page and two compatibility redirects.
- 264 internal links, anchors and asset references resolved.
- Exactly one H1 per page; no duplicate IDs.
- Unique titles and descriptions for all ten full pages.
- Per-page Open Graph and Twitter titles/descriptions.
- Nine sitemap routes; 404 and redirects excluded.
- All email addresses match the supplied company address.
- No reference-company identity, legacy app route, store package or empty `href="#"` in public HTML.
- No content images are used, so there are no missing image alt attributes. The decorative FT mark is hidden from assistive technology; the brand link has an accessible name.

The complete public output was also searched for obsolete identities, domains, emails, products, social accounts and test origins. Only the supplied company/product identity, service-provider legal links and preview origin remain.

## Browser coverage

`browser-checks.json` is the authoritative machine-readable result. Chromium runs through installed Microsoft Edge at 1440×1000, 1280×800, 768×1024, 390×844, 360×800 and 320×740. WebKit checks the mobile and tablet layouts at 390×844 and 768×1024.

Each full route is loaded at every tested width and checked for successful response, an H1 and horizontal overflow. Mobile menus are opened and closed, including Escape behavior. FAQ disclosure interactions, old privacy/terms redirects, custom missing-route status 404, skip-link focus, reduced-motion behavior and 200% text enlargement are exercised. Main product navigation is also checked with JavaScript disabled. Screenshots were inspected for typography, spacing, contact-address wrapping and product layout.

Final result: **84 route/redirect checks, no remaining errors, both browser engines available.** WebKit initially skipped the implicit skip-link tab stop; adding `tabindex="0"` fixed it. A targeted retest confirmed first-Tab focus, Enter focus transfer, all FAQ keyboard toggles on both FAQ pages and mobile navigation in both engines. See `interaction-checks.cjs` and `targetedRetest` in the browser report.

These are browser-engine and viewport tests. They are not physical Android/iPhone device tests and do not certify every possible browser version or provide a formal accessibility audit. Mail links were inspected for correct recipients and subjects; sending actual email was not part of testing.

## SEO launch check

`production-metadata-checks.json` records a separate production-build test using an isolated, non-routable test origin. All nine canonical and Open Graph URLs, sitemap origins and the production robots directive matched. A production build without a configured domain correctly failed. The preview output was regenerated afterward; no test origin remains in the public site.

The canonical generator, crawl controls and sitemap are ready. They cannot truthfully refer to a real FT PVT. LIMITED domain until the owner supplies one. Social title/description metadata is present; no unrelated or invented social-preview image is used.

## Legal and product information

The supplied target-app policy already belonged to FT PVT. LIMITED. Its 20 substantive sections are preserved in the new layout, including its stated business contact, local file processing, SDK services, ads, subscriptions, retention and deletion choices. The app binary and its SDK configuration were not supplied and were not independently audited. General reference-company policies about unrelated products were replaced with website-specific privacy and relevant terms.

The owner confirmed the listed document formats. App-store availability, price, ratings, install counts and release dates were not invented.

Official provider references were checked through web retrieval/search:

- [Firebase privacy and security](https://firebase.google.com/support/privacy/)
- [Google Play subscription guidance](https://support.google.com/googleplay/answer/7018481)
- [Google advertising consent documentation](https://developers.google.com/admob/android/privacy)
- [Google privacy policy](https://policies.google.com/privacy)
- [Google partner-site information](https://policies.google.com/technologies/partner-sites)
- [ML Kit terms and privacy](https://developers.google.com/ml-kit/terms) — direct retrieval had a cache/connection failure; the exact official document was verified through indexed search. This is not a confirmed live HTTP response test.

## Deployment boundaries

No public deployment or DNS changes were made. The user requested an edited downloadable project. Publish only `dist/` after configuring and rebuilding for the final domain. Configure HTTPS, directory indexes, the supplied security headers where supported, and a genuine 404 status. Host behavior and public-domain indexing must be verified after deployment.

See REQUIREMENTS-CHECKLIST.md for the 19 checks mapped to this task and the limitation on reading the original conversation.
