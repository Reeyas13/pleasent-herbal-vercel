import prisma from "../prisma/prisma.js";

export default {
  // Get all cities
  get: async (req, res) => {
    try {
      const cities = await prisma.city.findMany();
      return res.json(cities);
    } catch (error) {
      return res.json({ error: error.message });
    }
  },

  // Get a single city by ID
  getById: async (req, res) => {
    const { id } = req.params;
    try {
      const city = await prisma.city.findUnique({
        where: { id: parent(id) },
      });
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }
      return res.json(city);
    } catch (error) {
      return res.json({ error: error.message });
    }
  },

  // Create a new city
  post: async (req, res) => {
    try {
      const { name, shippingFees } = req.body;
      if (!name) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      const city = await prisma.city.create({
        data: {
          name,
          shippingFees:parseInt(shippingFees),
        },
      });
      console.log(city)
      return res.json({
        city,
        message: "City created successfully",
        success: true,
      });
    } catch (error) {
        console.log({message:error.message})
      return res.json({ message: error.message,success:false });
    }
  },

  // Update a city by ID
  update: async (req, res) => {
    const { id } = req.params;
    const { name, shippingFees } = req.body;
    try {
      const city = await prisma.city.findUnique({
        where: { id: Number(id) },
      });
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }
      const updatedCity = await prisma.city.update({
        where: { id: Number(id) },
        data: {
          name: name || city.name,
          shippingFees: shippingFees !== undefined ? parseInt(shippingFees) : parseInt(city.shippingFees),
        },
      });
      return res.json({
        updatedCity,
        message: "City updated successfully",
        success: true,
      });
    } catch (error) {
      return res.json({ error: error.message });
    }
  },

  // Delete a city by ID
  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const city = await prisma.city.findUnique({
        where: { id: Number(id) },
      });
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }
      await prisma.city.delete({
        where: { id: Number(id) },
      });
      return res.json({
        message: "City deleted successfully",
        success: true,
      });
    } catch (error) {
      return res.json({ error: error.message });
    }
  },
};
