const grid = document.querySelector("#mediaPageGrid");
const details = document.querySelector("#mediaPageDetails");
const search = document.querySelector("#mediaPageSearch");
const uploadInput = document.querySelector("#mediaPageUpload");
let items = [];
let selectedId = null;
let progressTimer;

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: options.body instanceof FormData ? undefined : { "Content-Type": "application/json" },
    ...options,
  });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(data?.message || "Something went wrong");
  return data;
}

const formatBytes = (bytes = 0) => {
  const value = Number(bytes) || 0;
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
};

function notify(message, type = "success") {
  const element = document.querySelector("#mediaPageProgress");
  element.textContent = message;
  element.className = `media-page-progress show ${type === "error" ? "error" : ""}`;
  clearTimeout(progressTimer);
  progressTimer = setTimeout(() => { element.className = "media-page-progress"; }, 2800);
}

function updateSummary() {
  document.querySelector("#mediaTotal").textContent = items.length.toLocaleString("en-IN");
  const totalSize = items.reduce((total, item) => total + Number(item.size || 0), 0);
  document.querySelector("#mediaSize").textContent = formatBytes(totalSize);
}

function selectedItem() {
  return items.find((item) => item.id === selectedId);
}

function renderDetails() {
  const item = selectedItem();
  details.innerHTML = "";
  if (!item) {
    details.innerHTML = '<div class="media-details-empty"><span>▧</span><p>Select an image</p></div>';
    return;
  }
  const image = document.createElement("img");
  image.className = "media-detail-preview";
  image.src = item.path;
  image.alt = item.alt_text || item.name;
  const title = document.createElement("h3");
  title.textContent = item.name;
  const pathText = document.createElement("p");
  pathText.textContent = item.path;
  const list = document.createElement("dl");
  list.className = "media-detail-list";
  [
    ["File name", item.file_name],
    ["Type", item.mime_type],
    ["Size", formatBytes(item.size)],
    ["Uploaded", new Date(item.createdAt).toLocaleDateString("en-IN")],
    ["Alt text", item.alt_text || "—"],
  ].forEach(([label, value]) => {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = value;
    row.append(term, description);
    list.appendChild(row);
  });
  const altForm = document.createElement("form");
  altForm.className = "media-alt-form";
  const altLabel = document.createElement("label");
  altLabel.htmlFor = "mediaAltText";
  altLabel.textContent = "Alternative text";
  const altInput = document.createElement("input");
  altInput.id = "mediaAltText";
  altInput.name = "alt_text";
  altInput.maxLength = 255;
  altInput.required = true;
  altInput.value = item.alt_text || "";
  altInput.placeholder = "Describe this image";
  const altHelp = document.createElement("small");
  altHelp.textContent = "Describe the image for accessibility and SEO.";
  const altSave = document.createElement("button");
  altSave.type = "submit";
  altSave.textContent = "Save alt text";
  altForm.append(altLabel, altInput, altHelp, altSave);
  altForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const value = altInput.value.trim();
    if (!value) {
      notify("Alternative text is required", "error");
      altInput.focus();
      return;
    }
    altSave.disabled = true;
    altSave.textContent = "Saving...";
    try {
      const updated = await request(`/api/media/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ alt_text: value }),
      });
      const index = items.findIndex((media) => media.id === item.id);
      if (index !== -1) items[index] = updated;
      notify("Alternative text updated");
      render();
    } catch (error) {
      notify(error.message, "error");
      altSave.disabled = false;
      altSave.textContent = "Save alt text";
    }
  });
  const copy = document.createElement("button");
  copy.className = "media-copy-path";
  copy.type = "button";
  copy.textContent = "Copy image URL";
  copy.addEventListener("click", async () => {
    await navigator.clipboard.writeText(`${window.location.origin}${item.path}`);
    notify("Image URL copied");
  });
  const remove = document.createElement("button");
  remove.className = "media-delete";
  remove.type = "button";
  remove.textContent = "Delete permanently";
  remove.addEventListener("click", async () => {
    if (!window.confirm(`Delete “${item.name}” permanently?`)) return;
    try {
      await request(`/api/media/${item.id}`, { method: "DELETE" });
      items = items.filter((media) => media.id !== item.id);
      selectedId = null;
      updateSummary();
      render();
      notify("Media deleted");
    } catch (error) {
      notify(error.message, "error");
    }
  });
  details.append(image, title, pathText, list, altForm, copy, remove);
}

function render() {
  const term = search.value.trim().toLowerCase();
  const filtered = items.filter((item) =>
    `${item.name} ${item.file_name} ${item.alt_text || ""}`.toLowerCase().includes(term),
  );
  grid.innerHTML = "";
  if (!filtered.length) {
    grid.innerHTML = `<div class="media-page-empty"><span>▧</span><strong>${items.length ? "No matching images" : "Media Library is empty"}</strong><p>${items.length ? "Try another search." : "Use Upload image to add your first file."}</p></div>`;
    renderDetails();
    return;
  }
  filtered.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `media-page-item ${selectedId === item.id ? "selected" : ""}`;
    const image = document.createElement("img");
    image.src = item.path;
    image.alt = item.alt_text || item.name;
    image.loading = "lazy";
    const label = document.createElement("span");
    label.textContent = item.name;
    button.append(image, label);
    button.addEventListener("click", () => {
      selectedId = item.id;
      render();
      renderDetails();
    });
    grid.appendChild(button);
  });
  renderDetails();
}

async function load() {
  try {
    items = await request("/api/media");
    updateSummary();
    render();
  } catch (error) {
    grid.innerHTML = '<div class="media-page-empty"><strong>Could not load Media Library</strong></div>';
    notify(error.message, "error");
  }
}

search.addEventListener("input", render);
uploadInput.addEventListener("change", async (event) => {
  const files = [...(event.target.files || [])];
  if (!files.length) return;
  let uploaded = 0;
  for (const file of files) {
    try {
      notify(`Uploading ${uploaded + 1} of ${files.length}: ${file.name}`);
      const form = new FormData();
      form.append("file", file);
      form.append("name", file.name.replace(/\.[^.]+$/, ""));
      const item = await request("/api/media", { method: "POST", body: form });
      items.unshift(item);
      uploaded += 1;
    } catch (error) {
      notify(error.message, "error");
    }
  }
  event.target.value = "";
  updateSummary();
  render();
  if (uploaded) notify(`${uploaded} image${uploaded === 1 ? "" : "s"} uploaded`);
});

load();
