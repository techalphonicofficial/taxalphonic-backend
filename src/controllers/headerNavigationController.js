import { getNavigationSources } from "../services/headerNavigationService.js";

export const list = async (req, res) => {
  res.json(await getNavigationSources());
};
