import slugify from "slugify";
import { customError } from "../helpers/CustomError.js";
import { uploadImage, deleteImage } from "../helpers/ImageHandler.js";
import prisma from "../prisma/prisma.js";

export default {
  getAll: async (req, res, next) => {
    try {
      const products = await prisma.product.findMany({
        include: {
          categories: {
            select: {
              name: true,
            },
          },
        },
      });
      return res.json(products);
    } catch (error) {
      return next(customError(500, error.message));
    }
  },

  post: async (req, res, next) => {
    try {
      const { name, description, price, stock, category_id,featured } = req.body;
      const { images } = req.files;

      if (
        !name ||
        !description ||
        !price ||
        !stock ||
        !category_id ||
        !images
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const uploadResult = await uploadImage(image);
          return uploadResult?.url || null; // Filter out null values
        })
      ).then((urls) => urls.filter((url) => url)); // Remove any null values

      let slug = slugify(name, { lower: true });
      let slugExist = await prisma.product.findFirst({ where: { slug } });
      let count = 1;

      while (slugExist) {
        slug = `${slugify(name, { lower: true })}-${count}`;
        slugExist = await prisma.product.findFirst({ where: { slug } });
        count++;
      }

      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          stock: parseInt(stock),
          slug,
          featured:featured?true:false,
          imageUrls: JSON.stringify(imageUrls), 
          category_Id: parseInt(category_id),
        },
      });

      return res.json(product);
    } catch (error) {
     return res.json({ error: error.message });
    }
  },

  update: async (req, res, next) => {
    try {
      const { slug } = req.params;
      const { name, description, price, stock, category_id,featured } = req.body;
      const images = req?.files?.images;

      const product = await prisma.product.findFirst({ where: { slug } });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Delete old images if there are new images uploaded
      if (images) {
        const oldImageUrls = JSON.parse(product.imageUrls);
        await Promise.all(
          oldImageUrls.map((oldImageUrl) => deleteImage(oldImageUrl))
        );
      }

      const imageUrls = images
        ? await Promise.all(
            images.map(async (image) => {
              const uploadResult = await uploadImage(image);
              return uploadResult?.url || null;
            })
          ).then((urls) => urls.filter((url) => url))
        : JSON.parse(product.imageUrls);

      const updatedProduct = await prisma.product.update({
        where: { slug },
        data: {
          name,
          description,
          price: parseFloat(price),
          stock: parseInt(stock),
          imageUrls: JSON.stringify(imageUrls),
          featured:featured?true:false,
          category_Id: parseInt(category_id), // Ensure category_id is stored correctly
        },
      });

      return res.json(updatedProduct);
    } catch (error) {
      return next(customError(500, error.message));
    }
  },

  delete: async (req, res, next) => {
    try {
      const { slug } = req.params;
      const product = await prisma.product.findFirst({ where: { slug } });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const oldImageUrls = JSON.parse(product.imageUrls);
      await Promise.all(
        oldImageUrls.map((oldImageUrl) => deleteImage(oldImageUrl))
      );

      const deletedProduct = await prisma.product.delete({ where: { slug } });
      return res.json(deletedProduct);
    } catch (error) {
      return next(customError(500, error.message));
    }
  },

  getOne: async (req, res, next) => {
    try {
      const { slug } = req.params;
      const product = await prisma.product.findFirst({
        include: {
          categories: {
            select: {
              name: true,
            },
          },
        },
        where: { slug },
      });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.json(product);
    } catch (error) {
      return next(customError(500, error.message));
    }
  },
  getFrontend: async (req, res) => {

    try {
      const products = await prisma.product.findMany({
        include: {
          categories: {
            select: {
              name: true,
            },
          },
        },
        where:{
          stock:{gt:0}
        }
      });
      return res.json(products);
    } catch (error) {
      return next(customError(500, error.message));
    }
  },
  search: async (req, res,next) => {

    try {
      const { search } = req.body;

      const products = await prisma.product.findMany({
        where: {
          stock:{gt:0},
          name:{
            contains:search
          }
        },
      });
      return res.json(products);
    } catch (error) {
      return next(customError(500, error.message));
    }
  },
  getFeatured: async (req, res) => {

    try {
      const products = await prisma.product.findMany({
        where: {
          stock:{gt:0},
          featured:true
        },
      });
      return res.json(products);
    } catch (error) {
      return next(customError(500, error.message));
    }
  }
};
