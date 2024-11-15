import { getTokenInfo } from "../helpers/TokenHandler.js";
import prisma from "../prisma/prisma.js";
import { sendOrderConfirmation } from "./testMail.js";

export default {
  get: async (req, res) => {
    try {
      const orders = await prisma.order.findMany({
        include: {
          payments: true,
          shipping: true,
          user: true,

        },
      });
      return res.json(orders);
    } catch (error) {
      return res.json({ error: error.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await prisma.order.findFirst({
        where: {
          id: parseInt(id),
        },
      });
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.json(order);
    } catch (error) {
      return res.json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await prisma.order.delete({
        where: {
          id: parseInt(id),
        },
      });
      return res.json(order);
    } catch (error) {
      return res.json({ error: error.message });
    }
  },
  post: async (req, res) => {
    // console.log("hit")
    try {
      const { productId, quantity, address, city_id, state, paymentType } =
        req.body;
      const token = req.cookies.token;
      if (!token) {
        return res.json({ message: "Unauthorized please login first", success: false });
      }
      const product = await prisma.product.findFirst({
        where: {
          id: parseInt(productId),
        },
      })
      if(!product){
        return res.json({ message: "Product not found", success: false });
      }
      if(product.stock<quantity){
        return res.json({ message: "out of stock", success: false });
      }
      const { userId,email } = await getTokenInfo(token);
      const city = await prisma.city.findFirst({
        where: {
          id: parseInt(city_id),
        },
      })
      const DefaultShippingRow = await prisma.orderShipping.create({
        data: {
          address: address,
          city_id: parseInt(city_id),
          state: state,
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          shippingFee: parseFloat(city.shippingFees), 
          /**
           * dos
           * create city table and add shipping fee based on city
           *i think thats best option for me
           *done------
           */
        },
      });
      const shippingId = DefaultShippingRow.id;
      const defaultPaymentRow = await prisma.orderPayment.create({
        data: {
          paymentType: paymentType,
        },
      });
      const paymentId = defaultPaymentRow.id;      
      const total = product.price * quantity + DefaultShippingRow.shippingFee;
      const order = await prisma.order.create({
        data: {
          total: parseFloat(total),
          productId: parseInt(productId),
          userId: parseInt(userId),
          payment_id: parseInt(paymentId),
          shipping_id: parseInt(shippingId),
          quantity: parseInt(quantity),
        },
        // include:{
        //   payments:true,
        //   shipping:{include:{order:true,city:true}},
        //   products:true

        // }
      });
      const images  = JSON.parse(product.imageUrls);
      await prisma.product.update({
        where: { id: parseInt(productId) },
        data: { stock: product.stock - quantity },
      });
      sendOrderConfirmation(email,order.id,images[0],product.name,product.price,order.quantity,DefaultShippingRow.shippingFee,order.total)
      
      return res.json({order,success:true,message:"order created"});
    } catch (error) {
      return res.json({ error: error.message });
    }
  },
};
