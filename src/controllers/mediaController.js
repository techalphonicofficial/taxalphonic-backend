import * as mediaService from "../services/mediaService.js";

export const index = (req, res) => {
  res.render("admin/media/index", {
    title: "Media Library | Taxpedia Admin",
    activePage: "media",
  });
};



export const list = async (req, res) => {
  res.json(await mediaService.listImages());
};

export const upload = async (req, res) => {
  res.status(201).json(await mediaService.createImage(req.file, req.body));
};

export const update = async (req, res) => {
  res.json(await mediaService.updateImage(Number(req.params.id), req.body));
};

export const remove = async (req, res) => {
  res.json(await mediaService.deleteImage(Number(req.params.id)));
};
