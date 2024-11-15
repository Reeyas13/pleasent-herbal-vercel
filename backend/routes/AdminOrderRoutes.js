import { Router } from "express";   
import adminOrderController from '../controllers/adminOrderController.js';

const AdminOrderRoutes = Router();

AdminOrderRoutes.get("/",adminOrderController.getAllOrders)
AdminOrderRoutes.put("/:orderId",adminOrderController.edit)
AdminOrderRoutes.delete("/:orderId",adminOrderController.delete)
export default AdminOrderRoutes