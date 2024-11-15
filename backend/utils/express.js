import express from "express";
import router from "../routes/route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import fileUpload from "express-fileupload";
import { createOrder } from "../helpers/initiatePayment.js";
import { handleEsewaSuccess, updateOrderAfterPayment } from "../controllers/esewa.js";
// import { initiatePayment } from "../helpers/initiatePayment.js";

const app = express();

// middlewares
app.use(fileUpload({ safeFileNames: true, preserveExtension: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: process.env.FRONTENDURL}));// cross origin port communication
app.use("/api", router);


app.post("/api/payment/initiate",createOrder)
app.get("/api/esewa/success",handleEsewaSuccess,updateOrderAfterPayment)
app.get("/api/esewa/failure",(req,res)=>{
    console.log(req.body)
    return res.status(200).json({success:false})
})

// app.use("*", (req, res) => {
//     return res.status(404).json({
//         success: false,
//         message: "Page not found",
//     });
// })
export default app;
