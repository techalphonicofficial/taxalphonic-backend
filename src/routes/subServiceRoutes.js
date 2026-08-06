import express from "express";
import * as subServiceController from "../controllers/subServiceController.js";

const router = express.Router();

router.get("/admin/sub-services", subServiceController.index);
router.get("/admin/sub-services/new", subServiceController.createPage);
router.get("/admin/sub-services/:id/edit", subServiceController.editPage);
router.get("/api/sub-services", subServiceController.list);
router.post("/api/sub-services", subServiceController.create);
router.put("/api/sub-services/:id", subServiceController.update);
router.delete("/api/sub-services/:id", subServiceController.remove);

export default router;
