import express from "express";
import productController from "../controllers/productController.js";
import upload, { handleMulterError } from '../utils/multerConfig.js';

const productRoute = express.Router();

// Add multer middleware to handle file uploads
productRoute.post("/", upload.array('images', 5), handleMulterError, productController.post);
productRoute.get("/", productController.getAll);

productRoute.get("/:slug", productController.getOne);
productRoute.delete("/:slug", productController.delete);
productRoute.put("/:slug", upload.array('images', 5), handleMulterError, productController.update);
productRoute.get("/get/frontend", productController.getFrontend);
productRoute.post("/post/search", productController.search);
productRoute.get("/get/featured", productController.getFeatured);

export default productRoute;