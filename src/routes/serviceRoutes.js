import express from "express";
import * as serviceController from "../controllers/ServiceController.js";
const router = express.Router();

router.get("/admin/services", serviceController.index);
router.get("/admin/services/new", serviceController.createPage);
router.get("/admin/services/:id/edit", serviceController.editPage);
router.get("/api/services", serviceController.list);
router.post("/api/services", serviceController.create);
router.put("/api/services/:id", serviceController.update);
router.delete("/api/services/:id", serviceController.remove);

export default router;
