/* Shared interactions and app views. The website uses no framework or backend. */
"use strict";
document.documentElement.classList.add("js");
const apps = Array.isArray(window.FT_APPS) ? window.FT_APPS : [];
const email = "kcorporation70@gmail.com";
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[character]);
const icons = {
  document: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  leaf: '<path d="M20 4c-8-2-15 2-15 9a6 6 0 0 0 6 6c7 0 9-7 9-15Z"/><path d="M4 21 15 10M10 15v-5M10 15h5"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>'
};
function safeUrl(value) {
  if (!value) return "";
  try {
    const parsed = new URL(value, document.baseURI);
    return ["https:", "http:", "mailto:"].includes(parsed.protocol) ? value : "";
  } catch { return ""; }
}
function icon(app) {
  const color = ["blue", "green", "purple", "orange"].includes(app.color) ? app.color : "blue";
  const supplied = safeUrl(app.iconUrl);
  return `<span class="app-icon ${color}">${supplied ? `<img src="${escapeHTML(supplied)}" alt="${escapeHTML(app.name)} icon" width="80" height="80">` : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${escapeHTML(app.name)} icon">${icons[app.icon] || icons.grid}</svg>`}</span>`;
}
function detailsUrl(app) { return `/${encodeURIComponent(app.id)}/`; }
function card(app) {
  const privacy = safeUrl(app.privacyUrl);
  return `<article class="app-card ${escapeHTML(app.color || "blue")}"><div class="card-art">${icon(app)}${app.platform ? `<span class="platform">${escapeHTML(app.platform)}</span>` : ""}</div><div class="app-copy"><span class="category">${escapeHTML(app.category || "Mobile app")}${app.status ? ` · ${escapeHTML(app.status)}` : ""}</span><h3>${escapeHTML(app.name)}</h3><p>${escapeHTML(app.description)}</p><div class="card-links"><a class="btn" href="${detailsUrl(app)}" aria-label="View details for ${escapeHTML(app.name)}">View details <span aria-hidden="true">↗</span></a>${privacy ? `<a href="${escapeHTML(privacy)}" aria-label="Privacy policy for ${escapeHTML(app.name)}">Privacy policy</a>` : ""}</div></div></article>`;
}
function renderCards(target, list) {
  if (!target) return;
  target.classList.toggle("many", list.length > 2);
  target.innerHTML = list.length ? list.map(card).join("") : '<div class="empty"><h2>No matching apps</h2><p>Try a different name or category.</p></div>';
}

const menu = document.querySelector(".menu");
const nav = document.querySelector("#primary-nav");
function closeMenu(restoreFocus = false) {
  if (!nav || !menu) return;
  nav.classList.remove("open");
  menu.setAttribute("aria-expanded", "false");
  menu.textContent = "Menu";
  if (restoreFocus) menu.focus();
}
if (menu && nav) {
  menu.addEventListener("click", () => {
    const expanded = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(expanded));
    menu.textContent = expanded ? "Close" : "Menu";
  });
  nav.addEventListener("click", event => { if (event.target.closest("a")) closeMenu(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && nav.classList.contains("open")) closeMenu(true); });
  document.addEventListener("click", event => { if (!event.target.closest(".header")) closeMenu(); });
  window.matchMedia("(min-width: 761px)").addEventListener("change", () => closeMenu());
}

const featured = document.querySelector("#featured-apps");
renderCards(featured, apps.slice(0, 2));
const showcase = document.querySelector("#showcase-apps");
if (showcase) showcase.innerHTML = apps.slice(0, 2).map(app => `<a class="spotlight" href="${detailsUrl(app)}"><div class="spotlight-row"><div class="spotlight-info">${icon(app)}<div><h2>${escapeHTML(app.name)}</h2><span class="category">${escapeHTML(app.category)} · ${escapeHTML(app.platform)}</span></div></div><span class="round-arrow" aria-hidden="true">↗</span></div><p>${escapeHTML(app.description)}</p></a>`).join("");

document.querySelectorAll("[data-policy-links]").forEach(target => {
  const prefix = target.dataset.prefix || "";
  target.innerHTML = apps.filter(app => safeUrl(app.privacyUrl)).map(app => `<a class="trust-link" href="${escapeHTML(prefix + app.privacyUrl)}"><span>${escapeHTML(app.name)}<br><small>Privacy policy</small></span><span aria-hidden="true">↗</span></a>`).join("");
});

const catalog = document.querySelector("#app-catalog");
if (catalog) {
  const id = document.body.dataset.appId || new URLSearchParams(location.search).get("app");
  const detail = document.querySelector("#app-detail");
  if (id) {
    document.querySelector("#catalog-view").hidden = true;
    detail.hidden = false;
    const app = apps.find(item => item.id === id);
    if (!app) {
      document.title = "App not found | FT PVT. LIMITED";
      detail.innerHTML = '<div class="empty"><h1>App not found.</h1><p>This app is not in our catalog. Browse our apps to find the right page.</p><div class="actions"><a class="btn" href="/apps/">Back to all apps</a></div></div>';
      const robots = document.createElement("meta"); robots.name = "robots"; robots.content = "noindex,follow"; document.head.append(robots);
    } else {
      document.title = `${app.name} | FT PVT. LIMITED`;
      const title = document.title;
      document.querySelector('meta[name="description"]').content = app.description;
      for (const key of ["og:title", "twitter:title"]) document.querySelector(`meta[property="${key}"],meta[name="${key}"]`).content = title;
      for (const key of ["og:description", "twitter:description"]) document.querySelector(`meta[property="${key}"],meta[name="${key}"]`).content = app.description;
      const canonical = new URL(detailsUrl(app), "https://ftpvtlimited.github.io/").href;
      document.querySelector('link[rel="canonical"]').href = canonical;
      document.querySelector('meta[property="og:url"]').content = canonical;
      const privacy = safeUrl(app.privacyUrl);
      const terms = safeUrl(app.termsUrl);
      const store = safeUrl(app.storeUrl);
      const enquiry = `mailto:${email}?subject=${encodeURIComponent(app.name + " availability")}`;
      detail.innerHTML = `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/apps/">Apps</a><span aria-hidden="true">/</span><span aria-current="page">${escapeHTML(app.name)}</span></nav><section class="detail-hero ${escapeHTML(app.color || "blue")}">${icon(app)}<div><span class="platform">${escapeHTML(app.platform || "Mobile app")}${app.status ? ` · ${escapeHTML(app.status)}` : ""}</span><h1>${escapeHTML(app.name)}</h1><p>${escapeHTML(app.intro || app.description)}</p></div></section><div class="detail-grid"><div><section class="detail-box"><h2>A closer look</h2><ul class="feature-list">${(app.features || []).map(feature => `<li><h3>${escapeHTML(feature.title)}</h3><p>${escapeHTML(feature.text)}</p></li>`).join("")}</ul></section>${app.formats?.length ? `<section class="detail-box"><h2>Supported formats</h2><p class="small">${escapeHTML(app.compatibility || "")}</p><div class="format-list">${app.formats.map(format => `<span>${escapeHTML(format)}</span>`).join("")}</div></section>` : ""}${app.note ? `<section class="detail-box"><h2>Good to know</h2><p class="notice">${escapeHTML(app.note)}</p></section>` : ""}</div><div><section class="detail-box"><h2>Find your next step.</h2><p>Get the current availability${store ? " and download details" : " information"} for ${escapeHTML(app.name)}.</p><div class="actions"><a class="btn" href="${escapeHTML(store || enquiry)}">${store ? "Visit app store" : "Ask about availability"} <span aria-hidden="true">↗</span></a></div>${!store ? '<p class="small" style="margin-top:16px">Email us for the official download link.</p>' : ""}</section><section class="detail-box"><h2>Privacy, explained.</h2><p class="small">${escapeHTML(app.privacySummary || "Read the app’s privacy policy for its information-handling practices.")}</p><div class="actions">${privacy ? `<a class="text-link" href="${escapeHTML(privacy)}">Read privacy policy ↗</a>` : ""}${terms ? `<a class="text-link" href="${escapeHTML(terms)}">Terms &amp; Conditions</a>` : ""}</div></section></div></div>`;
    }
  } else {
    renderCards(catalog, apps);
    const count = document.querySelector("#app-count");
    count.textContent = `${apps.length} ${apps.length === 1 ? "app" : "apps"}`;
    if (apps.length > 4) {
      const search = document.querySelector("#search-apps");
      search.parentElement.hidden = false;
      search.addEventListener("input", () => {
        const query = search.value.trim().toLocaleLowerCase();
        const filtered = apps.filter(app => `${app.name} ${app.category} ${app.description}`.toLocaleLowerCase().includes(query));
        renderCards(catalog, filtered);
        count.textContent = `${filtered.length} of ${apps.length} apps`;
      });
    }
  }
}
