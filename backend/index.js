import app from "./utils/express.js";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(express.static(path.join(__dirname, "/client/build")));

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "/client/build/", "index.html"));
// })


app.listen(process.env.APP_PORT||5000, () => {
    console.log(`pleasent hearbal's backend is running on http://localhost:${process.env.APP_PORT}`); 
});