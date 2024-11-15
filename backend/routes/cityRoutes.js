import { Router } from "express";
import cityController from "../controllers/cityController.js";

const cityRoutes = Router();

cityRoutes.get("/",cityController.get);
cityRoutes.get("/:id",cityController.getById);
cityRoutes.post("/",cityController.post);
cityRoutes.put("/:id",cityController.update);
cityRoutes.delete("/:id",cityController.delete);

export default cityRoutes