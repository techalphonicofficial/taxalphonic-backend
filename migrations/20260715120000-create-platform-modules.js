const timestamps = (Sequelize) => ({
  createdAt: { type: Sequelize.DATE, allowNull: false },
  updatedAt: { type: Sequelize.DATE, allowNull: false },
});

const id = (Sequelize) => ({
  type: Sequelize.INTEGER.UNSIGNED,
  autoIncrement: true,
  primaryKey: true,
});

const foreignId = (Sequelize, table, options = {}) => ({
  type: Sequelize.INTEGER.UNSIGNED,
  allowNull: options.allowNull ?? false,
  references: { model: table, key: "id" },
  onUpdate: "CASCADE",
  onDelete: options.onDelete || "CASCADE",
});

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("authors", {
    id: id(Sequelize),
    name: { type: Sequelize.STRING(120), allowNull: false },
    email: { type: Sequelize.STRING(190), allowNull: false, unique: true },
    profile_image: { type: Sequelize.STRING(500), allowNull: true },
    designation: { type: Sequelize.STRING(150), allowNull: true },
    bio: { type: Sequelize.TEXT, allowNull: true },
    status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: "active" },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("categories", {
    id: id(Sequelize),
    name: { type: Sequelize.STRING(150), allowNull: false },
    slug: { type: Sequelize.STRING(180), allowNull: false, unique: true },
    icon: { type: Sequelize.STRING(500), allowNull: true },
    color: { type: Sequelize.STRING(30), allowNull: true },
    display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: "active" },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("sub_categories", {
    id: id(Sequelize),
    category_id: foreignId(Sequelize, "categories"),
    parent_id: foreignId(Sequelize, "sub_categories", { allowNull: true, onDelete: "SET NULL" }),
    name: { type: Sequelize.STRING(150), allowNull: false },
    slug: { type: Sequelize.STRING(180), allowNull: false },
    display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: "active" },
    ...timestamps(Sequelize),
  });
  await queryInterface.addIndex("sub_categories", ["category_id", "slug"], { unique: true });

  await queryInterface.createTable("articles", {
    id: id(Sequelize),
    sub_category_id: foreignId(Sequelize, "sub_categories"),
    author_id: foreignId(Sequelize, "authors", { allowNull: true, onDelete: "SET NULL" }),
    title: { type: Sequelize.STRING(255), allowNull: false },
    slug: { type: Sequelize.STRING(255), allowNull: false, unique: true },
    short_description: { type: Sequelize.TEXT, allowNull: true },
    content: { type: Sequelize.TEXT("long"), allowNull: true },
    thumbnail: { type: Sequelize.STRING(500), allowNull: true },
    meta_title: { type: Sequelize.STRING(255), allowNull: true },
    meta_description: { type: Sequelize.TEXT, allowNull: true },
    views: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: "draft" },
    published_at: { type: Sequelize.DATE, allowNull: true },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("article_contents", {
    id: id(Sequelize),
    article_id: { ...foreignId(Sequelize, "articles"), unique: true },
    content: { type: Sequelize.TEXT("long"), allowNull: false },
    table_of_contents: { type: Sequelize.JSON, allowNull: true },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("tags", {
    id: id(Sequelize),
    name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
    slug: { type: Sequelize.STRING(120), allowNull: false, unique: true },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("article_tags", {
    article_id: foreignId(Sequelize, "articles"),
    tag_id: foreignId(Sequelize, "tags"),
    createdAt: { type: Sequelize.DATE, allowNull: false },
  });
  await queryInterface.addConstraint("article_tags", {
    fields: ["article_id", "tag_id"],
    type: "primary key",
    name: "article_tags_pkey",
  });

  await queryInterface.createTable("trending_articles", {
    id: id(Sequelize),
    article_id: { ...foreignId(Sequelize, "articles"), unique: true },
    display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    starts_at: { type: Sequelize.DATE, allowNull: true },
    ends_at: { type: Sequelize.DATE, allowNull: true },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("search_keywords", {
    id: id(Sequelize),
    article_id: foreignId(Sequelize, "articles"),
    keyword: { type: Sequelize.STRING(255), allowNull: false },
    ...timestamps(Sequelize),
  });
  await queryInterface.addIndex("search_keywords", ["keyword"]);

  await queryInterface.createTable("service_categories", {
    id: id(Sequelize),
    name: { type: Sequelize.STRING(150), allowNull: false },
    slug: { type: Sequelize.STRING(180), allowNull: false, unique: true },
    icon: { type: Sequelize.STRING(500), allowNull: true },
    display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: "active" },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("services", {
    id: id(Sequelize),
    service_category_id: foreignId(Sequelize, "service_categories"),
    name: { type: Sequelize.STRING(180), allowNull: false },
    slug: { type: Sequelize.STRING(200), allowNull: false, unique: true },
    short_description: { type: Sequelize.TEXT, allowNull: true },
    description: { type: Sequelize.TEXT("long"), allowNull: true },
    price: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
    thumbnail: { type: Sequelize.STRING(500), allowNull: true },
    status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: "draft" },
    display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    ...timestamps(Sequelize),
  });

  for (const table of ["service_features", "service_processes", "service_documents"]) {
    await queryInterface.createTable(table, {
      id: id(Sequelize),
      service_id: foreignId(Sequelize, "services"),
      title: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      ...timestamps(Sequelize),
    });
  }

  await queryInterface.createTable("service_faqs", {
    id: id(Sequelize),
    service_id: foreignId(Sequelize, "services"),
    question: { type: Sequelize.STRING(500), allowNull: false },
    answer: { type: Sequelize.TEXT("long"), allowNull: false },
    display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("states", {
    id: id(Sequelize),
    name: { type: Sequelize.STRING(120), allowNull: false },
    code: { type: Sequelize.STRING(10), allowNull: true, unique: true },
    slug: { type: Sequelize.STRING(140), allowNull: false, unique: true },
    status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: "active" },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("cities", {
    id: id(Sequelize),
    state_id: foreignId(Sequelize, "states"),
    name: { type: Sequelize.STRING(120), allowNull: false },
    slug: { type: Sequelize.STRING(140), allowNull: false },
    status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: "active" },
    ...timestamps(Sequelize),
  });
  await queryInterface.addIndex("cities", ["state_id", "slug"], { unique: true });

  await queryInterface.createTable("service_locations", {
    id: id(Sequelize),
    service_id: foreignId(Sequelize, "services"),
    city_id: foreignId(Sequelize, "cities"),
    title: { type: Sequelize.STRING(255), allowNull: true },
    content: { type: Sequelize.TEXT("long"), allowNull: true },
    status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: "active" },
    ...timestamps(Sequelize),
  });
  await queryInterface.addIndex("service_locations", ["service_id", "city_id"], { unique: true });

  await queryInterface.createTable("seo_meta", {
    id: id(Sequelize),
    entity_type: { type: Sequelize.STRING(50), allowNull: false },
    entity_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
    meta_title: { type: Sequelize.STRING(255), allowNull: true },
    meta_description: { type: Sequelize.TEXT, allowNull: true },
    canonical_url: { type: Sequelize.STRING(500), allowNull: true },
    robots: { type: Sequelize.STRING(100), allowNull: true },
    schema_markup: { type: Sequelize.JSON, allowNull: true },
    ...timestamps(Sequelize),
  });
  await queryInterface.addIndex("seo_meta", ["entity_type", "entity_id"], { unique: true });

  await queryInterface.createTable("redirects", {
    id: id(Sequelize),
    from_path: { type: Sequelize.STRING(500), allowNull: false, unique: true },
    to_path: { type: Sequelize.STRING(500), allowNull: false },
    status_code: { type: Sequelize.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 301 },
    status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: "active" },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("blog_categories", {
    id: id(Sequelize),
    name: { type: Sequelize.STRING(150), allowNull: false },
    slug: { type: Sequelize.STRING(180), allowNull: false, unique: true },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("blogs", {
    id: id(Sequelize),
    blog_category_id: foreignId(Sequelize, "blog_categories"),
    author_id: foreignId(Sequelize, "authors", { allowNull: true, onDelete: "SET NULL" }),
    title: { type: Sequelize.STRING(255), allowNull: false },
    slug: { type: Sequelize.STRING(255), allowNull: false, unique: true },
    excerpt: { type: Sequelize.TEXT, allowNull: true },
    content: { type: Sequelize.TEXT("long"), allowNull: true },
    thumbnail: { type: Sequelize.STRING(500), allowNull: true },
    views: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: "draft" },
    published_at: { type: Sequelize.DATE, allowNull: true },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("blog_tags", {
    id: id(Sequelize),
    name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
    slug: { type: Sequelize.STRING(120), allowNull: false, unique: true },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("blog_tag_mapping", {
    blog_id: foreignId(Sequelize, "blogs"),
    blog_tag_id: foreignId(Sequelize, "blog_tags"),
    createdAt: { type: Sequelize.DATE, allowNull: false },
  });
  await queryInterface.addConstraint("blog_tag_mapping", {
    fields: ["blog_id", "blog_tag_id"],
    type: "primary key",
    name: "blog_tag_mapping_pkey",
  });

  await queryInterface.createTable("roles", {
    id: id(Sequelize),
    name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
    slug: { type: Sequelize.STRING(120), allowNull: false, unique: true },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("permissions", {
    id: id(Sequelize),
    name: { type: Sequelize.STRING(120), allowNull: false },
    slug: { type: Sequelize.STRING(150), allowNull: false, unique: true },
    module: { type: Sequelize.STRING(100), allowNull: true },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("role_permissions", {
    role_id: foreignId(Sequelize, "roles"),
    permission_id: foreignId(Sequelize, "permissions"),
    createdAt: { type: Sequelize.DATE, allowNull: false },
  });
  await queryInterface.addConstraint("role_permissions", {
    fields: ["role_id", "permission_id"],
    type: "primary key",
    name: "role_permissions_pkey",
  });

  await queryInterface.addColumn("users", "role_id", {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: true,
    references: { model: "roles", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  });

  await queryInterface.createTable("pages", {
    id: id(Sequelize),
    parent_id: foreignId(Sequelize, "pages", { allowNull: true, onDelete: "SET NULL" }),
    title: { type: Sequelize.STRING(255), allowNull: false },
    slug: { type: Sequelize.STRING(255), allowNull: false, unique: true },
    page_type: { type: Sequelize.STRING(50), allowNull: false, defaultValue: "page" },
    icon: { type: Sequelize.STRING(500), allowNull: true },
    content: { type: Sequelize.TEXT("long"), allowNull: true },
    status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: "draft" },
    display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("menus", {
    id: id(Sequelize),
    name: { type: Sequelize.STRING(120), allowNull: false },
    slug: { type: Sequelize.STRING(140), allowNull: false, unique: true },
    location: { type: Sequelize.STRING(100), allowNull: true },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("menu_items", {
    id: id(Sequelize),
    menu_id: foreignId(Sequelize, "menus"),
    parent_id: foreignId(Sequelize, "menu_items", { allowNull: true, onDelete: "CASCADE" }),
    label: { type: Sequelize.STRING(150), allowNull: false },
    url: { type: Sequelize.STRING(500), allowNull: true },
    icon: { type: Sequelize.STRING(500), allowNull: true },
    display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: "active" },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("banners", {
    id: id(Sequelize),
    title: { type: Sequelize.STRING(255), allowNull: true },
    subtitle: { type: Sequelize.TEXT, allowNull: true },
    image: { type: Sequelize.STRING(500), allowNull: false },
    link: { type: Sequelize.STRING(500), allowNull: true },
    position: { type: Sequelize.STRING(100), allowNull: true },
    display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: "active" },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("testimonials", {
    id: id(Sequelize),
    name: { type: Sequelize.STRING(150), allowNull: false },
    designation: { type: Sequelize.STRING(150), allowNull: true },
    company: { type: Sequelize.STRING(150), allowNull: true },
    profile_image: { type: Sequelize.STRING(500), allowNull: true },
    content: { type: Sequelize.TEXT, allowNull: false },
    rating: { type: Sequelize.TINYINT.UNSIGNED, allowNull: true },
    status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: "pending" },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("faqs", {
    id: id(Sequelize),
    question: { type: Sequelize.STRING(500), allowNull: false },
    answer: { type: Sequelize.TEXT("long"), allowNull: false },
    category: { type: Sequelize.STRING(120), allowNull: true },
    display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: "active" },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("contact_forms", {
    id: id(Sequelize),
    name: { type: Sequelize.STRING(150), allowNull: false },
    email: { type: Sequelize.STRING(190), allowNull: false },
    phone: { type: Sequelize.STRING(30), allowNull: true },
    subject: { type: Sequelize.STRING(255), allowNull: true },
    message: { type: Sequelize.TEXT, allowNull: false },
    status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: "new" },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("newsletter_subscribers", {
    id: id(Sequelize),
    email: { type: Sequelize.STRING(190), allowNull: false, unique: true },
    name: { type: Sequelize.STRING(150), allowNull: true },
    status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: "subscribed" },
    subscribed_at: { type: Sequelize.DATE, allowNull: false },
    unsubscribed_at: { type: Sequelize.DATE, allowNull: true },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("reviews", {
    id: id(Sequelize),
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    service_id: foreignId(Sequelize, "services", { allowNull: true, onDelete: "SET NULL" }),
    name: { type: Sequelize.STRING(150), allowNull: false },
    email: { type: Sequelize.STRING(190), allowNull: true },
    rating: { type: Sequelize.TINYINT.UNSIGNED, allowNull: false },
    title: { type: Sequelize.STRING(255), allowNull: true },
    content: { type: Sequelize.TEXT, allowNull: false },
    status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: "pending" },
    ...timestamps(Sequelize),
  });

  await queryInterface.createTable("media", {
    id: id(Sequelize),
    uploaded_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    name: { type: Sequelize.STRING(255), allowNull: false },
    file_name: { type: Sequelize.STRING(255), allowNull: false },
    path: { type: Sequelize.STRING(500), allowNull: false },
    mime_type: { type: Sequelize.STRING(120), allowNull: false },
    file_type: { type: Sequelize.STRING(30), allowNull: false },
    size: { type: Sequelize.BIGINT.UNSIGNED, allowNull: true },
    alt_text: { type: Sequelize.STRING(255), allowNull: true },
    ...timestamps(Sequelize),
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("media");
  await queryInterface.dropTable("reviews");
  await queryInterface.dropTable("newsletter_subscribers");
  await queryInterface.dropTable("contact_forms");
  await queryInterface.dropTable("faqs");
  await queryInterface.dropTable("testimonials");
  await queryInterface.dropTable("banners");
  await queryInterface.dropTable("menu_items");
  await queryInterface.dropTable("menus");
  await queryInterface.dropTable("pages");
  await queryInterface.removeColumn("users", "role_id");
  await queryInterface.dropTable("role_permissions");
  await queryInterface.dropTable("permissions");
  await queryInterface.dropTable("roles");
  await queryInterface.dropTable("blog_tag_mapping");
  await queryInterface.dropTable("blog_tags");
  await queryInterface.dropTable("blogs");
  await queryInterface.dropTable("blog_categories");
  await queryInterface.dropTable("redirects");
  await queryInterface.dropTable("seo_meta");
  await queryInterface.dropTable("service_locations");
  await queryInterface.dropTable("cities");
  await queryInterface.dropTable("states");
  await queryInterface.dropTable("service_faqs");
  await queryInterface.dropTable("service_documents");
  await queryInterface.dropTable("service_processes");
  await queryInterface.dropTable("service_features");
  await queryInterface.dropTable("services");
  await queryInterface.dropTable("service_categories");
  await queryInterface.dropTable("search_keywords");
  await queryInterface.dropTable("trending_articles");
  await queryInterface.dropTable("article_tags");
  await queryInterface.dropTable("tags");
  await queryInterface.dropTable("article_contents");
  await queryInterface.dropTable("articles");
  await queryInterface.dropTable("sub_categories");
  await queryInterface.dropTable("categories");
  await queryInterface.dropTable("authors");
}
