import express from "express";
import * as pageController from "../controllers/pageController.js";

const router = express.Router();

router.get("/admin/pages", pageController.index);
router.get("/admin/pages/new", pageController.createForm);
router.get("/admin/pages/:id/edit", pageController.editForm);

router.get("/api/pages", pageController.list);
router.get("/api/pages/:id", pageController.show);
router.post("/api/pages", pageController.create);
router.put("/api/pages/:id", pageController.update);
router.delete("/api/pages/:id", pageController.remove);

export default router;
