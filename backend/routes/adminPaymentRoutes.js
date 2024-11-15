import { Router } from "express";   
import adminPaymentController from "../controllers/adminPaymentController.js";


const adminPaymentRoutes = Router();
adminPaymentRoutes.get("/",adminPaymentController.get);
export default adminPaymentRoutes