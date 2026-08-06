import * as dynamicSectionService from "../services/dynamicSectionService.js";

export const list = async (req, res, next) => {
  try {
    res.json(await dynamicSectionService.listDynamicSections(req.query));
  } catch (err) {
    next(err);
  }
};

export const show = async (req, res, next) => {
  try {
    res.json(await dynamicSectionService.getDynamicSection(Number(req.params.id)));
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    res.status(201).json(await dynamicSectionService.createDynamicSection(req.body));
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    res.json(await dynamicSectionService.updateDynamicSection(Number(req.params.id), req.body));
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await dynamicSectionService.deleteDynamicSection(Number(req.params.id));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
