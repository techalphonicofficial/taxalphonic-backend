const API_URL = "/api/main-categories";
const list = document.querySelector("#mainCategoryList");
const search = document.querySelector("#mainCategorySearch");
let categories = [];
let toastTimer;

const escapeHtml = (value = "") => {
  const element = document.createElement("div");
  element.textContent = String(value ?? "");
  return element.innerHTML;
};

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(data?.message || "Something went wrong");
  return data;
}

function toast(message, type = "success") {
  const element = document.querySelector("#mcToast");
  element.textContent = message;
  element.className = `mc-toast show ${type === "error" ? "error" : ""}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { element.className = "mc-toast"; }, 2500);
}

function render() {
  const term = search.value.trim().toLowerCase();
  const filtered = categories.filter((item) => `${item.name} ${item.slug}`.toLowerCase().includes(term));
  document.querySelector("#categoryCount").textContent = `${categories.length} categor${categories.length === 1 ? "y" : "ies"}`;
  if (!filtered.length) {
    list.innerHTML = `<tr><td colspan="5" class="mc-loading">${categories.length ? "No matching categories" : "No main categories yet"}</td></tr>`;
    return;
  }
  list.innerHTML = filtered.map((item) => `
    <tr>
      <td><div class="mc-identity"><span class="mc-thumb">${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.image_alt || "")}">` : "C"}</span><div><strong>${escapeHtml(item.name)}</strong><small>Category #${item.id}</small></div></div></td>
      <td><code>${escapeHtml(item.slug)}</code></td>
      <td>${escapeHtml(item.seo_title || "—")}</td>
      <td>${new Date(item.updatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
      <td><div class="mc-row-actions"><a href="/admin/main-categories/${item.id}/edit">Edit</a><button class="mc-delete" data-delete="${item.id}">Delete</button></div></td>
    </tr>`).join("");
}

async function loadCategories() {
  try {
    categories = await request(API_URL);
    render();
  } catch (error) {
    list.innerHTML = `<tr><td colspan="5" class="mc-loading">${escapeHtml(error.message)}</td></tr>`;
  }
}

search.addEventListener("input", render);
list.addEventListener("click", async (event) => {
  const remove = event.target.closest("[data-delete]");
  if (!remove) return;
  const category = categories.find((item) => item.id === Number(remove.dataset.delete));
  if (!category || !window.confirm(`Delete "${category.name}"?`)) return;
  try {
    await request(`${API_URL}/${category.id}`, { method: "DELETE" });
    toast("Main category deleted");
    await loadCategories();
  } catch (error) {
    toast(error.message, "error");
  }
});

loadCategories();
