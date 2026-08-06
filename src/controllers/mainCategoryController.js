import * as mainCategoryService from "../services/mainCategoryService.js";

export const index = (req, res) => {
  res.render("admin/main-categories/index", {
    title: "Main Categories | Admin",
    activePage: "main-categories",
  });
};

export const createPage = (req, res) => {
  res.render("admin/main-categories/form", {
    title: "Add Main Category | Admin",
    activePage: "main-categories",
    category: null,
  });
};

export const editPage = async (req, res) => {
  const category = await mainCategoryService.getMainCategory(Number(req.params.id));
  res.render("admin/main-categories/form", {
    title: `Edit ${category.name} | Admin`,
    activePage: "main-categories",
    category: category.toJSON(),
  });
};

export const list = async (req, res) => {
  res.json(await mainCategoryService.listMainCategories());
};

export const create = async (req, res) => {
  res.status(201).json(await mainCategoryService.createMainCategory(req.body));
};

export const update = async (req, res) => {
  res.json(await mainCategoryService.updateMainCategory(Number(req.params.id), req.body));
};

export const remove = async (req, res) => {
  await mainCategoryService.deleteMainCategory(Number(req.params.id));
  res.status(204).end();
};
