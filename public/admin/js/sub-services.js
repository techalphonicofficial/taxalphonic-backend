const list = document.querySelector("#subList");
const search = document.querySelector("#subSearch");
let subServices = [];
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
  const element = document.querySelector("#subToast");
  element.textContent = message;
  element.className = `sub-toast show ${type === "error" ? "error" : ""}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { element.className = "sub-toast"; }, 2500);
}

function render() {
  const query = search.value.trim().toLowerCase();
  const filtered = subServices.filter((item) => {
    const parentNames = (item.services || []).map((service) => service.name).join(" ");
    return `${item.name} ${item.slug} ${parentNames}`.toLowerCase().includes(query);
  });
  document.querySelector("#subTotal").textContent = subServices.length;
  document.querySelector("#subAssigned").textContent = subServices.filter((item) => item.services?.length).length;
  document.querySelector("#subImages").textContent = subServices.filter((item) => item.featured_image).length;
  document.querySelector("#subResultCount").textContent = `${filtered.length} sub service${filtered.length === 1 ? "" : "s"}`;
  if (!filtered.length) {
    list.innerHTML = `<tr><td colspan="5" class="sub-loading">${subServices.length ? "No matching sub services" : "No sub services yet"}</td></tr>`;
    return;
  }
  list.innerHTML = filtered.map((item) => `
    <tr>
      <td><div class="sub-identity"><span>${item.featured_image ? `<img src="${escapeHtml(item.featured_image)}" alt="${escapeHtml(item.image_alt || "")}">` : "SS"}</span><div><strong>${escapeHtml(item.name)}</strong><small>/${escapeHtml(item.slug)}</small></div></div></td>
      <td><div class="sub-parent-tags">${item.services?.length ? item.services.map((service) => `<span>${escapeHtml(service.name)}</span>`).join("") : "<em>Unassigned</em>"}</div></td>
      <td><span class="sub-image-state ${item.featured_image ? "ready" : ""}">${item.featured_image ? "Added" : "Not added"}</span></td>
      <td>${new Date(item.updatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
      <td><div class="sub-row-actions"><a href="/admin/sub-services/${item.id}/edit">Edit</a><button data-delete-sub="${item.id}">Delete</button></div></td>
    </tr>`).join("");
}

async function load() {
  try {
    subServices = await request("/api/sub-services");
    render();
  } catch (error) {
    list.innerHTML = `<tr><td colspan="5" class="sub-loading">${escapeHtml(error.message)}</td></tr>`;
  }
}

search.addEventListener("input", render);
list.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-delete-sub]");
  if (!button) return;
  const item = subServices.find((subService) => subService.id === Number(button.dataset.deleteSub));
  if (!item || !window.confirm(`Delete "${item.name}"?`)) return;
  try {
    await request(`/api/sub-services/${item.id}`, { method: "DELETE" });
    toast("Sub service deleted");
    await load();
  } catch (error) {
    toast(error.message, "error");
  }
});

load();
