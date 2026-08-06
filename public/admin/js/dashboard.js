const body = document.body;
const sidebar = document.querySelector("#sidebar");
const menuToggle = document.querySelector("#menuToggle");
const sidebarClose = document.querySelector("#sidebarClose");
const sidebarOverlay = document.querySelector("#sidebarOverlay");
const moduleSearch = document.querySelector("#moduleSearch");
const moduleCards = [...document.querySelectorAll(".module-card")];

const closeSidebar = () => body.classList.remove("sidebar-open");

menuToggle?.addEventListener("click", () => body.classList.add("sidebar-open"));
sidebarClose?.addEventListener("click", closeSidebar);
sidebarOverlay?.addEventListener("click", closeSidebar);
sidebar?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeSidebar();
});

moduleSearch?.addEventListener("input", () => {
  const term = moduleSearch.value.trim().toLowerCase();
  moduleCards.forEach((card) => {
    card.classList.toggle("hidden", !card.dataset.search.includes(term));
  });
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    moduleSearch?.focus();
  }
  if (event.key === "Escape") closeSidebar();
});

const today = document.querySelector("#today");
if (today) {
  today.textContent = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(new Date());
}
