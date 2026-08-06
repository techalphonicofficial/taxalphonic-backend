const API_URL = "/api/taxpedia/categories";
const list = document.querySelector("#categoryList");
const modal = document.querySelector("#categoryModal");
const form = document.querySelector("#categoryForm");
const formError = document.querySelector("#formError");
const searchInput = document.querySelector("#categorySearch");
const statusFilter = document.querySelector("#statusFilter");
const colorInput = document.querySelector("#categoryColor");
const colorValue = document.querySelector("#colorValue");
const slugInput = document.querySelector("#categorySlug");
const nameInput = document.querySelector("#categoryName");

let categories = [];
let editingId = null;
let slugWasEdited = false;
let toastTimer;

const escapeHtml = (value = "") => {
  const element = document.createElement("div");
  element.textContent = String(value ?? "");
  return element.innerHTML;
};

const slugify = (value = "") =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

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
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.className = `toast show ${type === "error" ? "error" : ""}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = "toast"; }, 2600);
}

function updateSummary() {
  document.querySelector("#totalCount").textContent = categories.length;
  document.querySelector("#activeCount").textContent = categories.filter((item) => item.status === "active").length;
  document.querySelector("#inactiveCount").textContent = categories.filter((item) => item.status === "inactive").length;
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;
  const filtered = categories.filter((category) => {
    const matchesQuery = `${category.name} ${category.slug}`.toLowerCase().includes(query);
    return matchesQuery && (status === "all" || category.status === status);
  });

  document.querySelector("#resultCount").textContent = `Showing ${filtered.length} categor${filtered.length === 1 ? "y" : "ies"}`;
  if (!filtered.length) {
    list.innerHTML = `<tr class="empty-categories"><td colspan="6"><div><span>T</span><strong>${categories.length ? "No matching categories" : "No categories yet"}</strong><small>${categories.length ? "Try changing your search or filter." : "Add your first Taxpedia category to get started."}</small></div></td></tr>`;
    return;
  }

  list.innerHTML = filtered.map((category) => {
    const color = /^#[0-9a-f]{6}$/i.test(category.color || "") ? category.color : "#695bea";
    const mark = escapeHtml((category.icon || category.name.slice(0, 1)).slice(0, 2));
    return `<tr>
      <td><div class="category-identity"><span class="category-mark" style="--category-color:${color}">${mark}</span><div><strong>${escapeHtml(category.name)}</strong><small>Category #${category.id}</small></div></div></td>
      <td><code class="slug-code">${escapeHtml(category.slug)}</code></td>
      <td>${category.display_order}</td>
      <td><span class="status-pill ${escapeHtml(category.status)}">${escapeHtml(category.status)}</span></td>
      <td>${new Date(category.updatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
      <td><div class="row-actions"><button data-action="edit" data-id="${category.id}" title="Edit category">✎</button><button class="delete-action" data-action="delete" data-id="${category.id}" title="Delete category">×</button></div></td>
    </tr>`;
  }).join("");
}

async function loadCategories() {
  list.innerHTML = '<tr class="loading-row"><td colspan="6">Loading categories...</td></tr>';
  try {
    categories = await request(API_URL);
    updateSummary();
    render();
  } catch (error) {
    list.innerHTML = `<tr class="loading-row"><td colspan="6">${escapeHtml(error.message)}</td></tr>`;
  }
}

function openModal(category = null) {
  editingId = category?.id || null;
  slugWasEdited = Boolean(category);
  form.reset();
  form.elements.name.value = category?.name || "";
  form.elements.slug.value = category?.slug || "";
  form.elements.icon.value = category?.icon || "";
  form.elements.color.value = category?.color || "#695bea";
  form.elements.display_order.value = category?.display_order ?? 0;
  form.elements.status.value = category?.status || "active";
  colorValue.textContent = form.elements.color.value;
  document.querySelector("#modalTitle").textContent = category ? "Edit category" : "Add category";
  document.querySelector("#saveCategory").textContent = category ? "Update category" : "Save category";
  formError.classList.remove("visible");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  nameInput.focus();
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelector("#createCategory").addEventListener("click", () => openModal());
document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeModal));
searchInput.addEventListener("input", render);
statusFilter.addEventListener("change", render);
colorInput.addEventListener("input", () => { colorValue.textContent = colorInput.value; });
slugInput.addEventListener("input", () => { slugWasEdited = true; });
nameInput.addEventListener("input", () => {
  if (!slugWasEdited) slugInput.value = slugify(nameInput.value);
});

list.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const id = Number(button.dataset.id);
  const category = categories.find((item) => item.id === id);
  if (button.dataset.action === "edit") return openModal(category);

  if (!window.confirm(`Delete “${category.name}”? This cannot be undone.`)) return;
  try {
    await request(`${API_URL}/${id}`, { method: "DELETE" });
    showToast("Category deleted");
    await loadCategories();
  } catch (error) {
    showToast(error.message, "error");
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.classList.remove("visible");
  const saveButton = document.querySelector("#saveCategory");
  const originalLabel = saveButton.textContent;
  saveButton.disabled = true;
  saveButton.textContent = "Saving...";

  try {
    const payload = Object.fromEntries(new FormData(form));
    await request(editingId ? `${API_URL}/${editingId}` : API_URL, {
      method: editingId ? "PUT" : "POST",
      body: JSON.stringify(payload),
    });
    closeModal();
    showToast(editingId ? "Category updated" : "Category created");
    await loadCategories();
  } catch (error) {
    formError.textContent = error.message;
    formError.classList.add("visible");
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = originalLabel;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
});

loadCategories();
