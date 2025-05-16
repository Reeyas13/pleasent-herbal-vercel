// controllers/attributeController.js
import prisma from "../prisma/prisma.js";
import { customError } from "../helpers/CustomError.js";
import slugify from "slugify";

export default {
  // ======================
  // Shoe Size CRUD
  // ======================
  getAllSizes: async (req, res, next) => {
    try {
      const sizes = await prisma.shoeSize.findMany();
      res.json(sizes);
    } catch (error) {
      next(customError(500, error.message));
    }
  },

  getSizeById: async (req, res, next) => {
    try {
      const size = await prisma.shoeSize.findUnique({
        where: { id: parseInt(req.params.id) }
      });
      if (!size) return next(customError(404, "Size not found"));
      res.json(size);
    } catch (error) {
      next(customError(500, error.message));
    }
  },

  createSize: async (req, res, next) => {
    try {
      const { value } = req.body;
      const newSize = await prisma.shoeSize.create({
        data: { value }
      });
      res.status(201).json(newSize);
    } catch (error) {
      if (error.code === 'P2002') {
        return next(customError(400, "Size value must be unique"));
      }
      next(customError(500, error.message));
    }
  },

  updateSize: async (req, res, next) => {
    try {
      const updatedSize = await prisma.shoeSize.update({
        where: { id: parseInt(req.params.id) },
        data: req.body
      });
      res.json(updatedSize);
    } catch (error) {
      if (error.code === 'P2025') {
        return next(customError(404, "Size not found"));
      }
      next(customError(500, error.message));
    }
  },

  deleteSize: async (req, res, next) => {
    try {
      await prisma.shoeSize.delete({
        where: { id: parseInt(req.params.id) }
      });
      res.status(204).send();
    } catch (error) {
      if (error.code === 'P2025') {
        return next(customError(404, "Size not found"));
      }
      if (error.code === 'P2003') {
        return next(customError(400, "Cannot delete size - used in products"));
      }
      next(customError(500, error.message));
    }
  },

  // ======================
  // Shoe Color CRUD
  // ======================
  getAllColors: async (req, res, next) => {
    try {
      const colors = await prisma.shoeColor.findMany();
      res.json(colors);
    } catch (error) {
      next(customError(500, error.message));
    }
  },

  createColor: async (req, res, next) => {
    try {
      const { name, hexCode } = req.body;
      const newColor = await prisma.shoeColor.create({
        data: { name, hexCode }
      });
      res.status(201).json(newColor);
    } catch (error) {
      next(customError(500, error.message));
    }
  },

  updateColor: async (req, res, next) => {
    try {
      const updatedColor = await prisma.shoeColor.update({
        where: { id: parseInt(req.params.id) },
        data: req.body
      });
      res.json(updatedColor);
    } catch (error) {
      if (error.code === 'P2025') {
        return next(customError(404, "Color not found"));
      }
      next(customError(500, error.message));
    }
  },

  deleteColor: async (req, res, next) => {
    try {
      await prisma.shoeColor.delete({
        where: { id: parseInt(req.params.id) }
      });
      res.status(204).send();
    } catch (error) {
      if (error.code === 'P2003') {
        return next(customError(400, "Cannot delete color - used in products"));
      }
      next(customError(500, error.message));
    }
  },

  // ======================
  // Shoe Brand CRUD
  // ======================
  getAllBrands: async (req, res, next) => {
    try {
      const brands = await prisma.shoeBrand.findMany();
      res.json(brands);
    } catch (error) {
      next(customError(500, error.message));
    }
  },

  createBrand: async (req, res, next) => {
    try {
      const { name } = req.body;
      let slug = slugify(name, { lower: true });
      let count = 1;
      
      while (true) {
        const existing = await prisma.shoeBrand.findFirst({ where: { slug } });
        if (!existing) break;
        slug = `${slug}-${count++}`;
      }

      const newBrand = await prisma.shoeBrand.create({
        data: { name, slug }
      });
      res.status(201).json(newBrand);
    } catch (error) {
      if (error.code === 'P2002') {
        return next(customError(400, "Brand name must be unique"));
      }
      next(customError(500, error.message));
    }
  },

  updateBrand: async (req, res, next) => {
    try {
      const { name } = req.body;
      let slug;
      
      if (name) {
        slug = slugify(name, { lower: true });
        let count = 1;
        const originalSlug = slug;

        while (true) {
          const existing = await prisma.shoeBrand.findFirst({
            where: { slug, NOT: { id: parseInt(req.params.id) } }
          });
          if (!existing) break;
          slug = `${originalSlug}-${count++}`;
        }
      }

      const updatedBrand = await prisma.shoeBrand.update({
        where: { id: parseInt(req.params.id) },
        data: { name, ...(slug && { slug }) }
      });
      res.json(updatedBrand);
    } catch (error) {
      if (error.code === 'P2025') {
        return next(customError(404, "Brand not found"));
      }
      next(customError(500, error.message));
    }
  },

  deleteBrand: async (req, res, next) => {
    try {
      await prisma.shoeBrand.delete({
        where: { id: parseInt(req.params.id) }
      });
      res.status(204).send();
    } catch (error) {
      if (error.code === 'P2003') {
        return next(customError(400, "Cannot delete brand - used in products"));
      }
      next(customError(500, error.message));
    }
  },

  // ======================
  // Product Tag CRUD
  // ======================
  getProductTags: async (req, res, next) => {
    try {
      const tags = await prisma.productTag.findMany({
        where: { productId: parseInt(req.params.productId) }
      });
      res.json(tags);
    } catch (error) {
      next(customError(500, error.message));
    }
  },

  createProductTag: async (req, res, next) => {
    try {
      const { name, weight } = req.body;
      const newTag = await prisma.productTag.create({
        data: {
          name,
          weight: weight || 1.0,
          productId: parseInt(req.params.productId)
        }
      });
      res.status(201).json(newTag);
    } catch (error) {
      if (error.code === 'P2002') {
        return next(customError(400, "Tag name must be unique for this product"));
      }
      next(customError(500, error.message));
    }
  },

  updateProductTag: async (req, res, next) => {
    try {
      const updatedTag = await prisma.productTag.update({
        where: { id: parseInt(req.params.tagId) },
        data: req.body
      });
      res.json(updatedTag);
    } catch (error) {
      if (error.code === 'P2025') {
        return next(customError(404, "Tag not found"));
      }
      next(customError(500, error.message));
    }
  },

  deleteProductTag: async (req, res, next) => {
    try {
      await prisma.productTag.delete({
        where: { id: parseInt(req.params.tagId) }
      });
      res.status(204).send();
    } catch (error) {
      if (error.code === 'P2025') {
        return next(customError(404, "Tag not found"));
      }
      next(customError(500, error.message));
    }
  }
};