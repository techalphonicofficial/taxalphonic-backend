const headerList = document.querySelector("#headerList");
const headerListPanel = document.querySelector("#headerListPanel");
const headerEditor = document.querySelector("#headerEditor");
const headerForm = document.querySelector("#headerForm");
const headerSearch = document.querySelector("#headerSearch");
const sourceSearch = document.querySelector("#sourceSearch");
const sourceList = document.querySelector("#sourceList");
const selectedMenuList = document.querySelector("#selectedMenuList");
const headerToast = document.querySelector("#headerToast");
const headerGalleryModal = document.querySelector("#headerGalleryModal");
const headerGalleryGrid = document.querySelector("#headerGalleryGrid");
const builderType = document.body.dataset.builderType === "footer" ? "footer" : "header";
const entityLabel = builderType;
const entityTitle = builderType === "footer" ? "Footer" : "Header";
const entityIcon = builderType === "footer" ? "F" : "H";
const adminBasePath = `/admin/${builderType}`;
const apiBasePath = `/api/${builderType}s`;
const rowNames = builderType === "footer"
  ? { top: "Main Footer", main: "Bottom Footer" }
  : { top: "Top Header", main: "Main Header" };

let headers = [];
let navigation = { hierarchy: [], categories: [], services: [], subServices: [] };
let editingId = null;
let activeRow = "top";
let activeSource = "category";
let slugWasEdited = false;
let layout = { version: 2, logo: { url: "", alt: "", href: "/" }, top: [], main: [] };
let toastTimer;
let routeActionHandled = false;
let draggedItemPath = null;
let editingItemPath = null;
const expandedCategoryIds = new Set();
const expandedServiceIds = new Set();

const escapeHtml = (value = "") => {
  const element = document.createElement("div");
  element.textContent = String(value ?? "");
  return element.innerHTML.replaceAll('"', "&quot;").replaceAll("'", "&#39;");
};

const slugify = (value) => String(value || "")
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(data?.message || "Something went wrong");
  return data;
}

function showToast(message, type = "success") {
  headerToast.textContent = message;
  headerToast.className = `header-toast show ${type === "error" ? "error" : ""}`;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { headerToast.className = "header-toast"; }, 2500);
}

function normalizeSavedLayout(savedLayout) {
  const normalizeItems = (items) => Array.isArray(items) ? items.map((item) => ({
    ...item,
    children: normalizeItems(item?.children),
  })) : [];

  return {
    version: 2,
    logo: {
      url: savedLayout?.logo?.url || "",
      alt: savedLayout?.logo?.alt || "",
      href: savedLayout?.logo?.href || "/",
    },
    top: normalizeItems(savedLayout?.top),
    main: normalizeItems(savedLayout?.main),
  };
}

const flattenItems = (items) => items.flatMap((item) => [item, ...flattenItems(item.children || [])]);

function findLayoutItem(items, type, id) {
  for (const item of items) {
    if (item.type === type && String(item.id) === String(id)) return item;
    const match = findLayoutItem(item.children || [], type, id);
    if (match) return match;
  }
  return null;
}

function removeLayoutItem(items, path) {
  const [index, ...rest] = path;
  if (!Number.isInteger(index) || !items[index]) return;
  if (!rest.length) {
    items.splice(index, 1);
    return;
  }
  removeLayoutItem(items[index].children || [], rest);
}

function getItemsAtParentPath(items, parentPath) {
  let currentItems = items;
  for (const index of parentPath) {
    const item = currentItems[index];
    if (!item) return null;
    item.children = Array.isArray(item.children) ? item.children : [];
    currentItems = item.children;
  }
  return currentItems;
}

function getItemAtPath(items, path) {
  let currentItem = null;
  let currentItems = items;
  for (const index of path) {
    currentItem = currentItems[index];
    if (!currentItem) return null;
    currentItems = currentItem.children || [];
  }
  return currentItem;
}

function getSubtreeDepth(item) {
  const children = item?.children || [];
  return children.length ? 1 + Math.max(...children.map(getSubtreeDepth)) : 0;
}

function containsItem(parent, candidate) {
  return (parent?.children || []).some((child) => child === candidate || containsItem(child, candidate));
}

function getDropPlacement(event, target) {
  const bounds = target.getBoundingClientRect();
  const relativeY = (event.clientY - bounds.top) / bounds.height;
  if (relativeY < .25) return "before";
  if (relativeY > .75) return "after";
  return "inside";
}

function canMoveLayoutItem(sourcePath, targetPath, placement) {
  const items = layout[activeRow];
  const sourceItem = getItemAtPath(items, sourcePath);
  const targetItem = getItemAtPath(items, targetPath);
  if (!sourceItem || !targetItem || sourceItem === targetItem || containsItem(sourceItem, targetItem)) return false;

  const newRootDepth = placement === "inside" ? targetPath.length : targetPath.length - 1;
  return newRootDepth + getSubtreeDepth(sourceItem) <= 2;
}

function moveLayoutItem(sourcePath, targetPath, placement) {
  if (!canMoveLayoutItem(sourcePath, targetPath, placement)) return false;

  const items = layout[activeRow];
  const sourceContainer = getItemsAtParentPath(items, sourcePath.slice(0, -1));
  const targetContainer = getItemsAtParentPath(items, targetPath.slice(0, -1));
  const sourceItem = getItemAtPath(items, sourcePath);
  const targetItem = getItemAtPath(items, targetPath);
  if (!sourceContainer || !targetContainer) return false;

  sourceContainer.splice(sourceContainer.indexOf(sourceItem), 1);
  if (placement === "inside") {
    targetItem.children = Array.isArray(targetItem.children) ? targetItem.children : [];
    targetItem.children.push(sourceItem);
  } else {
    const targetIndex = targetContainer.indexOf(targetItem);
    targetContainer.splice(targetIndex + (placement === "after" ? 1 : 0), 0, sourceItem);
  }
  return true;
}

function clearDragStyles() {
  selectedMenuList.querySelectorAll(".dragging, .drop-before, .drop-inside, .drop-after").forEach((element) => {
    element.classList.remove("dragging", "drop-before", "drop-inside", "drop-after");
  });
}

const countItems = (items) => flattenItems(items).length;

function renderHeaders() {
  const term = headerSearch.value.trim().toLowerCase();
  const filtered = headers.filter((header) => `${header.name} ${header.slug}`.toLowerCase().includes(term));
  if (!filtered.length) {
    headerList.innerHTML = `<div class="header-empty"><span>${entityIcon}</span><h3>${headers.length ? `No matching ${entityLabel}s` : `No ${entityLabel}s yet`}</h3><p>${headers.length ? "Try another search." : `Click Create ${entityLabel} to add a website ${entityLabel}.`}</p></div>`;
    return;
  }

  headerList.innerHTML = filtered.map((header) => {
    const savedLayout = normalizeSavedLayout(header.layout);
    const topCount = countItems(savedLayout.top);
    const mainCount = countItems(savedLayout.main);
    const itemCount = topCount + mainCount;
    return `
      <article class="simple-header-card">
        <span class="header-card-icon">${entityIcon}</span>
        <div class="simple-header-info">
          <h3>${escapeHtml(header.name)}</h3>
          <p>/${escapeHtml(header.slug)} · ${topCount} ${builderType === "footer" ? "main" : "top"} item(s) · ${mainCount} ${builderType === "footer" ? "bottom" : "main"} item(s)</p>
          <div class="header-card-meta">
            <span class="header-status ${escapeHtml(header.status)}">${escapeHtml(header.status)}</span>
            ${header.is_default ? '<span class="header-default">Default</span>' : ""}
            <span>${itemCount} menu item(s)</span>
          </div>
        </div>
        <div class="simple-header-actions">
          <button type="button" data-edit-header="${header.id}">Edit</button>
          <button class="delete-header" type="button" data-delete-header="${header.id}">Delete</button>
        </div>
      </article>`;
  }).join("");
}

function renderSources() {
  document.querySelector("#sourceBrowser").hidden = activeSource === "custom";
  document.querySelector("#customPageForm").hidden = activeSource !== "custom";
  if (activeSource === "custom") return;

  const query = sourceSearch.value.trim().toLowerCase();
  const currentKeys = new Set(flattenItems(layout[activeRow]).map((item) => `${item.type}:${item.id}`));
  const groups = navigation.hierarchy.filter((category) => {
    if (!query) return true;
    if (`${category.name} ${category.slug}`.toLowerCase().includes(query)) return true;
    return (category.children || []).some((service) =>
      `${service.name} ${service.slug}`.toLowerCase().includes(query)
      || (service.children || []).some((subService) =>
        `${subService.name} ${subService.slug}`.toLowerCase().includes(query)),
    );
  });

  sourceList.innerHTML = groups.length ? groups.map((category) => {
    const categoryOpen = query || expandedCategoryIds.has(category.id);
    const categoryAdded = currentKeys.has(`category:${category.id}`);
    const categoryMatches = `${category.name} ${category.slug}`.toLowerCase().includes(query);
    const services = (category.children || []).filter((service) => {
      if (!query || categoryMatches) return true;
      return `${service.name} ${service.slug}`.toLowerCase().includes(query)
        || (service.children || []).some((subService) =>
          `${subService.name} ${subService.slug}`.toLowerCase().includes(query));
    });
    return `
      <div class="header-tree-group">
        <div class="header-tree-row category-row">
          <button class="tree-toggle" type="button" data-toggle-category="${category.id}" aria-expanded="${Boolean(categoryOpen)}">
            <span class="tree-chevron">${categoryOpen ? "⌄" : "›"}</span>
            <span class="source-item-icon">${escapeHtml(category.name.charAt(0).toUpperCase())}</span>
            <span class="tree-label"><strong>${escapeHtml(category.name)}</strong><small>${services.length} service${services.length === 1 ? "" : "s"}</small></span>
          </button>
          <button class="tree-add ${categoryAdded ? "added" : ""}" type="button" data-add-tree="category" data-item-id="${category.id}" ${categoryAdded ? "disabled" : ""}>${categoryAdded ? "✓" : "+"}</button>
        </div>
        ${categoryOpen ? `<div class="service-tree">${services.length ? services.map((service) => {
          const serviceOpen = query || expandedServiceIds.has(service.id);
          const serviceAdded = currentKeys.has(`service:${service.id}`);
          const subServices = (service.children || []).filter((subService) =>
            !query || `${subService.name} ${subService.slug}`.toLowerCase().includes(query));
          return `
            <div class="service-tree-group">
              <div class="header-tree-row service-row">
                <button class="tree-toggle" type="button" data-toggle-service="${service.id}" aria-expanded="${Boolean(serviceOpen)}">
                  <span class="tree-chevron">${serviceOpen ? "⌄" : "›"}</span>
                  <span class="tree-label"><strong>${escapeHtml(service.name)}</strong><small>${subServices.length} sub service${subServices.length === 1 ? "" : "s"}</small></span>
                </button>
                <button class="tree-add ${serviceAdded ? "added" : ""}" type="button" data-add-tree="service" data-item-id="${service.id}" ${serviceAdded ? "disabled" : ""}>${serviceAdded ? "✓" : "+"}</button>
              </div>
              ${serviceOpen ? `<div class="sub-service-tree">${subServices.length ? subServices.map((subService) => {
                const subAdded = currentKeys.has(`sub_service:${subService.id}`);
                return `<div class="header-tree-row sub-service-row"><span class="tree-branch">└</span><span class="tree-label"><strong>${escapeHtml(subService.name)}</strong><small>/${escapeHtml(subService.slug)}</small></span><button class="tree-add ${subAdded ? "added" : ""}" type="button" data-add-tree="sub_service" data-item-id="${subService.id}" ${subAdded ? "disabled" : ""}>${subAdded ? "✓" : "+"}</button></div>`;
              }).join("") : '<p class="tree-empty">No sub services linked.</p>'}</div>` : ""}
            </div>`;
        }).join("") : '<p class="tree-empty">No services linked to this category.</p>'}</div>` : ""}
      </div>`;
  }).join("") : '<div class="header-empty"><p>No matching items found.</p></div>';
}

function renderSelected() {
  const items = layout[activeRow];
  const renderItems = (menuItems, parentPath = [], depth = 0) => menuItems.map((item, index) => {
    const path = [...parentPath, index];
    const pathKey = path.join(".");
    const children = item.children || [];
    const isEditing = editingItemPath === pathKey;
    return `
      <div class="selected-item-wrap depth-${Math.min(depth, 2)}">
        <div class="selected-item" draggable="${isEditing ? "false" : "true"}" data-item-path="${pathKey}">
          <span class="selected-handle" title="Drag to reorder" aria-hidden="true">⋮⋮</span>
          <div class="selected-item-copy"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.type === "sub_service" ? "sub service" : item.type)} · ${escapeHtml(item.type === "custom" ? item.url : `/${item.slug}`)}${children.length ? ` · ${children.length} child item${children.length === 1 ? "" : "s"}` : ""}</small></div>
          <div class="selected-item-actions">
            <button class="edit-selected-item" type="button" data-edit-path="${pathKey}" aria-label="Edit ${escapeHtml(item.name)}" title="Edit item">✎</button>
            <button class="remove-selected-item" type="button" data-remove-path="${pathKey}" aria-label="Remove ${escapeHtml(item.name)}" title="Remove item">×</button>
          </div>
        </div>
        ${isEditing ? `
          <form class="selected-item-edit-form" data-edit-item-form="${pathKey}">
            <label><span>Display name</span><input name="item_name" maxlength="150" value="${escapeHtml(item.name)}" required></label>
            <label><span>${item.type === "custom" ? "URL" : "Slug"}</span><input name="item_link" maxlength="500" value="${escapeHtml(item.type === "custom" ? item.url : item.slug)}" required></label>
            <div class="selected-item-edit-actions">
              <button type="button" data-cancel-item-edit>Cancel</button>
              <button type="submit">Save changes</button>
            </div>
          </form>` : ""}
        ${children.length ? `<div class="selected-children">${renderItems(children, path, depth + 1)}</div>` : ""}
      </div>`;
  }).join("");
  const topCount = countItems(layout.top);
  const mainCount = countItems(layout.main);
  document.querySelector("#selectedRowTitle").textContent = `${rowNames[activeRow]} items`;
  document.querySelector("#topItemCount").textContent = `${topCount} item${topCount === 1 ? "" : "s"}`;
  document.querySelector("#mainItemCount").textContent = `${mainCount} item${mainCount === 1 ? "" : "s"}`;
  selectedMenuList.innerHTML = items.length ? renderItems(items) : `
      <div class="selected-empty">
        <span>＋</span>
        <p>No items in this row.<br>Choose a category or service from the left.</p>
      </div>`;
  renderSources();
}

function resetEditor() {
  editingId = null;
  activeRow = "top";
  activeSource = "category";
  slugWasEdited = false;
  editingItemPath = null;
  layout = { version: 2, logo: { url: "", alt: "", href: "/" }, top: [], main: [] };
  headerForm.reset();
  document.querySelector("#editorTitle").textContent = `Create ${entityLabel}`;
  document.querySelector("#saveHeader").textContent = `Save ${entityLabel}`;
  document.querySelectorAll("[data-row-tab]").forEach((tab) => {
    const selected = tab.dataset.rowTab === "top";
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
  });
  document.querySelectorAll("[data-source-tab]").forEach((tab) => tab.classList.toggle("active", tab.dataset.sourceTab === "category"));
  sourceSearch.value = "";
  sourceSearch.placeholder = "Search categories...";
  updateLogoPreview();
  renderSelected();
}

function openEditor(header = null) {
  resetEditor();
  if (header) {
    editingId = header.id;
    layout = normalizeSavedLayout(header.layout);
    document.querySelector("#headerName").value = header.name;
    document.querySelector("#headerSlug").value = header.slug;
    document.querySelector("#headerStatus").value = header.status;
    document.querySelector("#defaultHeader").checked = Boolean(header.is_default);
    document.querySelector("#headerLogoUrl").value = layout.logo.url;
    document.querySelector("#headerLogoAlt").value = layout.logo.alt;
    document.querySelector("#headerLogoHref").value = layout.logo.href;
    updateLogoPreview();
    document.querySelector("#editorTitle").textContent = `Edit ${entityLabel}`;
    document.querySelector("#saveHeader").textContent = `Update ${entityLabel}`;
    slugWasEdited = true;
    renderSelected();
  }
  headerEditor.hidden = false;
  headerEditor.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => document.querySelector("#headerName").focus(), 250);
}

function closeEditor() {
  headerEditor.hidden = true;
  window.history.replaceState({}, "", adminBasePath);
  headerListPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function loadData() {
  try {
    const [savedHeaders, menuData] = await Promise.all([
      request(apiBasePath),
      request("/api/header-navigation-data"),
    ]);
    headers = savedHeaders;
    navigation = {
      hierarchy: menuData.serviceCategories || [],
      categories: menuData.taxpedia || [],
      services: menuData.services || [],
      subServices: menuData.subServices || [],
    };
    renderHeaders();
    renderSources();

    if (!routeActionHandled) {
      routeActionHandled = true;
      const params = new URLSearchParams(window.location.search);
      const editId = Number(params.get("edit"));
      if (params.get("create") === "1") {
        openEditor();
      } else if (Number.isInteger(editId) && editId > 0) {
        const header = headers.find((item) => item.id === editId);
        if (header) {
          openEditor(header);
        } else {
          showToast(`${entityTitle} not found`, "error");
        }
      }
    }
  } catch (error) {
    headerList.innerHTML = `<div class="header-empty"><span>!</span><h3>Could not load ${entityLabel}s</h3><p>${escapeHtml(error.message)}</p></div>`;
    showToast(error.message, "error");
  }
}

document.querySelector("#createHeader").addEventListener("click", () => openEditor());
document.querySelector("#closeEditor").addEventListener("click", closeEditor);
document.querySelector("#cancelHeader").addEventListener("click", closeEditor);
headerSearch.addEventListener("input", renderHeaders);
sourceSearch.addEventListener("input", renderSources);

document.querySelector("#headerName").addEventListener("input", (event) => {
  if (!slugWasEdited) document.querySelector("#headerSlug").value = slugify(event.target.value);
});
document.querySelector("#headerSlug").addEventListener("input", (event) => {
  slugWasEdited = event.target.value.length > 0;
  event.target.value = slugify(event.target.value);
});

function updateLogoPreview() {
  const url = document.querySelector("#headerLogoUrl").value.trim();
  const alt = document.querySelector("#headerLogoAlt").value.trim();
  const image = document.querySelector("#headerLogoImage");
  const placeholder = document.querySelector("#headerLogoPreview span");
  image.hidden = !url;
  placeholder.hidden = Boolean(url);
  image.src = url || "";
  image.alt = alt;
}

document.querySelector("#headerLogoAlt").addEventListener("input", updateLogoPreview);

async function openHeaderGallery() {
  headerGalleryModal.classList.add("open");
  headerGalleryModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("header-modal-open");
  headerGalleryGrid.innerHTML = '<div class="header-gallery-empty">Loading Media Gallery...</div>';
  try {
    const images = await request("/api/media");
    headerGalleryGrid.innerHTML = images.length ? images.map((image) => `
      <button class="header-gallery-item" type="button" data-logo-path="${escapeHtml(image.path)}" data-logo-alt="${escapeHtml(image.alt_text || image.name)}">
        <img src="${escapeHtml(image.path)}" alt="${escapeHtml(image.alt_text || image.name)}">
        <span>${escapeHtml(image.name)}</span>
      </button>`).join("") : '<div class="header-gallery-empty">No images in Media Gallery yet.</div>';
  } catch (error) {
    headerGalleryGrid.innerHTML = `<div class="header-gallery-empty">${escapeHtml(error.message || "Media Gallery is not available yet.")}</div>`;
  }
}

function closeHeaderGallery() {
  headerGalleryModal.classList.remove("open");
  headerGalleryModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("header-modal-open");
}

document.querySelector("#chooseHeaderLogo").addEventListener("click", openHeaderGallery);
document.querySelector("#removeHeaderLogo").addEventListener("click", () => {
  document.querySelector("#headerLogoUrl").value = "";
  document.querySelector("#headerLogoAlt").value = "";
  updateLogoPreview();
});
document.querySelectorAll("[data-close-header-gallery]").forEach((element) => element.addEventListener("click", closeHeaderGallery));
headerGalleryGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-logo-path]");
  if (!button) return;
  document.querySelector("#headerLogoUrl").value = button.dataset.logoPath;
  document.querySelector("#headerLogoAlt").value = button.dataset.logoAlt;
  updateLogoPreview();
  closeHeaderGallery();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && headerGalleryModal.classList.contains("open")) closeHeaderGallery();
});

document.querySelectorAll("[data-row-tab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    activeRow = tab.dataset.rowTab;
    editingItemPath = null;
    document.querySelectorAll("[data-row-tab]").forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-selected", String(selected));
    });
    renderSelected();
  });
});

document.querySelectorAll("[data-source-tab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    activeSource = tab.dataset.sourceTab;
    document.querySelectorAll("[data-source-tab]").forEach((item) => item.classList.toggle("active", item === tab));
    sourceSearch.value = "";
    sourceSearch.placeholder = "Search categories, services or sub services...";
    renderSources();
  });
});

sourceList.addEventListener("click", (event) => {
  const categoryToggle = event.target.closest("[data-toggle-category]");
  if (categoryToggle) {
    const id = Number(categoryToggle.dataset.toggleCategory);
    if (expandedCategoryIds.has(id)) expandedCategoryIds.delete(id);
    else expandedCategoryIds.add(id);
    renderSources();
    return;
  }
  const serviceToggle = event.target.closest("[data-toggle-service]");
  if (serviceToggle) {
    const id = Number(serviceToggle.dataset.toggleService);
    if (expandedServiceIds.has(id)) expandedServiceIds.delete(id);
    else expandedServiceIds.add(id);
    renderSources();
    return;
  }
  const button = event.target.closest("[data-add-tree]");
  if (!button) return;
  const type = button.dataset.addTree;
  const id = Number(button.dataset.itemId);
  let source;
  if (type === "category") source = navigation.categories.find((item) => item.id === id);
  else if (type === "service") source = navigation.services.find((item) => item.id === id);
  else source = navigation.subServices.find((item) => item.id === id);
  if (!source) return;
  const key = `${type}:${source.id}`;
  if (flattenItems(layout[activeRow]).some((item) => `${item.type}:${item.id}` === key)) return;
  const newItem = { type, id: source.id, name: source.name, slug: source.slug, children: [] };
  let parent = null;
  if (type === "service") {
    const category = navigation.hierarchy.find((item) => (item.children || []).some((service) => service.id === id));
    if (category) parent = findLayoutItem(layout[activeRow], "category", category.id);
  } else if (type === "sub_service") {
    for (const category of navigation.hierarchy) {
      const service = (category.children || []).find((item) => (item.children || []).some((subService) => subService.id === id));
      if (service) {
        parent = findLayoutItem(layout[activeRow], "service", service.id);
        break;
      }
    }
  }
  if (parent) parent.children.push(newItem);
  else layout[activeRow].push(newItem);
  renderSelected();
  showToast(parent ? `${source.name} added inside ${parent.name}` : `${source.name} added`);
});

document.querySelector("#addCustomPage").addEventListener("click", () => {
  const nameInput = document.querySelector("#customPageName");
  const urlInput = document.querySelector("#customPageUrl");
  const name = nameInput.value.trim();
  const url = urlInput.value.trim();
  if (!name || !/^(\/(?!\/)|https?:\/\/|#)/i.test(url)) {
    showToast("Enter a page name and valid URL", "error");
    return;
  }
  layout[activeRow].push({
    type: "custom",
    id: `custom-${Date.now()}`,
    name,
    url,
  });
  nameInput.value = "";
  urlInput.value = "";
  renderSelected();
  showToast("Custom page added");
});

selectedMenuList.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-path]");
  if (editButton) {
    editingItemPath = editButton.dataset.editPath;
    renderSelected();
    selectedMenuList.querySelector(`[data-edit-item-form="${editingItemPath}"] input`)?.focus();
    return;
  }

  if (event.target.closest("[data-cancel-item-edit]")) {
    editingItemPath = null;
    renderSelected();
    return;
  }

  const button = event.target.closest("[data-remove-path]");
  if (!button) return;
  editingItemPath = null;
  removeLayoutItem(layout[activeRow], button.dataset.removePath.split(".").map(Number));
  renderSelected();
});

selectedMenuList.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-edit-item-form]");
  if (!form) return;
  event.preventDefault();
  const item = getItemAtPath(layout[activeRow], form.dataset.editItemForm.split(".").map(Number));
  if (!item) return;

  const name = form.elements.item_name.value.trim();
  const link = form.elements.item_link.value.trim();
  if (!name) {
    showToast("Display name is required", "error");
    return;
  }
  if (item.type === "custom" && !/^(\/(?!\/)|https?:\/\/|#)/i.test(link)) {
    showToast("Enter a valid relative or absolute URL", "error");
    return;
  }
  const normalizedSlug = item.type === "custom" ? "" : slugify(link);
  if (item.type !== "custom" && !normalizedSlug) {
    showToast("Enter a valid slug", "error");
    return;
  }

  item.name = name;
  if (item.type === "custom") item.url = link;
  else item.slug = normalizedSlug;
  editingItemPath = null;
  renderSelected();
  showToast("Menu item updated");
});

selectedMenuList.addEventListener("dragstart", (event) => {
  const item = event.target.closest("[data-item-path]");
  if (!item) return;
  draggedItemPath = item.dataset.itemPath.split(".").map(Number);
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", item.dataset.itemPath);
  window.requestAnimationFrame(() => item.classList.add("dragging"));
});

selectedMenuList.addEventListener("dragover", (event) => {
  if (!draggedItemPath) return;
  const target = event.target.closest("[data-item-path]");
  clearDragStyles();
  const draggedElement = selectedMenuList.querySelector(`[data-item-path="${draggedItemPath.join(".")}"]`);
  draggedElement?.classList.add("dragging");
  if (!target) return;

  const targetPath = target.dataset.itemPath.split(".").map(Number);
  const placement = getDropPlacement(event, target);
  if (!canMoveLayoutItem(draggedItemPath, targetPath, placement)) {
    event.dataTransfer.dropEffect = "none";
    return;
  }

  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  target.classList.add(`drop-${placement}`);
});

selectedMenuList.addEventListener("drop", (event) => {
  const target = event.target.closest("[data-item-path]");
  if (!draggedItemPath || !target) return;
  event.preventDefault();
  const targetPath = target.dataset.itemPath.split(".").map(Number);
  const placement = getDropPlacement(event, target);
  const reordered = moveLayoutItem(draggedItemPath, targetPath, placement);
  draggedItemPath = null;
  clearDragStyles();
  if (reordered) {
    editingItemPath = null;
    renderSelected();
    showToast(placement === "inside" ? "Item moved inside parent" : "Menu order updated");
  }
});

selectedMenuList.addEventListener("dragend", () => {
  draggedItemPath = null;
  clearDragStyles();
});

document.querySelector("#clearRow").addEventListener("click", () => {
  editingItemPath = null;
  layout[activeRow] = [];
  renderSelected();
});

headerList.addEventListener("click", async (event) => {
  const editButton = event.target.closest("[data-edit-header]");
  if (editButton) {
    const header = headers.find((item) => item.id === Number(editButton.dataset.editHeader));
    if (header) openEditor(header);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-header]");
  if (!deleteButton) return;
  const header = headers.find((item) => item.id === Number(deleteButton.dataset.deleteHeader));
  if (!header || !window.confirm(`Delete "${header.name}"?`)) return;
  try {
    await request(`${apiBasePath}/${header.id}`, { method: "DELETE" });
    headers = headers.filter((item) => item.id !== header.id);
    renderHeaders();
    showToast(`${entityTitle} deleted`);
  } catch (error) {
    showToast(error.message, "error");
  }
});

headerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = {
    name: document.querySelector("#headerName").value.trim(),
    slug: document.querySelector("#headerSlug").value.trim(),
    layout: {
      ...layout,
      logo: {
        url: document.querySelector("#headerLogoUrl").value.trim(),
        alt: document.querySelector("#headerLogoAlt").value.trim(),
        href: document.querySelector("#headerLogoHref").value.trim() || "/",
      },
    },
    status: document.querySelector("#headerStatus").value,
    is_default: document.querySelector("#defaultHeader").checked,
  };
  const saveButton = document.querySelector("#saveHeader");
  saveButton.disabled = true;
  saveButton.textContent = "Saving...";
  try {
    await request(editingId ? `${apiBasePath}/${editingId}` : apiBasePath, {
      method: editingId ? "PUT" : "POST",
      body: JSON.stringify(payload),
    });
    showToast(editingId ? `${entityTitle} updated` : `${entityTitle} created`);
    closeEditor();
    await loadData();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = editingId ? `Update ${entityLabel}` : `Save ${entityLabel}`;
  }
});

loadData();
