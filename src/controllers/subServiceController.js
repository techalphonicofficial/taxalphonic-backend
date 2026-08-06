import * as serviceRepository from "../repositories/serviceRepository.js";
import * as subServiceService from "../services/subServiceService.js";

export const index = (req, res) => {
  res.render("admin/sub-services/index", {
    title: "Sub Services | Admin",
    activePage: "sub-services",
  });
};

export const createPage = async (req, res) => {
  res.render("admin/sub-services/form", {
    title: "Add Sub Service | Admin",
    activePage: "sub-services",
    subService: null,
    services: await serviceRepository.findAll(),
  });
};

export const editPage = async (req, res) => {
  const subService = await subServiceService.getSubService(Number(req.params.id));
  res.render("admin/sub-services/form", {
    title: `Edit ${subService.name} | Admin`,
    activePage: "sub-services",
    subService: subService.toJSON(),
    services: await serviceRepository.findAll(),
  });
};

export const list = async (req, res) => {
  res.json(await subServiceService.listSubServices());
};

export const create = async (req, res) => {
  res.status(201).json(await subServiceService.createSubService(req.body));
};

export const update = async (req, res) => {
  res.json(await subServiceService.updateSubService(Number(req.params.id), req.body));
};

export const remove = async (req, res) => {
  await subServiceService.deleteSubService(Number(req.params.id));
  res.status(204).end();
};
