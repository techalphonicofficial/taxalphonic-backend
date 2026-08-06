import express from "express";
import { index } from "../controllers/dashboardController.js";
import * as headerController from "../controllers/headerController.js";
import * as headerNavigationController from "../controllers/headerNavigationController.js";
import * as footerController from "../controllers/footerController.js";
import * as mediaController from "../controllers/mediaController.js";
import mediaUpload from "../middleware/mediaUpload.js";

const router = express.Router();

router.get(["/", "/admin"], index);
router.get("/admin/header", headerController.index);
router.get("/admin/header/new", (req, res) => res.redirect("/admin/header?create=1"));
router.get("/admin/header/:id/edit", (req, res) => {
  res.redirect(`/admin/header?edit=${encodeURIComponent(req.params.id)}`);
});
router.get("/admin/footer", footerController.index);
router.get("/admin/footer/new", (req, res) => res.redirect("/admin/footer?create=1"));
router.get("/admin/footer/:id/edit", (req, res) => {
  res.redirect(`/admin/footer?edit=${encodeURIComponent(req.params.id)}`);
});
router.get("/admin/media", mediaController.index);
router.get("/api/header", headerController.publicHeader);
router.get("/api/headers", headerController.list);
router.get("/api/header-navigation-data", headerNavigationController.list);
router.get("/api/headers/:id", headerController.show);
router.post("/api/headers", headerController.create);
router.put("/api/headers/:id", headerController.update);
router.delete("/api/headers/:id", headerController.remove);
router.get("/api/footer", footerController.publicFooter);
router.get("/api/footers", footerController.list);
router.get("/api/footers/:id", footerController.show);
router.post("/api/footers", footerController.create);
router.put("/api/footers/:id", footerController.update);
router.delete("/api/footers/:id", footerController.remove);
router.get("/api/media", mediaController.list);
router.post("/api/media", mediaUpload.single("file"), mediaController.upload);
router.patch("/api/media/:id", mediaController.update);
router.delete("/api/media/:id", mediaController.remove);

export default router;
