import { getTokenInfo } from "../helpers/TokenHandler.js";
import prisma from "../prisma/prisma.js";

export default {
    getAllInfo: async (req, res) => {
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({ message: "Unauthorized" });
            }  

            const { userId } = await getTokenInfo(token);

            const orders = await prisma.order.findMany({
                where: {
                    userId: parseInt(userId),
                },
                include: {
                    payments: true,
                    shipping: {
                        include: {
                            city: true
                        }
                    },
                    products: true,
                    
                },
            })

            return res.json(orders);
        } catch (error) {
            return res.json({ error: error.message });
        }},
        getOne: async (req, res) => {
            try {
                const { id } = req.params;
                const token = req.cookies.token;
                if (!token) {
                    return res.status(401).json({ message: "Unauthorized" });
                }  
    
                const { userId } = await getTokenInfo(token);
    
                const order = await prisma.order.findUnique({
                    where: {
                        id: parseInt(id),
                        userId: parseInt(userId),

                    },
                    include: {
                        payments: true,
                        shipping: {
                            include: {
                                city: true
                            }   
                        },
                        products: true
                    },
                });
                console.log(order);
                return res.json(order);
            } catch (error) {
                return res.json({ error: error.message });
            }
        }
}