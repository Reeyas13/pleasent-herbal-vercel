import slugify from "slugify";

import prisma from "../prisma/prisma.js";

export default {
  post: async (req, res) => {
    try {
      const { name, description } = req.body;
      if (!name || !description) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      let slug = slugify(name, { lower: true });
      let slugExists = await prisma.category.findUnique({
        where: { slug },
      });
      let count = 1;

      while (slugExists) {
        slug = `${slugify(name, { lower: true })}-${count}`;
        slugExists = await prisma.category.findUnique({ where: { slug } });
        count++;
      }

      const category = await prisma.category.create({
        data: {
          name,
          description,
          slug,
        },
      });
      return res.json(category);
    } catch (error) {
      return res.json({
        message: error.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const categories = await prisma.category.findMany();
      return res.json(categories);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  getOne: async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await prisma.category.findUnique({
        where: { slug },
      });
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      return res.json(category);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { slug } = req.params;
      const { name, description } = req.body;
      const category = await prisma.category.update({
        where: { slug },
        data: { name, description },
      });
      return res.json(category);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await prisma.category.delete({
        where: { slug },
      });
      return res.json(category);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
};
