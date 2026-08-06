const form = document.querySelector("#serviceForm");
const nameInput = document.querySelector("#serviceName");
const slugInput = document.querySelector("#serviceSlug");
const seoInput = document.querySelector("#serviceSeoTags");
const formError = document.querySelector("#serviceFormError");
const service = JSON.parse(document.querySelector("#serviceData").textContent);
let slugEdited = Boolean(service);

const DEFAULT_SEO_TAGS = `<!-- Meta Tags -->
<title>Service Name | Company Name</title>
<meta name="description" content="Add your service description here.">
<meta name="keywords" content="Service keyword, business keyword">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="https://example.com/service-slug">

<!-- Open Graph -->
<meta property="og:title" content="Service Name | Company Name">
<meta property="og:description" content="Add your service description here.">
<meta property="og:url" content="https://example.com/service-slug">
<meta property="og:type" content="website">

<!-- Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Service Name",
  "provider": {
    "@type": "Organization",
    "name": "Company Name"
  },
  "url": "https://example.com/service-slug",
  "description": "Add your service description here."
}
</script>`;

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

function updateSeoCount() {
  const count = seoInput.value.length;
  document.querySelector("#serviceSeoCount").textContent = `${count.toLocaleString("en-IN")} character${count === 1 ? "" : "s"}`;
}

function populate() {
  if (service) {
    nameInput.value = service.name;
    slugInput.value = service.slug;
    seoInput.value = service.seo_tags || DEFAULT_SEO_TAGS;
    const selectedIds = new Set((service.mainCategories || []).map((category) => category.id));
    document.querySelectorAll('[name="main_category_ids"]').forEach((input) => {
      input.checked = selectedIds.has(Number(input.value));
    });
  } else {
    seoInput.value = DEFAULT_SEO_TAGS;
  }
  updateSeoCount();
}

slugInput.addEventListener("input", () => { slugEdited = true; });
nameInput.addEventListener("input", () => {
  if (!slugEdited) slugInput.value = slugify(nameInput.value);
});
seoInput.addEventListener("input", updateSeoCount);
document.querySelector("#clearServiceSeo").addEventListener("click", () => {
  seoInput.value = "";
  updateSeoCount();
  seoInput.focus();
});
document.querySelector("#pasteServiceSeo").addEventListener("click", async () => {
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

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const saveButton = document.querySelector("#saveService");
  const original = saveButton.textContent;
  saveButton.disabled = true;
  saveButton.textContent = "Saving...";
  formError.classList.remove("visible");
  const data = new FormData(form);
  const payload = {
    name: data.get("name"),
    slug: data.get("slug"),
    seo_tags: data.get("seo_tags"),
    main_category_ids: data.getAll("main_category_ids"),
  };
  try {
    await request(service ? `/api/services/${service.id}` : "/api/services", {
      method: service ? "PUT" : "POST",
      body: JSON.stringify(payload),
    });
    window.location.href = "/admin/services";
  } catch (error) {
    formError.textContent = error.message;
    formError.classList.add("visible");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = original;
  }
});

populate();
