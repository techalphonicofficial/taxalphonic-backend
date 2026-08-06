import express from "express";
import * as dynamicSectionController from "../controllers/dynamicSectionController.js";

const router = express.Router();

router.get("/api/dynamic-sections", dynamicSectionController.list);
router.get("/api/dynamic-sections/:id", dynamicSectionController.show);
router.post("/api/dynamic-sections", dynamicSectionController.create);
router.put("/api/dynamic-sections/:id", dynamicSectionController.update);
router.delete("/api/dynamic-sections/:id", dynamicSectionController.remove);

export default router;
