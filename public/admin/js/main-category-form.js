const API_URL = "/api/main-categories";
const form = document.querySelector("#mainCategoryForm");
const formError = document.querySelector("#mainCategoryError");
const galleryModal = document.querySelector("#mcGalleryModal");
const galleryGrid = document.querySelector("#mcGalleryGrid");
const nameInput = document.querySelector("#mcName");
const slugInput = document.querySelector("#mcSlug");
const imageInput = document.querySelector("#mcImage");
const imageAltInput = document.querySelector("#mcImageAlt");
const seoTagsInput = document.querySelector("#mcSeoTags");
const category = JSON.parse(document.querySelector("#mainCategoryData").textContent);
const dynamicList = document.querySelector("#mcDynamicList");
const dynamicBuilder = document.querySelector("#mcDynamicBuilder");
const dynamicIdInput = document.querySelector("#mcDynamicId");
const dynamicJsonInput = document.querySelector("#mcDynamicJson");
let slugEdited = Boolean(category);
let dynamicSections = [];

const DEFAULT_SEO_TAGS = `<!-- Meta Tags -->
<title>Best Digital Marketing Agency in Noida | ABC Solutions</title>

<meta name="description" content="ABC Solutions is a leading digital marketing agency in Noida offering SEO, PPC, Social Media Marketing, Website Development, and Branding services to help businesses grow online.">

<meta name="keywords" content="Digital Marketing Agency, SEO Company Noida, PPC Services, Social Media Marketing, Website Development, Branding Agency">

<meta name="robots" content="index, follow, max-image-preview:large">

<link rel="canonical" href="https://www.abcsolutions.com/digital-marketing">

<!-- Open Graph -->
<meta property="og:title" content="Best Digital Marketing Agency in Noida | ABC Solutions">
<meta property="og:description" content="Grow your business with expert SEO, PPC, Social Media Marketing, and Website Development services.">
<meta property="og:url" content="https://www.abcsolutions.com/digital-marketing">
<meta property="og:type" content="website">

<!-- Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Digital Marketing Services",
  "provider": {
    "@type": "Organization",
    "name": "ABC Solutions"
  },
  "url": "https://www.abcsolutions.com/digital-marketing",
  "description": "Professional digital marketing services including SEO, PPC, Social Media Marketing, and Website Development."
}
</script>`;

const escapeHtml = (value = "") => {
  const element = document.createElement("div");
  element.textContent = String(value ?? "");
  return element.innerHTML;
};

const EXPERIENCE_TEMPLATE = {
  section: "experience_stat",
  eyebrow: "Why choose us",
  title: "20+ years of experience",
  description: "Trusted expertise for businesses that need reliable tax, compliance, and advisory support.",
  stats: [
    {
      label: "Years of experience",
      value: 20,
      suffix: "+",
    },
  ],
};

const DYNAMIC_TEMPLATES = {
  startupHero: {
    section: "category_hero",
    badge: {
      icon: "rocket",
      label: "STARTUP",
    },
    title: "Startup services in India",
    description: "Register your business structure. Handled end-to-end by qualified CAs, CSs and legal experts - transparent pricing, fully online, delivered across India.",
    primary_cta: {
      label: "Talk to an expert - free",
      url: "#",
    },
    secondary_cta: {
      label: "Browse 10 services",
      url: "#startup-services",
    },
    stats: [
      { value: "10", label: "Expert services" },
      { value: "7-10", label: "Days avg turnaround" },
      { value: "4.8/5", label: "Client rating" },
      { value: "100%", label: "Online process" },
    ],
    services_heading: "Choose a startup service",
    services_description: "10 services available - click any to see details, documents, fees and process.",
  },
  experience: EXPERIENCE_TEMPLATE,
  hero: {
    section: "hero",
    title: "New hero section",
    description: "Add the main headline and supporting text for this category.",
    cta: {
      label: "Get started",
      url: "#",
    },
  },
  features: {
    section: "feature_grid",
    title: "Key features",
    description: "Highlight important services, benefits, or category strengths.",
    items: [
      { title: "Feature one", description: "Short feature detail." },
      { title: "Feature two", description: "Short feature detail." },
    ],
  },
  article: {
    section: "rich_article",
    title: "Article section",
    description: "Write the summary for this content block.",
    content: "Add long-form content here.",
  },
  faq: {
    section: "faq",
    title: "Frequently asked questions",
    items: [
      { question: "Add your question?", answer: "Add the answer here." },
    ],
  },
  custom: {
    section: "custom_block",
    title: "Custom block",
    description: "Edit this JSON for any custom frontend section.",
    data: {
      enabled: true,
    },
  },
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

function updateImagePreview() {
  const preview = document.querySelector("#mcImagePreview");
  const image = preview.querySelector("img");
  const placeholder = preview.querySelector("span");
  image.hidden = !imageInput.value;
  placeholder.hidden = Boolean(imageInput.value);
  image.src = imageInput.value || "";
  image.alt = imageAltInput.value;
}

function populateForm() {
  if (category) {
    Object.entries(category).forEach(([key, value]) => {
      if (form.elements[key]) form.elements[key].value = value ?? "";
    });
  }
  if (!seoTagsInput.value.trim()) seoTagsInput.value = DEFAULT_SEO_TAGS;
  updateImagePreview();
  updateSeoTagCount();
}

function updateSeoTagCount() {
  const count = seoTagsInput.value.length;
  document.querySelector("#seoTagCount").textContent = `${count.toLocaleString("en-IN")} character${count === 1 ? "" : "s"}`;
}

function sectionLabel(section) {
  const data = section.extra_json || {};
  return data.title || data.section || data.type || `Section #${section.id}`;
}

function formatJson(value) {
  return JSON.stringify(value || {}, null, 2);
}

function resetDynamicEditor() {
  if (!dynamicJsonInput) return;
  dynamicIdInput.value = "";
  dynamicJsonInput.value = formatJson(EXPERIENCE_TEMPLATE);
  dynamicJsonInput.focus();
}

function renderDynamicBuilder() {
  if (!dynamicBuilder) return;
  if (!dynamicSections.length) {
    dynamicBuilder.innerHTML = `
      <div class="mc-dynamic-empty">
        <strong>No dynamic section blocks yet.</strong>
        <span>Use the buttons below to add Hero, Feature, Article, FAQ, Custom, or Experience blocks.</span>
      </div>
    `;
    return;
  }

  dynamicBuilder.innerHTML = dynamicSections.map((section, idx) => {
    const data = section.extra_json || {};
    const type = data.section || "custom_block";
    return `
      <article class="mc-dynamic-block" data-section-id="${section.id}">
        <header>
          <div>
            <span>${escapeHtml(type)}</span>
            <strong>Block #${idx + 1}: ${escapeHtml(data.title || "Untitled section")}</strong>
          </div>
          <div class="mc-dynamic-block-actions">
            <button type="button" data-raw-dynamic="${section.id}">Raw</button>
            <button type="button" data-save-visual-dynamic="${section.id}">Save</button>
            <button class="danger" type="button" data-delete-dynamic="${section.id}">Delete</button>
          </div>
        </header>
        <div class="mc-dynamic-block-body">
          <label class="mc-field">
            <span>Block title</span>
            <input data-visual-field="title" value="${escapeHtml(data.title || "")}" placeholder="Section title">
          </label>
          <label class="mc-field">
            <span>Description</span>
            <textarea data-visual-field="description" rows="2" placeholder="Section description">${escapeHtml(data.description || "")}</textarea>
          </label>
          <label class="mc-field">
            <span>Section key</span>
            <input data-visual-field="section" value="${escapeHtml(type)}" placeholder="experience_stat">
          </label>
        </div>
      </article>
    `;
  }).join("");
}

function renderDynamicSections() {
  if (!dynamicList) return;
  if (!dynamicSections.length) {
    dynamicList.innerHTML = '<div class="mc-dynamic-empty">No dynamic sections yet.</div>';
    return;
  }

  dynamicList.innerHTML = dynamicSections.map((section) => `
    <article class="mc-dynamic-item">
      <button type="button" data-edit-dynamic="${section.id}">
        <strong>${escapeHtml(sectionLabel(section))}</strong>
        <small>${escapeHtml(section.extra_json?.section || "custom_section")}</small>
      </button>
      <button class="mc-dynamic-delete" type="button" data-delete-dynamic="${section.id}">Delete</button>
    </article>
  `).join("");
}

async function loadDynamicSections() {
  if (!category || !dynamicList) return;
  try {
    dynamicSections = await request(`/api/dynamic-sections?type=main_category&parent_id=${category.id}`);
    renderDynamicBuilder();
    renderDynamicSections();
    if (!dynamicJsonInput.value.trim()) dynamicJsonInput.value = formatJson(EXPERIENCE_TEMPLATE);
  } catch (error) {
    dynamicList.innerHTML = `<div class="mc-dynamic-empty">${escapeHtml(error.message)}</div>`;
  }
}

async function saveDynamicPayload(id, extraJson) {
  return request(id ? `/api/dynamic-sections/${id}` : "/api/dynamic-sections", {
    method: id ? "PUT" : "POST",
    body: JSON.stringify({
      type: "main_category",
      parent_id: category.id,
      extra_json: extraJson,
    }),
  });
}

async function saveDynamicSection() {
  if (!category || !dynamicJsonInput) return;
  const button = document.querySelector("#mcSaveDynamicSection");
  const original = button.textContent;
  button.disabled = true;
  button.textContent = "Saving...";
  try {
    const extraJson = JSON.parse(dynamicJsonInput.value || "{}");
    const id = dynamicIdInput.value;
    await saveDynamicPayload(id, extraJson);
    dynamicIdInput.value = "";
    await loadDynamicSections();
  } catch (error) {
    formError.textContent = error instanceof SyntaxError ? "Dynamic section JSON valid nahi hai." : error.message;
    formError.classList.add("visible");
  } finally {
    button.disabled = false;
    button.textContent = original;
  }
}

async function createDynamicFromTemplate(templateName) {
  if (!category) return;
  const template = DYNAMIC_TEMPLATES[templateName] || DYNAMIC_TEMPLATES.custom;
  await saveDynamicPayload(null, JSON.parse(JSON.stringify(template)));
  await loadDynamicSections();
}

async function openGallery() {
  galleryModal.classList.add("open");
  galleryModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("mc-modal-open");
  galleryGrid.innerHTML = '<div class="mc-gallery-empty">Loading gallery...</div>';
  try {
    const images = await request("/api/media");
    galleryGrid.innerHTML = images.length ? images.map((image) => `
      <button class="mc-gallery-item" type="button" data-image-path="${escapeHtml(image.path)}" data-image-alt="${escapeHtml(image.alt_text || image.name)}">
        <img src="${escapeHtml(image.path)}" alt="${escapeHtml(image.alt_text || image.name)}">
        <span>${escapeHtml(image.name)}</span>
      </button>`).join("") : '<div class="mc-gallery-empty">No images in Media Gallery yet.</div>';
  } catch {
    galleryGrid.innerHTML = '<div class="mc-gallery-empty">Media Gallery is not available yet.</div>';
  }
}

function closeGallery() {
  galleryModal.classList.remove("open");
  galleryModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("mc-modal-open");
}

slugInput.addEventListener("input", () => { slugEdited = true; });
nameInput.addEventListener("input", () => {
  if (!slugEdited) slugInput.value = slugify(nameInput.value);
});
imageAltInput.addEventListener("input", updateImagePreview);
seoTagsInput.addEventListener("input", updateSeoTagCount);
document.querySelector("#pasteSeoTags").addEventListener("click", async () => {
  try {
    seoTagsInput.value = await navigator.clipboard.readText();
    updateSeoTagCount();
    seoTagsInput.focus();
  } catch {
    seoTagsInput.focus();
    formError.textContent = "Browser clipboard access nahi de raha. SEO code ko Ctrl+V se paste karein.";
    formError.classList.add("visible");
  }
});
document.querySelector("#clearSeoTags").addEventListener("click", () => {
  seoTagsInput.value = "";
  updateSeoTagCount();
  seoTagsInput.focus();
});
document.querySelector("#mcExperienceTemplate")?.addEventListener("click", () => {
  if (!dynamicJsonInput) return;
  dynamicJsonInput.value = formatJson(EXPERIENCE_TEMPLATE);
  dynamicIdInput.value = "";
  dynamicJsonInput.focus();
  document.querySelector('[data-dynamic-tab="mcDynamicRawPane"]')?.click();
});
document.querySelector("#mcNewDynamicSection")?.addEventListener("click", resetDynamicEditor);
document.querySelector("#mcSaveDynamicSection")?.addEventListener("click", saveDynamicSection);
document.querySelectorAll(".mc-dynamic-tab-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.dynamicTab;
    document.querySelectorAll(".mc-dynamic-tab-btn").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".mc-dynamic-pane").forEach((pane) => pane.classList.remove("active"));
    button.classList.add("active");
    document.querySelector(`#${target}`)?.classList.add("active");
  });
});
document.querySelectorAll("[data-dynamic-template]").forEach((button) => {
  button.addEventListener("click", async () => {
    const original = button.textContent;
    button.disabled = true;
    button.textContent = "Adding...";
    try {
      await createDynamicFromTemplate(button.dataset.dynamicTemplate);
    } catch (error) {
      formError.textContent = error.message;
      formError.classList.add("visible");
    } finally {
      button.disabled = false;
      button.textContent = original;
    }
  });
});
document.querySelector("#chooseGalleryImage").addEventListener("click", openGallery);
document.querySelector("#removeCategoryImage").addEventListener("click", () => {
  imageInput.value = "";
  imageAltInput.value = "";
  updateImagePreview();
});
document.querySelectorAll("[data-close-gallery]").forEach((element) => element.addEventListener("click", closeGallery));

galleryGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-image-path]");
  if (!button) return;
  imageInput.value = button.dataset.imagePath;
  if (!imageAltInput.value) imageAltInput.value = button.dataset.imageAlt;
  updateImagePreview();
  closeGallery();
});

dynamicList?.addEventListener("click", async (event) => {
  const editButton = event.target.closest("[data-edit-dynamic]");
  const deleteButton = event.target.closest("[data-delete-dynamic]");

  if (editButton) {
    const section = dynamicSections.find((item) => item.id === Number(editButton.dataset.editDynamic));
    if (!section) return;
    dynamicIdInput.value = section.id;
    dynamicJsonInput.value = formatJson(section.extra_json);
    dynamicJsonInput.focus();
    return;
  }

  if (deleteButton) {
    const section = dynamicSections.find((item) => item.id === Number(deleteButton.dataset.deleteDynamic));
    if (!section || !window.confirm(`Delete "${sectionLabel(section)}"?`)) return;
    try {
      await request(`/api/dynamic-sections/${section.id}`, { method: "DELETE" });
      if (dynamicIdInput.value === String(section.id)) resetDynamicEditor();
      await loadDynamicSections();
    } catch (error) {
      formError.textContent = error.message;
      formError.classList.add("visible");
    }
  }
});

dynamicBuilder?.addEventListener("click", async (event) => {
  const rawButton = event.target.closest("[data-raw-dynamic]");
  const saveButton = event.target.closest("[data-save-visual-dynamic]");
  const deleteButton = event.target.closest("[data-delete-dynamic]");

  if (rawButton) {
    const section = dynamicSections.find((item) => item.id === Number(rawButton.dataset.rawDynamic));
    if (!section) return;
    dynamicIdInput.value = section.id;
    dynamicJsonInput.value = formatJson(section.extra_json);
    document.querySelector('[data-dynamic-tab="mcDynamicRawPane"]')?.click();
    dynamicJsonInput.focus();
    return;
  }

  if (saveButton) {
    const card = saveButton.closest("[data-section-id]");
    const section = dynamicSections.find((item) => item.id === Number(card?.dataset.sectionId));
    if (!section) return;
    const nextJson = { ...(section.extra_json || {}) };
    card.querySelectorAll("[data-visual-field]").forEach((input) => {
      nextJson[input.dataset.visualField] = input.value;
    });
    const original = saveButton.textContent;
    saveButton.disabled = true;
    saveButton.textContent = "Saving...";
    try {
      await saveDynamicPayload(section.id, nextJson);
      await loadDynamicSections();
    } catch (error) {
      formError.textContent = error.message;
      formError.classList.add("visible");
    } finally {
      saveButton.disabled = false;
      saveButton.textContent = original;
    }
    return;
  }

  if (deleteButton) {
    const section = dynamicSections.find((item) => item.id === Number(deleteButton.dataset.deleteDynamic));
    if (!section || !window.confirm(`Delete "${sectionLabel(section)}"?`)) return;
    try {
      await request(`/api/dynamic-sections/${section.id}`, { method: "DELETE" });
      if (dynamicIdInput.value === String(section.id)) resetDynamicEditor();
      await loadDynamicSections();
    } catch (error) {
      formError.textContent = error.message;
      formError.classList.add("visible");
    }
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = document.querySelector("#saveMainCategory");
  const original = button.textContent;
  button.disabled = true;
  button.textContent = "Saving...";
  formError.classList.remove("visible");
  try {
    const payload = Object.fromEntries(new FormData(form));
    await request(category ? `${API_URL}/${category.id}` : API_URL, {
      method: category ? "PUT" : "POST",
      body: JSON.stringify(payload),
    });
    window.location.href = "/admin/main-categories";
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

populateForm();
loadDynamicSections();
