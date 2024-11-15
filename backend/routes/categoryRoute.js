import { Router } from "express"
import categoryController from "../controllers/categoryController.js";
// import authorizeRole from "../middleware/authorizeRole.js";

const categoryRoute = Router();

categoryRoute.get("/",categoryController.getAll);

categoryRoute.get("/:slug",categoryController.getOne);
categoryRoute.post("/",categoryController.post);
categoryRoute.put("/:slug",categoryController.update);
categoryRoute.delete("/:slug",categoryController.delete);


export default categoryRoute