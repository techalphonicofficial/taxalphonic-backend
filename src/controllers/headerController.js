import * as headerService from "../services/headerService.js";

export function index(req, res) {
  res.render("admin/header/index", {
    title: "Header | Taxpedia Admin",
    activePage: "header",
  });
}

export const list = async (req, res) => {
  res.json(await headerService.listHeaders());
};

export const publicHeader = async (req, res) => {
  res.json(await headerService.getPublicHeader());
};

export const show = async (req, res) => {
  res.json(await headerService.getHeader(Number(req.params.id)));
};

export const create = async (req, res) => {
  res.status(201).json(await headerService.createHeader(req.body));
};

export const update = async (req, res) => {
  res.json(await headerService.updateHeader(Number(req.params.id), req.body));
};

export const remove = async (req, res) => {
  await headerService.deleteHeader(Number(req.params.id));
  res.status(204).end();
};
