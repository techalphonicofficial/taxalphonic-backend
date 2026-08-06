import * as pageService from "../services/pageService.js";

export const index = (req, res) => {
  res.render("admin/pages/index", {
    title: "Pages & Page Details CMS | Admin",
    activePage: "pages",
  });
};

export const createForm = (req, res) => {
  res.render("admin/pages/form", {
    title: "Create CMS Page | Admin",
    activePage: "pages",
    page: null,
  });
};

export const editForm = async (req, res, next) => {
  try {
    const page = await pageService.getPage(Number(req.params.id));
    res.render("admin/pages/form", {
      title: `Edit ${page.title} | CMS Admin`,
      activePage: "pages",
      page: page.toJSON(),
    });
  } catch (err) {
    next(err);
  }
};

export const list = async (req, res, next) => {
  try {
    const pages = await pageService.listPages();
    res.json(pages);
  } catch (err) {
    next(err);
  }
};

export const show = async (req, res, next) => {
  try {
    const page = await pageService.getPage(Number(req.params.id));
    res.json(page);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const page = await pageService.createPage(req.body);
    res.status(201).json(page);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const page = await pageService.updatePage(Number(req.params.id), req.body);
    res.json(page);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await pageService.deletePage(Number(req.params.id));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
