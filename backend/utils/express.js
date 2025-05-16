import express from "express";
import router from "../routes/route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { createOrder } from "../helpers/initiatePayment.js";
import { handleEsewaSuccess, updateOrderAfterPayment } from "../controllers/esewa.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Important for parsing form data
app.use(cookieParser());
app.use(cors({credentials: true, origin: process.env.FRONTENDURL, methods: ["GET", "POST", "PUT", "DELETE"]}));

// Configure static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "pleasant herbal's backend is running",
    });
});

app.use("/api", router);

app.post("/api/payment/initiate", createOrder);
app.get("/api/esewa/success", handleEsewaSuccess, updateOrderAfterPayment);
app.get("/api/esewa/failure", (req, res) => {
    console.log(req.body);
    return res.status(200).json({success: false});
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/build')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/build/index.html'));
    });
}

export default app;
