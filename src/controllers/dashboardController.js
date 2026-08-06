import { buildDashboard } from "../services/dashboardService.js";

export async function index(req, res) {
  const dashboard = await buildDashboard();
  res.render("admin/dashboard/index", {
    title: "Dashboard | Taxpedia Admin",
    activePage: "dashboard",
    ...dashboard,
  });
}
