import * as categoryService from "../services/categoryService.js";

export const index = (req, res) => {
  res.render("admin/taxpedia/categories/index", {
    title: "Taxpedia Categories | Admin",
    activePage: "taxpedia",
  });
};

export const list = async (req, res) => {
  res.json(await categoryService.listCategories());
};

export const create = async (req, res) => {
  res.status(201).json(await categoryService.createCategory(req.body));
};

export const update = async (req, res) => {
  res.json(await categoryService.updateCategory(Number(req.params.id), req.body));
};

export const remove = async (req, res) => {
  await categoryService.deleteCategory(Number(req.params.id));
  res.status(204).end();
};
