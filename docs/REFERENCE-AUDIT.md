# Reference inspection

Inspected 25 September 2026, before implementation. Source: the matching uploaded ZIP found locally in Downloads. The original archive and synced sources remain unchanged. This report is documentation, not public site content.

## Structure and page flow

The reference is a buildless static HTML/CSS/JavaScript website with directory-based index.html routes. Main routes: Home, /apps/, /about/, /support/, /privacy/, /terms/, /app-store/, individual /apps/{slug}/ pages, nested /privacy/ pages, one unrelated account-deletion page, and /404.html. The archive also contains numerous alternate root HTML snapshots, duplicate root scripts/styles/icons, an archive folder, an extensionless download file, and an advertising publisher file. These are excluded from the new deliverable.

Home flows from hero and app explorer to company introduction, values, app cards, featured app, store links and a closing CTA. The app listing uses status filters. App details offer a back-to-apps journey, introduction, store buttons, feature list, privacy and support. Legal pages use a contents navigation beside numbered sections. These useful patterns are retained without multi-product controls.

## Components and behavior

Most pages mount shared header/footer from JavaScript. Central configuration provides identity, social URLs and featured product. Central app data drives listings, homepage sliders and detail rendering. The target product already has a separately authored static page and a detailed company-specific privacy policy; it is absent from the centralized product data. Consequently the reference's target product and generic site branding are inconsistent.

The homepage has both an app explorer and carousel; the catalog has all/live/coming-soon filters. Neither is useful for a single product and both are removed. Store buttons for other products and the speculative Apple availability page are removed. Contact/support use direct email; the rebuilt site does not pretend to submit a contact form.

## CSS and responsive behavior

Shared CSS uses custom properties, a 1160px container, grid/flex layouts, rounded cards, sticky translucent header and blue-on-light theme. Fonts are loaded remotely. Breakpoints at 980px, 760px and 430px collapse columns, enable a mobile nav and stack CTAs; the app carousel shows three/two/one cards. Reduced-motion styling exists. Legal styles include later compatibility overrides. New CSS replaces this with a consistent colorful dark theme with violet, cyan, coral and yellow accents, local system fonts, readable 16px body copy, responsive grids, visible focus and reduced-motion support.

## SEO and links

Inspected pages contain titles, descriptions and viewport metadata, but lack systematic canonical and social metadata. Generic detail titles are changed client-side. robots.txt allows crawling without a sitemap directive; no sitemap.xml is present. Several initial links are placeholders populated by scripts. The rebuild renders all navigation, product content and metadata as static HTML. Only domain-dependent canonical/OG URLs and sitemap origins require a verified production origin.

## Legal architecture

The generic reference privacy/terms cover unrelated accounts, cloud backup, media downloads and multiple apps. They must not be carried forward. The target app privacy policy already names FT PVT. LIMITED and the supplied contact email. It documents local file processing, Firebase services, ML Kit, AdMob/UMP, subscriptions, retention, rights, and deletion choices. Preserve its substantive disclosures and nested route, with new shared layout. The website privacy policy describes this website separately. No account-deletion route is needed because the supplied target policy says no company account exists.

## Assets and factual boundaries

Available images are reference-company branding and icons for unrelated products; no verified target-app icon or screenshots are supplied. Do not relabel another product's image. Use a new simple FT monogram favicon and typographic product presentation. The target page confirms Android and PDF, but not a complete format list, official download URL or production domain. Those require owner confirmation; never borrow another app's store ID or invent compatibility.

## Resulting route plan

/, /apps/, /apps/all-document-reader/, /about/, /contact/, /support/, /privacy-policy/, /terms-and-conditions/, /apps/all-document-reader/privacy/, and /404.html. Preserve /privacy/ and /terms/ as compatibility redirects with visible fallback links. The only marketed product is All Document Reader.

## Original prompt availability

The linked conversation preview ends partway through section 3. Two attempts to retrieve the full conversation returned “Too many requests.” Until retrieval succeeds, a 19-point checklist can map the current request, but cannot honestly certify the unavailable original numbered list.
