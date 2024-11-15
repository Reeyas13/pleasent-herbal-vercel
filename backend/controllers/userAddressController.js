import { parse } from "dotenv";
import { getTokenInfo } from "../helpers/TokenHandler.js";
import prisma from "../prisma/prisma.js";
export default {
  get: async (req, res) => {
    try {
      const userAddresses = await prisma.userAddress.findMany({
        include: {
          City: true,
        },
      });

      if (userAddresses.length < 1) {
        return res.status(404).json({ message: "No user address found" });
      }
      return res.json(userAddresses);
    } catch (error) {
      return next(error);
    }
  },
  post: async (req, res) => {
    try {
      const { addressLine1, addressLine2, city_id, state, phone } = req.body;
      const token = req.cookies.token;
      if(!token){
        return res.json({ message: "Unauthorized" });
      }
      const decoded = await getTokenInfo(token);
      const userId = decoded.userId;
      if (!userId) {
        return res.status(400).json({ message: "Must be logged in" });
      }
      if (!addressLine1 || !addressLine2 || !city_id || !state || !phone) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const usersAddressExist = await prisma.userAddress.findFirst({
        where: {
          userId,
        },
      });
      if (usersAddressExist) {
        const update = await prisma.userAddress.update({
          where: {
            userId: parseInt(userId),
            id:parseInt(usersAddressExist.id)
          },
          data: {
            addressLine1,
            addressLine2,
            city_id: parseInt(city_id),
            state,
            phone,
          },
        })
        console.log("update")
        return res.json({update,success:true,message:"Address updated successfully"});

      }
      const userAddress = await prisma.userAddress.create({
        data: {
          userId,
          addressLine1,
          addressLine2,
          city_id: parseInt(city_id),
          state,
          phone,
        },
      });
      return res.json(userAddress);
    } catch (error) {
      return res.json({ error: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const userAddress = await prisma.userAddress.delete({
        where: {
          id,
        },
      });
      return res.json(userAddress);
    } catch (error) {
      return res.json({ error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { addressLine1, addressLine2, city_id, state, phone } = req.body;
      const token = req.cookies.token;
      const decoded = await getTokenInfo(token);
      const userId = decoded.id;
      if (!userId) {
        return res.status(400).json({ message: "Must be logged in" });
      }
      const userAddress = await prisma.userAddress.update({
        where: {
          id: parseInt(id),
        },
        data: {
          // userId:parseInt(userId),
          addressLine1: addressLine1 || userAddress.addressLine1,
          addressLine2: addressLine2 || userAddress.addressLine2,
          city_id: parseInt(city_id) || parseInt(userAddress.city_id),
          state: state || userAddress.state,
          phone: phone || userAddress.phone,
          country: "Nepal",
          postalCode: "0007",
        },
      });
      return res.json(userAddress);
    } catch (error) {
      return res.json({ error: error.message });
    }
  },
  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const userAddress = await prisma.userAddress.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          City: true,
        },
      });
      return res.json(userAddress);
    } catch (error) {
      return res.json({ error: error.message });
    }
  },
  getByUser: async (req, res) => {
    try {
      const token = req.cookies.token;
      const { userId } = await getTokenInfo(token);
      const userAddress = await prisma.userAddress.findFirst({
        where: {
          userId: parseInt(userId),
        },
        include: {
          City: true,

        },
      });
      return res.json({userAddress,success:true});
    } catch (error) {
      return res.json({ error: error.message });
    }
  },
};
