import { Router } from "express";   
import userAddressController from "../controllers/userAddressController.js";

const userAddressRoute = Router();

userAddressRoute.get("/",userAddressController.get);
userAddressRoute.post("/",userAddressController.post);
userAddressRoute.get("/:id",userAddressController.getOne);
userAddressRoute.put("/:id",userAddressController.update);
userAddressRoute.delete("/:id",userAddressController.delete);
userAddressRoute.get("/get/myaddress",userAddressController.getByUser);

export default userAddressRoute