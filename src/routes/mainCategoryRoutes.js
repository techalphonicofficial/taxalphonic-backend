import express from "express";
import * as mainCategoryController from "../controllers/mainCategoryController.js";

const router = express.Router();

router.get("/admin/main-categories", mainCategoryController.index);
router.get("/admin/main-categories/new", mainCategoryController.createPage);
router.get("/admin/main-categories/:id/edit", mainCategoryController.editPage);
router.get("/api/main-categories", mainCategoryController.list);
router.post("/api/main-categories", mainCategoryController.create);
router.put("/api/main-categories/:id", mainCategoryController.update);
router.delete("/api/main-categories/:id", mainCategoryController.remove);

export default router;
