import app from "./utils/express.js";



app.listen(process.env.APP_PORT||3000, () => {
    console.log(`pleasent hearbal's backend is running on http://localhost:${process.env.APP_PORT}`); 
});