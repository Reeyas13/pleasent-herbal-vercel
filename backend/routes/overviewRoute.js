import overviewController from "../controllers/overviewController.js";
import { Router } from "express";

const overviewRoute = Router();

overviewRoute.post("/", overviewController.getAllInfo);
overviewRoute.post("/:id", overviewController.getOne);


export default overviewRoute