"use strict";
document.documentElement.classList.add("js");
const menu = document.querySelector(".menu");
const nav = document.getElementById("primary-nav");
function closeMenu(restoreFocus = false) {
  nav.classList.remove("open");
  menu.setAttribute("aria-expanded", "false");
  menu.textContent = "Menu";
  if (restoreFocus) menu.focus();
}
menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
  menu.textContent = open ? "Close" : "Menu";
});
nav.addEventListener("click", event => { if (event.target.closest("a")) closeMenu(); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && nav.classList.contains("open")) closeMenu(true);
});
document.addEventListener("click", event => {
  if (!event.target.closest(".header")) closeMenu();
});
window.matchMedia("(min-width: 761px)").addEventListener("change", () => closeMenu());
