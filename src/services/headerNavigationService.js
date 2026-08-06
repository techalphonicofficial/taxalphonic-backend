import {
  getServiceNavigation,
  getTaxpediaNavigation,
} from "../repositories/headerNavigationRepository.js";

export async function getNavigationSources() {
  const [taxpedia, serviceCategories] = await Promise.all([
    getTaxpediaNavigation(),
    getServiceNavigation(),
  ]);

  const services = [];
  const serviceIds = new Set();
  serviceCategories.forEach((category) => {
    category.children.forEach((service) => {
      if (serviceIds.has(service.id)) return;
      serviceIds.add(service.id);
      services.push({ ...service, parent_name: category.name });
    });
  });

  const subServices = [];
  const subServiceIds = new Set();
  services.forEach((service) => {
    (service.children || []).forEach((item) => {
      if (subServiceIds.has(item.id)) return;
      subServiceIds.add(item.id);
      subServices.push({ ...item, parent_name: service.name });
    });
  });

  return {
    taxpedia,
    mainCategories: taxpedia,
    subCategories: taxpedia.flatMap((category) =>
      category.children.map((item) => ({
        ...item,
        parent_name: category.name,
      })),
    ),
    serviceCategories,
    services,
    subServices,
  };
}

export function buildNavigationItems(data, options = {}) {
  const source = options.source || "manual";
  const parent = options.parent || "all";
  const limit = Math.max(1, Math.min(Number(options.limit) || 10, 30));
  if (source === "manual") return [];

  let groups;
  if (source === "taxpedia" || source === "subcategories") {
    groups = data.taxpedia.map((item) => ({ ...item, source_type: "taxpedia" }));
  } else if (source === "serviceCategories" || source === "services") {
    groups = data.serviceCategories.map((item) => ({
      ...item,
      source_type: "services",
    }));
  } else {
    groups = [
      ...data.taxpedia.map((item) => ({ ...item, source_type: "taxpedia" })),
      ...data.serviceCategories.map((item) => ({
        ...item,
        source_type: "services",
      })),
    ];
  }

  if (parent !== "all") {
    const [parentType, rawId] = String(parent).split(":");
    const parentId = Number(rawId);
    groups = groups.filter(
      (group) => group.source_type === parentType && group.id === parentId,
    );
  }

  return groups.map((group) => ({
    id: group.id,
    source_type: group.source_type,
    name: group.name,
    slug: group.slug,
    icon: group.icon || "",
    color: group.color || "",
    children: (group.children || []).slice(0, limit).map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      icon: item.icon || "",
    })),
  }));
}
