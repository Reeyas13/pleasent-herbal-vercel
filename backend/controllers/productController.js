import slugify from "slugify";
import { customError } from "../helpers/CustomError.js";
import { deleteImage, getImageUrl } from "../helpers/ImageHandler.js";
import prisma from "../prisma/prisma.js";
import path from "path";

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
      const { name, description, price, stock, category_id, featured, tags } = req.body;
      
      if (!name || !description || !price || !stock || !category_id) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      // Handle uploaded images via Multer
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "At least one image is required" });
      }
      
      console.log("Files received:", req.files);
      
      // Get the image paths and convert to URLs
      const imageUrls = req.files.map(file => getImageUrl(file.filename));

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
          featured: featured === "true" || featured === true ? true : false,
          imageUrls: JSON.stringify(imageUrls), 
          category_Id: parseInt(category_id),
        },
      });

      // Add tags if provided (for recommendation system)
      if (tags && Array.isArray(JSON.parse(tags))) {
        const parsedTags = JSON.parse(tags);
        for (const tag of parsedTags) {
          await prisma.productTag.create({
            data: {
              productId: product.id,
              name: tag.name,
              weight: tag.weight || 1.0
            }
          });
        }
        
        // Fetch the product with tags for the response
        const productWithTags = await prisma.product.findUnique({
          where: { id: product.id },
          include: { tags: true }
        });
        
        return res.json(productWithTags);
      }

      return res.json(product);
    } catch (error) {
      console.error("Error in product creation:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res, next) => {
    try {
      const { slug } = req.params;
      const { name, description, price, stock, category_id, featured, tags } = req.body;
      
      const product = await prisma.product.findFirst({ where: { slug } });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Get current image URLs from the DB
      const currentImageUrls = JSON.parse(product.imageUrls);
      
      // If new images were uploaded
      let imageUrls = currentImageUrls;
      if (req.files && req.files.length > 0) {
        // Delete old images
        await Promise.all(
          currentImageUrls.map(url => deleteImage(url))
        );
        
        // Use new images
        imageUrls = req.files.map(file => getImageUrl(file.filename));
      }

      const updatedProduct = await prisma.product.update({
        where: { slug },
        data: {
          name,
          description,
          price: parseFloat(price),
          stock: parseInt(stock),
          imageUrls: JSON.stringify(imageUrls),
          featured: featured === "true" || featured === true ? true : false,
          category_Id: parseInt(category_id),
        },
      });

      // Update tags if provided
      if (tags && Array.isArray(JSON.parse(tags))) {
        // Delete existing tags
        await prisma.productTag.deleteMany({
          where: { productId: product.id }
        });
        
        // Add new tags
        const parsedTags = JSON.parse(tags);
        for (const tag of parsedTags) {
          await prisma.productTag.create({
            data: {
              productId: product.id,
              name: tag.name,
              weight: tag.weight || 1.0
            }
          });
        }
      }

      // Fetch updated product with tags
      const productWithTags = await prisma.product.findUnique({
        where: { id: product.id },
        include: { 
          tags: true,
          categories: {
            select: {
              name: true,
            },
          },
        }
      });

      return res.json(productWithTags);
    } catch (error) {
      console.error("Error in product update:", error);
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

      // Delete image files
      const imageUrls = JSON.parse(product.imageUrls);
      await Promise.all(
        imageUrls.map(url => deleteImage(url))
      );

      // Delete related product tags first
      await prisma.productTag.deleteMany({
        where: { productId: product.id }
      });
      
      // Delete product views
      await prisma.productView.deleteMany({
        where: { productId: product.id }
      });

      const deletedProduct = await prisma.product.delete({ where: { slug } });
      return res.json(deletedProduct);
    } catch (error) {
      return next(customError(500, error.message));
    }
  },

  getOne: async (req, res, next) => {
    try {
      const { slug } = req.params;
      const { userId } = req.query; // Get user ID from query to track view
      
      const product = await prisma.product.findFirst({
  include: {
    categories: {
      select: {
        name: true,
      },
    },
    tags: true, // Include product tags for recommendations
    shoeColor: true,  // Changed from shoeColors to shoeColor
    shoeSizes: true,  // This should remain as shoeSizes
    shoeBrand: true   // Changed from shoeBrands to shoeBrand
  },
  where: { slug },
});
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Track the product view for the recommendation system if userId is provided
      if (userId) {
        try {
          // Update or create product view record
          await prisma.productView.upsert({
            where: {
              userId_productId: {
                userId: Number(userId),
                productId: product.id,
              }
            },
            update: {
              viewCount: { increment: 1 },
              lastViewed: new Date(),
            },
            create: {
              userId: Number(userId),
              productId: product.id,
              viewCount: 1,
              lastViewed: new Date(),
            }
          });
        } catch (viewError) {
          console.error("Error tracking product view:", viewError);
          // Don't fail the main request if view tracking fails
        }
      }
      
      return res.json(product);
    } catch (error) {
      return next(customError(500, error.message));
    }
  },
  
  getFrontend: async (req, res, next) => {
    try {
      const products = await prisma.product.findMany({
        include: {
          categories: {
            select: {
              name: true,
            },
          },
        },
        where: {
          stock: { gt: 0 }
        }
      });
      return res.json(products);
    } catch (error) {
      return next(customError(500, error.message));
    }
  },
  
  search: async (req, res, next) => {
    try {
      const { search } = req.body;

      const products = await prisma.product.findMany({
        where: {
          stock: { gt: 0 },
          name: {
            contains: search
          }
        },
      });
      return res.json(products);
    } catch (error) {
      return next(customError(500, error.message));
    }
  },
  
  getFeatured: async (req, res, next) => {
    try {
      const products = await prisma.product.findMany({
        where: {
          stock: { gt: 0 },
          featured: true
        },
      });
      return res.json(products);
    } catch (error) {
      return next(customError(500, error.message));
    }
  },
  
  // New methods for recommendation functionality
  
  // Get product tags
  getProductTags: async (req, res, next) => {
    try {
      const { slug } = req.params;
      
      const product = await prisma.product.findFirst({
        where: { slug },
        include: { tags: true }
      });
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      return res.json({
        productId: product.id,
        tags: product.tags,
        success: true
      });
    } catch (error) {
      return next(customError(500, error.message));
    }
  },
  
  // Update product tags
  updateProductTags: async (req, res, next) => {
    try {
      const { slug } = req.params;
      const { tags } = req.body;
      
      if (!Array.isArray(tags)) {
        return res.status(400).json({ message: "Tags must be an array" });
      }
      
      const product = await prisma.product.findFirst({ where: { slug } });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Delete existing tags
      await prisma.productTag.deleteMany({
        where: { productId: product.id }
      });
      
      // Add new tags
      const createdTags = [];
      for (const tag of tags) {
        const productTag = await prisma.productTag.create({
          data: {
            productId: product.id,
            name: tag.name,
            weight: tag.weight || 1.0
          }
        });
        createdTags.push(productTag);
      }
      
      return res.json({
        tags: createdTags,
        message: "Product tags updated successfully",
        success: true
      });
    } catch (error) {
      return next(customError(500, error.message));
    }
  },
  
  // Get similar products
  getSimilarProducts: async (req, res, next) => {
    try {
      const { slug } = req.params;
      const { limit = 5 } = req.query;
      
      const product = await prisma.product.findFirst({
        where: { slug },
        include: { tags: true }
      });
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Find products with similar tags
      let similarProducts = [];
      
      if (product.tags && product.tags.length > 0) {
        // Get product tags
        const tagNames = product.tags.map(tag => tag.name);
        
        // Find products with similar tags
        similarProducts = await prisma.product.findMany({
          where: {
            NOT: { id: product.id },
            tags: {
              some: {
                name: { in: tagNames }
              }
            },
            stock: { gt: 0 }
          },
          include: {
            tags: true,
            categories: {
              select: {
                name: true,
              },
            },
          },
          take: Number(limit)
        });
        
        // Sort by number of matching tags
        similarProducts.sort((a, b) => {
          const aMatchCount = a.tags.filter(tag => tagNames.includes(tag.name)).length;
          const bMatchCount = b.tags.filter(tag => tagNames.includes(tag.name)).length;
          return bMatchCount - aMatchCount;
        });
      }
      
      // If we don't have enough similar products, add products from the same category
      if (similarProducts.length < Number(limit)) {
        const categoryProducts = await prisma.product.findMany({
          where: {
            category_Id: product.category_Id,
            NOT: { 
              id: {
                in: [product.id, ...similarProducts.map(p => p.id)]
              }
            },
            stock: { gt: 0 }
          },
          include: {
            categories: {
              select: {
                name: true
              }
            }
          },
          take: Number(limit) - similarProducts.length
        });
        
        similarProducts.push(...categoryProducts);
      }
      
      return res.json({
        similarProducts,
        success: true
      });
    } catch (error) {
      return next(customError(500, error.message));
    }
  }
};