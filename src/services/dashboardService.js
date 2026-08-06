import { getDashboardData } from "../repositories/dashboardRepository.js";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export async function buildDashboard() {
  const data = await getDashboardData();
  const largestServiceGroup = Math.max(
    ...data.serviceBreakdown.map((item) => item.service_count),
    1,
  );

  return {
    ...data,
    recentArticles: data.recentArticles.map((article) => ({
      ...article,
      updatedLabel: formatDate(article.updatedAt),
    })),
    recentEnquiries: data.recentEnquiries.map((enquiry) => ({
      ...enquiry,
      createdLabel: formatDate(enquiry.createdAt),
    })),
    serviceBreakdown: data.serviceBreakdown.map((item) => ({
      ...item,
      percentage: Math.round((item.service_count / largestServiceGroup) * 100),
    })),
  };
}
