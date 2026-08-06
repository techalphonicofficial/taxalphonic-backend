const list = document.querySelector("#serviceList");
const search = document.querySelector("#serviceSearch");
let services = [];
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
  const element = document.querySelector("#serviceToast");
  element.textContent = message;
  element.className = `service-toast show ${type === "error" ? "error" : ""}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { element.className = "service-toast"; }, 2500);
}

function updateSummary() {
  const assigned = services.filter((service) => service.mainCategories?.length);
  document.querySelector("#totalServices").textContent = services.length;
  document.querySelector("#assignedServices").textContent = assigned.length;
  document.querySelector("#unassignedServices").textContent = services.length - assigned.length;
}

function render() {
  const query = search.value.trim().toLowerCase();
  const filtered = services.filter((service) => {
    const categoryNames = (service.mainCategories || []).map((category) => category.name).join(" ");
    return `${service.name} ${service.slug} ${categoryNames}`.toLowerCase().includes(query);
  });
  document.querySelector("#serviceResultCount").textContent = `${filtered.length} service${filtered.length === 1 ? "" : "s"}`;
  if (!filtered.length) {
    list.innerHTML = `<tr><td colspan="5" class="service-loading">${services.length ? "No matching services" : "No services yet"}</td></tr>`;
    return;
  }
  list.innerHTML = filtered.map((service) => `
    <tr>
      <td><div class="service-identity"><span>S</span><div><strong>${escapeHtml(service.name)}</strong><small>/${escapeHtml(service.slug)}</small></div></div></td>
      <td><div class="service-category-tags">${service.mainCategories?.length ? service.mainCategories.map((category) => `<span>${escapeHtml(category.name)}</span>`).join("") : '<em>Unassigned</em>'}</div></td>
      <td><span class="service-seo-state ${service.seo_tags ? "ready" : ""}">${service.seo_tags ? "Added" : "Not added"}</span></td>
      <td>${new Date(service.updatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
      <td><div class="service-row-actions"><a href="/admin/services/${service.id}/edit">Edit</a><button data-delete-service="${service.id}">Delete</button></div></td>
    </tr>`).join("");
}

async function load() {
  try {
    services = await request("/api/services");
    updateSummary();
    render();
  } catch (error) {
    list.innerHTML = `<tr><td colspan="5" class="service-loading">${escapeHtml(error.message)}</td></tr>`;
  }
}

search.addEventListener("input", render);
list.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-delete-service]");
  if (!button) return;
  const service = services.find((item) => item.id === Number(button.dataset.deleteService));
  if (!service || !window.confirm(`Delete "${service.name}"?`)) return;
  try {
    await request(`/api/services/${service.id}`, { method: "DELETE" });
    toast("Service deleted");
    await load();
  } catch (error) {
    toast(error.message, "error");
  }
});

load();
