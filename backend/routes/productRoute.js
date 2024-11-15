import { Router } from "express";   
import productController from "../controllers/productController.js";

const productRoute = Router();


productRoute.post("/",productController.post);
productRoute.get("/",productController.getAll);

productRoute.get("/:slug",productController.getOne);
productRoute.delete("/:slug",productController.delete);
productRoute.put("/:slug",productController.update);
productRoute.get("/get/frontend",productController.getFrontend);
productRoute.post("/post/search",productController.search);
productRoute.get("/get/featured",productController.getFeatured);

export default productRoute