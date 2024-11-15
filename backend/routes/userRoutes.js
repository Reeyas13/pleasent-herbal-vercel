import { Router } from "express";
import UserController from "../controllers/userController.js";
import authorizeRole from "../middleware/authorizeRole.js";
import verifyUser from "../middleware/auth.js";
import userController from "../controllers/userController.js";
const userRouter = Router();

// userRouter.get("/", UserController.get);
userRouter.post("/register", UserController.post);
userRouter.post("/two-step", UserController.twoStepToken);
userRouter.get("/", authorizeRole("ADMIN"), UserController.get);
userRouter.post("/login", UserController.login);
userRouter.post("/logout", UserController.logout);
userRouter.get("/getmyInfo",userController.getMyInfo)
userRouter.get('/check-auth',verifyUser,(req,res)=>{
    const user = req.user
    return res.json({user,sucess:true,message:"user is authenticated"})
});
export default userRouter