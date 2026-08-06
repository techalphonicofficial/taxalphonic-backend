import * as mainCategoryRepository from "../repositories/mainCategoryRepository.js";
import * as serviceManagementService from "../services/serviceManagementService.js";

export const index = (req, res) => {
  res.render("admin/services/index", {
    title: "Services | Taxpedia Admin",
    activePage: "services",
  });
};

export const createPage = async (req, res) => {
  res.render("admin/services/form", {
    title: "Add Service | Admin",
    activePage: "services",
    service: null,
    mainCategories: await mainCategoryRepository.findAll(),
  });
};

export const editPage = async (req, res) => {
  const service = await serviceManagementService.getService(Number(req.params.id));
  res.render("admin/services/form", {
    title: `Edit ${service.name} | Admin`,
    activePage: "services",
    service: service.toJSON(),
    mainCategories: await mainCategoryRepository.findAll(),
  });
};

export const list = async (req, res) => {
  res.json(await serviceManagementService.listServices());
};

export const create = async (req, res) => {
  res.status(201).json(await serviceManagementService.createService(req.body));
};

export const update = async (req, res) => {
  res.json(await serviceManagementService.updateService(Number(req.params.id), req.body));
};

export const remove = async (req, res) => {
  await serviceManagementService.deleteService(Number(req.params.id));
  res.status(204).end();
};
