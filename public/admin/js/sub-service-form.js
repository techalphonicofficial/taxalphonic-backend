const form = document.querySelector("#subServiceForm");
const formError = document.querySelector("#subFormError");
const nameInput = document.querySelector("#subName");
const slugInput = document.querySelector("#subSlug");
const imageInput = document.querySelector("#subFeaturedImage");
const altInput = document.querySelector("#subImageAlt");
const seoInput = document.querySelector("#subSeoTags");
const galleryModal = document.querySelector("#subGalleryModal");
const galleryGrid = document.querySelector("#subGalleryGrid");
const subService = JSON.parse(document.querySelector("#subServiceData").textContent);
let slugEdited = Boolean(subService);

const DEFAULT_SEO_TAGS = `<!-- Meta Tags -->
<title>Sub Service Name | Company Name</title>
<meta name="description" content="Add your sub service description here.">
<meta name="keywords" content="Sub service keyword, service keyword">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="https://example.com/sub-service-slug">

<!-- Open Graph -->
<meta property="og:title" content="Sub Service Name | Company Name">
<meta property="og:description" content="Add your sub service description here.">
<meta property="og:url" content="https://example.com/sub-service-slug">
<meta property="og:type" content="website">

<!-- Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Sub Service Name",
  "provider": {
    "@type": "Organization",
    "name": "Company Name"
  },
  "url": "https://example.com/sub-service-slug",
  "description": "Add your sub service description here."
}
</script>`;

const escapeHtml = (value = "") => {
  const element = document.createElement("div");
  element.textContent = String(value ?? "");
  return element.innerHTML;
};

const slugify = (value) => String(value || "").toLowerCase().trim()
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(data?.message || "Something went wrong");
  return data;
}

function updatePreview() {
  const preview = document.querySelector("#subImagePreview");
  const image = preview.querySelector("img");
  const placeholder = preview.querySelector("span");
  image.hidden = !imageInput.value;
  placeholder.hidden = Boolean(imageInput.value);
  image.src = imageInput.value || "";
  image.alt = altInput.value;
}

function updateSeoCount() {
  const count = seoInput.value.length;
  document.querySelector("#subSeoCount").textContent = `${count.toLocaleString("en-IN")} character${count === 1 ? "" : "s"}`;
}

function populate() {
  if (subService) {
    nameInput.value = subService.name;
    slugInput.value = subService.slug;
    imageInput.value = subService.featured_image || "";
    altInput.value = subService.image_alt || "";
    seoInput.value = subService.seo_tags || DEFAULT_SEO_TAGS;
    const selectedIds = new Set((subService.services || []).map((service) => service.id));
    document.querySelectorAll('[name="service_ids"]').forEach((input) => {
      input.checked = selectedIds.has(Number(input.value));
    });
  } else {
    seoInput.value = DEFAULT_SEO_TAGS;
  }
  updatePreview();
  updateSeoCount();
}

async function openGallery() {
  galleryModal.classList.add("open");
  galleryModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("sub-modal-open");
  galleryGrid.innerHTML = '<div class="sub-gallery-empty">Loading gallery...</div>';
  try {
    const images = await request("/api/media");
    galleryGrid.innerHTML = images.length ? images.map((image) => `
      <button class="sub-gallery-item" type="button" data-path="${escapeHtml(image.path)}" data-alt="${escapeHtml(image.alt_text || image.name)}">
        <img src="${escapeHtml(image.path)}" alt="${escapeHtml(image.alt_text || image.name)}">
        <span>${escapeHtml(image.name)}</span>
      </button>`).join("") : '<div class="sub-gallery-empty">No images in Media Gallery yet.</div>';
  } catch (error) {
    galleryGrid.innerHTML = `<div class="sub-gallery-empty">${escapeHtml(error.message)}</div>`;
  }
}

function closeGallery() {
  galleryModal.classList.remove("open");
  galleryModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("sub-modal-open");
}

slugInput.addEventListener("input", () => { slugEdited = true; });
nameInput.addEventListener("input", () => {
  if (!slugEdited) slugInput.value = slugify(nameInput.value);
});
altInput.addEventListener("input", updatePreview);
seoInput.addEventListener("input", updateSeoCount);
document.querySelector("#clearSubSeo").addEventListener("click", () => {
  seoInput.value = "";
  updateSeoCount();
  seoInput.focus();
});
document.querySelector("#pasteSubSeo").addEventListener("click", async () => {
  try {
    seoInput.value = await navigator.clipboard.readText();
    updateSeoCount();
    seoInput.focus();
  } catch {
    formError.textContent = "Clipboard access nahi mila. Ctrl+V se SEO code paste karein.";
    formError.classList.add("visible");
    seoInput.focus();
  }
});
document.querySelector("#chooseSubImage").addEventListener("click", openGallery);
document.querySelector("#removeSubImage").addEventListener("click", () => {
  imageInput.value = "";
  altInput.value = "";
  updatePreview();
});
document.querySelectorAll("[data-close-sub-gallery]").forEach((element) => element.addEventListener("click", closeGallery));
galleryGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-path]");
  if (!button) return;
  imageInput.value = button.dataset.path;
  if (!altInput.value) altInput.value = button.dataset.alt;
  updatePreview();
  closeGallery();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = document.querySelector("#saveSubService");
  const original = button.textContent;
  button.disabled = true;
  button.textContent = "Saving...";
  formError.classList.remove("visible");
  const data = new FormData(form);
  const payload = {
    name: data.get("name"),
    slug: data.get("slug"),
    featured_image: data.get("featured_image"),
    image_alt: data.get("image_alt"),
    seo_tags: data.get("seo_tags"),
    service_ids: data.getAll("service_ids"),
  };
  try {
    await request(subService ? `/api/sub-services/${subService.id}` : "/api/sub-services", {
      method: subService ? "PUT" : "POST",
      body: JSON.stringify(payload),
    });
    window.location.href = "/admin/sub-services";
  } catch (error) {
    formError.textContent = error.message;
    formError.classList.add("visible");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } finally {
    button.disabled = false;
    button.textContent = original;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && galleryModal.classList.contains("open")) closeGallery();
});

populate();
