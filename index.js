import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sequelize from "./src/config/database.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import taxpediaRoutes from "./src/routes/taxpediaRoutes.js";
import errorHandler from "./src/middleware/errorHandler.js";
import serviceRoutes from "./src/routes/serviceRoutes.js";
import mainCategoryRoutes from "./src/routes/mainCategoryRoutes.js";
import subServiceRoutes from "./src/routes/subServiceRoutes.js";
import pageRoutes from "./src/routes/pageRoutes.js";
import dynamicSectionRoutes from "./src/routes/dynamicSectionRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", serviceRoutes);
app.use("/", mainCategoryRoutes);
app.use("/", subServiceRoutes);
app.use("/", pageRoutes);
app.use("/", dynamicSectionRoutes);
app.use("/", dashboardRoutes);
app.use("/", taxpediaRoutes);

app.use(errorHandler);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    process.exit(1);
  }
}

startServer();

export default app;
