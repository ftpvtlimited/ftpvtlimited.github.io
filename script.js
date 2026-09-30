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
function detailsUrl(app) { return safeUrl(app.pageUrl) || `/apps/?app=${encodeURIComponent(app.id)}`; }
function card(app) {
  const privacy = safeUrl(app.privacyUrl);
  return `<article class="app-card ${escapeHTML(app.color || "blue")}"><div class="card-art">${icon(app)}</div><div class="app-copy"><span class="category">${escapeHTML(app.category || "Mobile app")}${app.status ? ` · ${escapeHTML(app.status)}` : ""}</span><h3>${escapeHTML(app.name)}</h3><p>${escapeHTML(app.description)}</p><div class="card-links"><a class="btn" href="${detailsUrl(app)}" aria-label="View details for ${escapeHTML(app.name)}">View details <span aria-hidden="true">↗</span></a>${privacy ? `<a href="${escapeHTML(privacy)}" aria-label="Privacy policy for ${escapeHTML(app.name)}">Privacy policy</a>` : ""}</div>${storeButtons(app)}</div></article>`;
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
renderCards(featured, apps);
const showcase = document.querySelector("#showcase-apps");
if (showcase) showcase.innerHTML = apps.map(app => `<a class="spotlight" href="${detailsUrl(app)}"><div class="spotlight-row"><div class="spotlight-info">${icon(app)}<div><h2>${escapeHTML(app.name)}</h2><span class="category">${escapeHTML(app.category)}</span></div></div><span class="round-arrow" aria-hidden="true">↗</span></div><p>${escapeHTML(app.description)}</p></a>`).join("");

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
      detail.innerHTML = `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/apps/">Apps</a><span aria-hidden="true">/</span><span aria-current="page">${escapeHTML(app.name)}</span></nav><section class="detail-hero ${escapeHTML(app.color || "blue")}">${icon(app)}<div><span class="platform">${escapeHTML(app.category || "Mobile app")}${app.status ? ` · ${escapeHTML(app.status)}` : ""}</span><h1>${escapeHTML(app.name)}</h1><p>${escapeHTML(app.intro || app.description)}</p></div></section><div class="detail-grid"><div><section class="detail-box"><h2>A closer look</h2><ul class="feature-list">${(app.features || []).map(feature => `<li><h3>${escapeHTML(feature.title)}</h3><p>${escapeHTML(feature.text)}</p></li>`).join("")}</ul></section>${app.formats?.length ? `<section class="detail-box"><h2>Supported formats</h2><p class="small">${escapeHTML(app.compatibility || "")}</p><div class="format-list">${app.formats.map(format => `<span>${escapeHTML(format)}</span>`).join("")}</div></section>` : ""}${app.note ? `<section class="detail-box"><h2>Good to know</h2><p class="notice">${escapeHTML(app.note)}</p></section>` : ""}</div><div><section class="detail-box"><h2>Find your next step.</h2><p>Get the current availability${store ? " and download details" : " information"} for ${escapeHTML(app.name)}.</p>${storeButtons(app)}</section><section class="detail-box"><h2>Privacy, explained.</h2><p class="small">${escapeHTML(app.privacySummary || "Read the app’s privacy policy for its information-handling practices.")}</p><div class="actions">${privacy ? `<a class="text-link" href="${escapeHTML(privacy)}">Read privacy policy ↗</a>` : ""}${terms ? `<a class="text-link" href="${escapeHTML(terms)}">Terms &amp; Conditions</a>` : ""}</div></section></div></div>`;
    }
  } else {
    renderCards(catalog, apps);
    const count = document.querySelector("#app-count");
    count.textContent = `${apps.length} ${apps.length === 1 ? "app" : "apps"}`;
    const search = document.querySelector("#search-apps");
    search.parentElement.hidden = false;
    const filter = document.createElement("select");
    filter.className = "search";
    filter.setAttribute("aria-label", "Filter apps by category");
    filter.innerHTML = '<option value="">All apps</option><option value="coming">Coming soon</option>' + [...new Set(apps.map(a=>a.category))].map(c=>`<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");
    search.parentElement.after(filter);
    const update = () => {
      const q = search.value.trim().toLocaleLowerCase();
      const list = apps.filter(a => `${a.name} ${a.category} ${a.description}`.toLocaleLowerCase().includes(q) && (!filter.value || (filter.value === "coming" ? a.status === "Coming soon" : a.category === filter.value)));
      renderCards(catalog,list);
      count.textContent = `${list.length} of ${apps.length} apps`;
      updateSliders();
    };
    search.addEventListener("input", update);
    filter.addEventListener("change", update);
  }
}

function storeButtons(app) {
  return `<div class="store-buttons">${[["Google Play Store","play",app.storeUrl],["App Store","apple",app.appStoreUrl]].map(([label,key,url])=> {
    const href = app.status === "Coming soon" ? "" : safeUrl(url);
    return `<a class="store-button" href="${escapeHTML(href || `/coming-soon/?app=${encodeURIComponent(app.id)}&store=${key}`)}" aria-label="${escapeHTML(label + ' for ' + app.name + (href ? '' : ' — coming soon'))}"><span aria-hidden="true">${key === "play" ? "▷" : "◇"}</span><span><small>${href ? "Explore on" : "Coming soon on"}</small>${label}</span></a>`;
  }).join("")}</div>`;
}

// A single catalog name populates cards, policy text, accessibility labels and metadata.
document.querySelectorAll("[data-app-name]").forEach(el=> {
 const app=apps.find(a=>a.id===el.dataset.appName);
 if(app) el.textContent=app.name;
});
const policyApp=apps.find(a=>a.id===document.body.dataset.policyApp);
if(policyApp) {
 document.title=`${policyApp.name} Privacy Policy | FT PVT. LIMITED`;
 for(const key of ["og:title","twitter:title"]) document.querySelector(`meta[property="${key}"],meta[name="${key}"]`).content=document.title;
 for(const key of ["description","og:description","twitter:description"]) document.querySelector(`meta[property="${key}"],meta[name="${key}"]`).content=`Privacy policy for ${policyApp.name}: permissions, information processing and your choices.`;
}
const coming=document.querySelector("#coming-message");
if(coming) {
 const params=new URLSearchParams(location.search);
 const app=apps.find(a=>a.id===params.get("app"));
 if(app) {
   const store=params.get("store")==="apple" ? "App Store" : "Google Play Store";
   document.querySelector("h1").textContent=`${app.name} is coming soon`;
   coming.textContent=`We’re preparing ${app.name} for release. The ${store} download link is not available yet. Check back here for updates.`;
   document.querySelector("#coming-icon").innerHTML=icon(app);
   document.querySelector("#coming-policy").href=safeUrl(app.privacyUrl)||"/privacy/";
   document.title=`${app.name} — Coming soon | FT PVT. LIMITED`;
   for(const key of ["og:title","twitter:title"]) document.querySelector(`meta[property="${key}"],meta[name="${key}"]`).content=document.title;
 }
}

function updateSliders() {
 document.querySelectorAll(".app-slider").forEach(slider=>slider.dispatchEvent(new Event("scroll")));
}
for(const target of [featured, showcase, ...document.querySelectorAll(".trust-panel [data-policy-links]")].filter(Boolean)) {
 if(target.closest("[hidden]")) continue;
 target.classList.add("app-slider");
 target.setAttribute("role","region");
 target.setAttribute("aria-label",target === showcase ? "Featured apps" : target.hasAttribute("data-policy-links") ? "App privacy policies" : "App collection");
 target.tabIndex=0;
 const controls=document.createElement("div"); controls.className="slider-controls";
 controls.innerHTML='<span>Swipe or use the arrows to explore</span><div><button type="button" aria-label="Previous apps">←</button><button type="button" aria-label="Next apps">→</button></div>';
 const shell=document.createElement("div"); shell.className="slider-shell"; target.before(shell); shell.append(controls,target);
 const [prev,next]=controls.querySelectorAll("button");
 const move=direction=>target.scrollBy({left:direction*(target.firstElementChild?.getBoundingClientRect().width+24 || target.clientWidth),behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
 prev.onclick=()=>move(-1);next.onclick=()=>move(1);
 target.addEventListener("keydown",e=>{if(e.target!==target)return;if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault();move(e.key==="ArrowRight"?1:-1);}});
 const sync=()=>{prev.disabled=target.scrollLeft<=1;next.disabled=target.scrollLeft+target.clientWidth>=target.scrollWidth-2;};
 target.addEventListener("scroll",sync,{passive:true});new ResizeObserver(sync).observe(target);sync();
}
