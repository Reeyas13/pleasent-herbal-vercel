import prisma from "../prisma/prisma.js";

export default {

    get:async(req,res)=>{
        try {
            const payments = await prisma.payment.findMany({
                include:{
                    order: true,
                    user: true
                },
                orderBy:{
                    status: "asc"
                }
            });
            return res.json(payments);
        } catch (error) {
            return res.json({ error: error.message });
        }
    }
}