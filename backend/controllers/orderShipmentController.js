import { getTokenInfo } from "../helpers/TokenHandler.js";
import prisma from "../prisma/prisma.js";
export default {
  get: async (req, res) => {
    try {
      const orderShipment = await prisma.orderShipping.findMany();
      return res.json(orderShipment);
    } catch (error) {
      return res.json({ error: error.message });
    }
  },
  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const orderShipment = await prisma.orderShipping.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      return res.json(orderShipment);
    } catch (error) {
      return res.json({ error: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const orderShipment = await prisma.orderShipping.delete({
        where: {
          id: parseInt(id),
        },
      });
      return res.json(orderShipment);
    } catch (error) {
      return res.json({ error: error.message });
    }
  },
  post: async (req, res) => {
    try {
      const { orderId, address, city, state, } = req.body;

      
      if (!orderId || !address || !city || !state ) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const {userId}= await getTokenInfo(token);
    /*
      #todos,
      make table of cities and add shipping fees based on city cuz distributer is only in one place so this makes sense to me the most
      making it static for now
          */

      const orderShipment = await prisma.orderShipping.create({
        data: {
          orderId: parseInt(orderId),
          address,
          city,
          state,
          shippingFee: parseFloat(45),
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
      return res.json(orderShipment);
    } catch (error) {
      return res.json({ error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { address, city, state } = req.body;
      const existingShipping = await prisma.orderShipping.findFirst({
          where: {
              id: parseInt(id),
          }
      })
      if (!existingShipping) {
          return res.status(404).json({ message: "Shipping not found" });
      }
      const orderShipment = await prisma.orderShipping.update({
        where: {
          id: parseInt(id),
        },
        data: {
          address: address || existingShipping.address,
          city: city || existingShipping.city,
          state: state || existingShipping.state,
        },
      });
      return res.json(orderShipment);
    } catch (error) {
      return res.json({ error: error.message });
    }
  },
};
