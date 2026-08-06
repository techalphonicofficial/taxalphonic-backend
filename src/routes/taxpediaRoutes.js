import express from "express";
import * as categoryController from "../controllers/categoryController.js";

const router = express.Router();

router.get("/admin/taxpedia/categories", categoryController.index);
router.get("/api/taxpedia/categories", categoryController.list);
router.post("/api/taxpedia/categories", categoryController.create);
router.put("/api/taxpedia/categories/:id", categoryController.update);
router.delete("/api/taxpedia/categories/:id", categoryController.remove);

export default router;
