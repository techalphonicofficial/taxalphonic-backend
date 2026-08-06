import * as footerService from "../services/footerService.js";

export function index(req, res) {
  res.render("admin/footer/index", {
    title: "Footer | Taxpedia Admin",
    activePage: "footer",
  });
}

export const list = async (req, res) => res.json(await footerService.listFooters());
export const publicFooter = async (req, res) => res.json(await footerService.getPublicFooter());
export const show = async (req, res) => res.json(await footerService.getFooter(Number(req.params.id)));
export const create = async (req, res) => res.status(201).json(await footerService.createFooter(req.body));
export const update = async (req, res) => res.json(await footerService.updateFooter(Number(req.params.id), req.body));
export const remove = async (req, res) => {
  await footerService.deleteFooter(Number(req.params.id));
  res.status(204).end();
};
