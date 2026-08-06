const taxpediaData = {
  "Direct Tax": [
    "Income Tax",
    "CBDT",
    "Assessments & Appeals",
    "PAN & Aadhaar",
    "Calculators & Utilities",
    "TDS",
    "TCS",
    "Tax Saving",
  ],
  GST: [
    "GST Basics",
    "GST Registration",
    "GST Returns",
    "Input Tax Credit",
    "E-Way Bill",
    "Reverse Charge",
    "Composition Scheme",
    "GST Law",
  ],
  "Company Law": [
    "Companies Act 2013",
    "ROC Compliance",
    "Board & Meetings",
    "Director Compliance",
    "Share Capital",
    "Company Types",
    "NCLT & Strike Off",
    "Conversion",
  ],
  "Corporate Law": [
    "Corporate Governance",
    "SEBI & Listing",
    "Takeover Code",
    "Secretarial Standards",
    "Restructuring",
    "Corporate Compliance",
  ],
  RBI: [
    "Master Directions",
    "Notifications & Circulars",
    "Banking",
    "NBFC",
    "Payment Systems",
    "Forex & FEMA",
  ],
  FEMA: [
    "FDI",
    "ODI",
    "ECB",
    "Export & Import",
    "Compounding & Approvals",
  ],
  Customs: [
    "Customs Act 1962",
    "Duties",
    "Tariff & HSN",
    "Valuation",
    "Notifications & Case Laws",
    "Drawback & ICEGATE",
  ],
  DGFT: [
    "IEC",
    "Foreign Trade Policy",
    "Export Schemes",
    "Policy",
    "Notifications",
  ],
  Finance: [
    "Banking",
    "Insurance",
    "Investment",
    "Financial Planning",
  ],
  Budget: [
    "Union Budget",
    "Budget Analysis",
    "State Budget",
  ],
};

const serviceData = {
  Startup: [
    "Proprietorship",
    "Partnership Firm",
    "One Person Company",
    "Limited Liability Partnership",
    "Private Limited Company",
    "Section 8 Company",
    "Trust Registration",
    "Public Limited Company",
    "Producer Company",
    "Indian Subsidiary",
  ],
  Registrations: [
    "Udyam Registration",
    "Startup India Registration",
    "Import Export Code",
    "FSSAI Registration",
    "Shop and Establishment Registration",
    "Professional Tax Registration",
    "Digital Signature Certificate",
    "PAN and TAN Application",
    "PF Registration",
    "ESI Registration",
  ],
  Trademark: [
    "Trademark Registration",
    "Trademark Search",
    "Trademark Objection Reply",
    "Trademark Opposition",
    "Trademark Renewal",
    "Trademark Assignment",
    "Copyright Registration",
    "Patent Registration",
    "Design Registration",
  ],
  GST: [
    "GST Registration",
    "GST Return Filing",
    "GST Annual Return",
    "GST LUT Filing",
    "GST Cancellation",
    "GST Revocation",
    "GST Notice Reply",
    "E-Way Bill Support",
    "Input Tax Credit Review",
  ],
  "Income Tax": [
    "Income Tax Return Filing",
    "Business Tax Return",
    "TDS Return Filing",
    "Income Tax Notice Reply",
    "Tax Audit",
    "Advance Tax Calculation",
    "PAN Correction",
    "Form 15CA and 15CB",
  ],
  MCA: [
    "Company Annual Filing",
    "Director KYC",
    "DIN Application",
    "Company Name Change",
    "Registered Office Change",
    "Director Addition",
    "Director Resignation",
    "Share Transfer",
    "Company Strike Off",
  ],
  Compliance: [
    "LLP Annual Filing",
    "ROC Compliance Package",
    "Secretarial Audit",
    "Statutory Audit",
    "Payroll Compliance",
    "PF and ESI Return",
    "FEMA Compliance",
    "NBFC Compliance",
    "Internal Audit",
  ],
  "Business Advisory": [
    "Business Plan",
    "Financial Modelling",
    "Startup Valuation",
    "Due Diligence",
    "Virtual CFO",
    "Pitch Deck",
    "Fundraising Advisory",
    "Business Restructuring",
  ],
  "Lawyer Services": [
    "Legal Consultation",
    "Contract Drafting",
    "Legal Notice",
    "Consumer Complaint",
    "Employment Agreement",
    "Founders Agreement",
    "Vendor Agreement",
    "Privacy Policy",
    "Terms and Conditions",
  ],
  Global: [
    "US Company Registration",
    "UK Company Registration",
    "Dubai Company Registration",
    "Singapore Company Registration",
    "International Trademark",
    "Global Tax Advisory",
    "Cross Border Compliance",
    "Export Business Setup",
  ],
  Products: [
    "Accounting Software",
    "GST Billing Software",
    "Payroll Software",
    "Compliance Calendar",
    "Legal Document Templates",
    "Tax Calculator",
    "Business Reports",
  ],
};

const categoryMeta = {
  "Direct Tax": ["₹", "#6c5ce7"],
  GST: ["G", "#0984e3"],
  "Company Law": ["▦", "#00b894"],
  "Corporate Law": ["⚖", "#e17055"],
  RBI: ["▥", "#636e72"],
  FEMA: ["◎", "#00cec9"],
  Customs: ["▣", "#0984e3"],
  DGFT: ["▤", "#d63031"],
  Finance: ["₹", "#e67e22"],
  Budget: ["▧", "#6c5ce7"],
};

const serviceIcons = {
  Startup: "S",
  Registrations: "R",
  Trademark: "™",
  GST: "G",
  "Income Tax": "₹",
  MCA: "M",
  Compliance: "✓",
  "Business Advisory": "B",
  "Lawyer Services": "⚖",
  Global: "◎",
  Products: "P",
};

const slugify = (value) =>
  value.toLowerCase().trim().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export async function up(queryInterface) {
  const now = new Date();
  const categoryRows = Object.keys(taxpediaData).map((name, index) => ({
    name,
    slug: slugify(name),
    icon: categoryMeta[name][0],
    color: categoryMeta[name][1],
    display_order: index + 1,
    status: "active",
    createdAt: now,
    updatedAt: now,
  }));
  const [existingCategories] = await queryInterface.sequelize.query(
    `SELECT slug FROM categories WHERE slug IN (:slugs)`,
    { replacements: { slugs: categoryRows.map((item) => item.slug) } },
  );
  const existingCategorySlugs = new Set(
    existingCategories.map((item) => item.slug),
  );

  const missingCategories = categoryRows.filter(
    (item) => !existingCategorySlugs.has(item.slug),
  );
  if (missingCategories.length) {
    await queryInterface.bulkInsert("categories", missingCategories);
  }

  const [categories] = await queryInterface.sequelize.query(
    `SELECT id, slug FROM categories WHERE slug IN (:slugs)`,
    { replacements: { slugs: Object.keys(taxpediaData).map(slugify) } },
  );
  const categoryIds = new Map(categories.map((item) => [item.slug, item.id]));

  const subCategoryRows = Object.entries(taxpediaData).flatMap(
    ([categoryName, items]) =>
      items.map((name, index) => ({
        category_id: categoryIds.get(slugify(categoryName)),
        parent_id: null,
        name,
        slug: slugify(name),
        display_order: index + 1,
        status: "active",
        createdAt: now,
        updatedAt: now,
      })),
  );
  const [existingSubCategories] = await queryInterface.sequelize.query(
    `SELECT category_id, slug FROM sub_categories
     WHERE category_id IN (:categoryIds)`,
    { replacements: { categoryIds: [...categoryIds.values()] } },
  );
  const existingSubCategoryKeys = new Set(
    existingSubCategories.map((item) => `${item.category_id}:${item.slug}`),
  );
  const missingSubCategories = subCategoryRows.filter(
    (item) => !existingSubCategoryKeys.has(`${item.category_id}:${item.slug}`),
  );
  if (missingSubCategories.length) {
    await queryInterface.bulkInsert("sub_categories", missingSubCategories);
  }

  const serviceCategoryRows = Object.keys(serviceData).map((name, index) => ({
    name,
    slug: slugify(name),
    icon: serviceIcons[name],
    display_order: index + 1,
    status: "active",
    createdAt: now,
    updatedAt: now,
  }));
  const [existingServiceCategories] = await queryInterface.sequelize.query(
    `SELECT slug FROM service_categories WHERE slug IN (:slugs)`,
    { replacements: { slugs: serviceCategoryRows.map((item) => item.slug) } },
  );
  const existingServiceCategorySlugs = new Set(
    existingServiceCategories.map((item) => item.slug),
  );
  const missingServiceCategories = serviceCategoryRows.filter(
    (item) => !existingServiceCategorySlugs.has(item.slug),
  );
  if (missingServiceCategories.length) {
    await queryInterface.bulkInsert(
      "service_categories",
      missingServiceCategories,
    );
  }

  const [serviceCategories] = await queryInterface.sequelize.query(
    `SELECT id, slug FROM service_categories WHERE slug IN (:slugs)`,
    { replacements: { slugs: Object.keys(serviceData).map(slugify) } },
  );
  const serviceCategoryIds = new Map(
    serviceCategories.map((item) => [item.slug, item.id]),
  );

  const serviceRows = Object.entries(serviceData).flatMap(
    ([categoryName, items]) =>
      items.map((name, index) => ({
        service_category_id: serviceCategoryIds.get(slugify(categoryName)),
        name,
        slug: slugify(name),
        short_description: `Professional ${name.toLowerCase()} support from experienced experts.`,
        description: `End-to-end assistance for ${name.toLowerCase()}, including documentation, filing, review, and expert support.`,
        price: null,
        thumbnail: null,
        status: "active",
        display_order: index + 1,
        createdAt: now,
        updatedAt: now,
      })),
  );
  const [existingServices] = await queryInterface.sequelize.query(
    `SELECT slug FROM services WHERE slug IN (:slugs)`,
    { replacements: { slugs: serviceRows.map((item) => item.slug) } },
  );
  const existingServiceSlugs = new Set(
    existingServices.map((item) => item.slug),
  );
  const missingServices = serviceRows.filter(
    (item) => !existingServiceSlugs.has(item.slug),
  );
  if (missingServices.length) {
    await queryInterface.bulkInsert("services", missingServices);
  }
}

export async function down(queryInterface) {
  const serviceSlugs = Object.values(serviceData).flat().map(slugify);
  const serviceCategorySlugs = Object.keys(serviceData).map(slugify);
  const categorySlugs = Object.keys(taxpediaData).map(slugify);

  await queryInterface.bulkDelete("services", { slug: serviceSlugs });
  await queryInterface.bulkDelete("service_categories", {
    slug: serviceCategorySlugs,
  });

  const [categories] = await queryInterface.sequelize.query(
    `SELECT id FROM categories WHERE slug IN (:slugs)`,
    { replacements: { slugs: categorySlugs } },
  );
  await queryInterface.bulkDelete("sub_categories", {
    category_id: categories.map((item) => item.id),
  });
  await queryInterface.bulkDelete("categories", { slug: categorySlugs });
}
