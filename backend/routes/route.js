import { Router } from "express";   
import userRouter from "./userRoutes.js";
import productRoute from "./productRoute.js";
import categoryRoute from "./categoryRoute.js";
import userAddressRoute from "./UserAddressRoutes.js";
import orderShipmentRoute from "./OrderShipmentRoutes.js";
// import orderController from "../controllers/orderController.js";
import orderRoutes from "./orderRoutes.js";
import cartRoute from "./cartRoute.js";
import overviewRoute from "./overviewRoute.js";
import AdminOrderRoutes from "./AdminOrderRoutes.js";
import adminPaymentRoutes from "./adminPaymentRoutes.js";
import cityRoutes from "./cityRoutes.js";
import recomendationRoute from "./recommendationRoutes.js"
import attributeRoutes from "./attributeRoutes.js"


const router = Router();

router.use("/user", userRouter)

router.use('/products',productRoute)
router.use('/category',categoryRoute)
router.use("/user-address",userAddressRoute)
router.use("/order-shipment",orderShipmentRoute)
router.use("/order",orderRoutes)
router.use("/cart",cartRoute)
router.use("/overview",overviewRoute)
router.use("/admin/order",AdminOrderRoutes)

router.use("/admin/payment",adminPaymentRoutes)
router.use("/city",cityRoutes)
router.use("/",recomendationRoute)
router.use("/",attributeRoutes)
export default router