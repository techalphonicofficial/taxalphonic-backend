export async function up(queryInterface, Sequelize) {
  const [page] = await queryInterface.sequelize.query(
    "SELECT id FROM pages ORDER BY id ASC LIMIT 1",
    { type: Sequelize.QueryTypes.SELECT },
  );
  if (!page) return;

  await queryInterface.bulkInsert("dynamic_sections", [
    {
      type: "page",
      parent_id: page.id,
      extra_json: JSON.stringify({
        section: "experience_stat",
        eyebrow: "Why choose us",
        title: "20+ years of experience",
        description: "Show a reusable experience counter on any page, service, sub-service, or main category.",
        stats: [
          {
            label: "Years of experience",
            value: 20,
            suffix: "+",
          },
        ],
      }),
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("dynamic_sections", {
    type: "page",
  });
}
