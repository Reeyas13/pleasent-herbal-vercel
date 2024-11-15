import { Router } from "express";   
import orderShipmentController from "../controllers/orderShipmentController.js";
const orderShipmentRoute = Router();
orderShipmentRoute.get("/",orderShipmentController.get);
orderShipmentRoute.post("/",orderShipmentController.post);
orderShipmentRoute.get("/:id",orderShipmentController.getOne);
orderShipmentRoute.put("/:id",orderShipmentController.update);
orderShipmentRoute.delete("/:id",orderShipmentController.delete);
export default orderShipmentRoute