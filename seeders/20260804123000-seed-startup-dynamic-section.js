const STARTUP_SECTION = {
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
    {
      value: "10",
      label: "Expert services",
    },
    {
      value: "7-10",
      label: "Days avg turnaround",
    },
    {
      value: "4.8/5",
      label: "Client rating",
    },
    {
      value: "100%",
      label: "Online process",
    },
  ],
  services_heading: "Choose a startup service",
  services_description: "10 services available - click any to see details, documents, fees and process.",
};

export async function up(queryInterface, Sequelize) {
  const [existingCategory] = await queryInterface.sequelize.query(
    "SELECT id FROM main_categories WHERE slug = 'startup' LIMIT 1",
    { type: Sequelize.QueryTypes.SELECT },
  );

  let categoryId = existingCategory?.id;
  if (!categoryId) {
    await queryInterface.bulkInsert("main_categories", [
      {
        name: "Startup",
        slug: "startup",
        image: null,
        image_alt: null,
        seo_title: "Startup services in India",
        seo_description: "Register your business structure online with qualified CAs, CSs and legal experts.",
        seo_keywords: "startup services, company registration, business registration india",
        canonical_url: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const [createdCategory] = await queryInterface.sequelize.query(
      "SELECT id FROM main_categories WHERE slug = 'startup' LIMIT 1",
      { type: Sequelize.QueryTypes.SELECT },
    );
    categoryId = createdCategory.id;
  }

  const [existingSection] = await queryInterface.sequelize.query(
    "SELECT id FROM dynamic_sections WHERE type = 'main_category' AND parent_id = :categoryId AND JSON_EXTRACT(extra_json, '$.section') = 'category_hero' LIMIT 1",
    {
      replacements: { categoryId },
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  if (existingSection) {
    await queryInterface.sequelize.query(
      "UPDATE dynamic_sections SET extra_json = :extraJson, updated_at = :updatedAt WHERE id = :id",
      {
        replacements: {
          id: existingSection.id,
          extraJson: JSON.stringify(STARTUP_SECTION),
          updatedAt: new Date(),
        },
      },
    );
    return;
  }

  await queryInterface.bulkInsert("dynamic_sections", [
    {
      type: "main_category",
      parent_id: categoryId,
      extra_json: JSON.stringify(STARTUP_SECTION),
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  const [category] = await queryInterface.sequelize.query(
    "SELECT id FROM main_categories WHERE slug = 'startup' LIMIT 1",
    { type: Sequelize.QueryTypes.SELECT },
  );
  if (!category) return;

  await queryInterface.bulkDelete("dynamic_sections", {
    type: "main_category",
    parent_id: category.id,
  });
}
