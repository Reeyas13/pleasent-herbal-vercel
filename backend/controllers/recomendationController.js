import prisma from "../prisma/prisma.js";

export default {
  // Track product view (used for building recommendations)
  trackProductView: async (req, res) => {
    try {
      const { userId, productId } = req.body;
      
      if (!userId || !productId) {
        return res.status(400).json({ 
          message: "User ID and Product ID are required", 
          success: false 
        });
      }

      // Check if user and product exist
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) }
      });
      
      const product = await prisma.product.findUnique({
        where: { id: Number(productId) }
      });

      if (!user || !product) {
        return res.status(404).json({ 
          message: "User or Product not found", 
          success: false 
        });
      }

      // Update or create product view record
      const productView = await prisma.productView.upsert({
        where: {
          userId_productId: {
            userId: Number(userId),
            productId: Number(productId)
          }
        },
        update: {
          viewCount: { increment: 1 },
          lastViewed: new Date()
        },
        create: {
          userId: Number(userId),
          productId: Number(productId),
          viewCount: 1,
          lastViewed: new Date()
        }
      });

      return res.json({
        productView,
        message: "Product view tracked successfully",
        success: true
      });
    } catch (error) {
      console.error("Error tracking product view:", error);
      return res.status(500).json({ 
        message: error.message, 
        success: false 
      });
    }
  },

  // Get personalized recommendations for a user
  getRecommendations: async (req, res) => {
    try {
      const { userId } = req.params;
      const { limit = 10 } = req.query;
      
      if (!userId) {
        return res.status(400).json({ 
          message: "User ID is required", 
          success: false 
        });
      }

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) }
      });

      if (!user) {
        return res.status(404).json({ 
          message: "User not found", 
          success: false 
        });
      }

      // Get recommendations based on user's viewing history
      // 1. Find categories user is interested in (from viewed products)
      const userViewedProducts = await prisma.productView.findMany({
        where: { userId: Number(userId) },
        include: { product: true },
        orderBy: { viewCount: 'desc' },
        take: 5  // Consider top 5 most viewed products
      });

      // Extract category IDs from viewed products
      const categoryIds = [...new Set(userViewedProducts.map(view => view.product.category_Id))];

      // Get products from same categories that user hasn't viewed much
      const recommendedProducts = await prisma.product.findMany({
        where: {
          category_Id: { in: categoryIds },
          NOT: {
            id: { in: userViewedProducts.map(view => view.productId) }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: Number(limit)
      });

      // If we don't have enough recommendations, add some featured products
      if (recommendedProducts.length < Number(limit)) {
        const additionalProducts = await prisma.product.findMany({
          where: {
            featured: true,
            NOT: {
              id: { 
                in: [...recommendedProducts.map(p => p.id), 
                    ...userViewedProducts.map(view => view.productId)]
              }
            }
          },
          take: Number(limit) - recommendedProducts.length
        });
        
        recommendedProducts.push(...additionalProducts);
      }

      return res.json({
        recommendations: recommendedProducts,
        success: true
      });
    } catch (error) {
      console.error("Error getting recommendations:", error);
      return res.status(500).json({ 
        message: error.message, 
        success: false 
      });
    }
  },

  // Get similar products (content-based recommendation)
  getSimilarProducts: async (req, res) => {
    try {
      const { productId } = req.params;
      const { limit = 5 } = req.query;

      if (!productId) {
        return res.status(400).json({ 
          message: "Product ID is required", 
          success: false 
        });
      }

      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id: Number(productId) },
        include: { tags: true }
      });

      if (!product) {
        return res.status(404).json({ 
          message: "Product not found", 
          success: false 
        });
      }

      // Find products with similar tags
      let similarProducts = [];
      
      if (product.tags && product.tags.length > 0) {
        // Get product tags
        const tagNames = product.tags.map(tag => tag.name);
        
        // Find products with similar tags
        similarProducts = await prisma.product.findMany({
          where: {
            NOT: { id: Number(productId) },
            tags: {
              some: {
                name: { in: tagNames }
              }
            }
          },
          include: {
            tags: true
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
                in: [Number(productId), ...similarProducts.map(p => p.id)]
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
      console.error("Error getting similar products:", error);
      return res.status(500).json({ 
        message: error.message, 
        success: false 
      });
    }
  },

  // Get popular products (non-personalized recommendations)
  getPopularProducts: async (req, res) => {
    try {
      const { limit = 10, categoryId } = req.query;
      
      // Base query
      let whereClause = {};
      
      // Add category filter if provided
      if (categoryId) {
        whereClause.category_Id = Number(categoryId);
      }
      
      // Get popular products based on view count
      const popularProducts = await prisma.product.findMany({
        where: whereClause,
        orderBy: {
          productViews: {
            _count: 'desc'
          }
        },
        take: Number(limit)
      });

      // If we don't have enough popular products, supplement with recent products
      if (popularProducts.length < Number(limit)) {
        const recentProducts = await prisma.product.findMany({
          where: {
            NOT: { id: { in: popularProducts.map(p => p.id) } },
            ...(categoryId ? { category_Id: Number(categoryId) } : {})
          },
          orderBy: { createdAt: 'desc' },
          take: Number(limit) - popularProducts.length
        });
        
        popularProducts.push(...recentProducts);
      }

      return res.json({
        popularProducts,
        success: true
      });
    } catch (error) {
      console.error("Error getting popular products:", error);
      return res.status(500).json({ 
        message: error.message, 
        success: false 
      });
    }
  },

  // Add tags to a product (for content-based recommendations)
  addProductTags: async (req, res) => {
    try {
      const { productId } = req.params;
      const { tags } = req.body;
      
      if (!productId || !tags || !Array.isArray(tags)) {
        return res.status(400).json({ 
          message: "Product ID and tags array are required", 
          success: false 
        });
      }

      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id: Number(productId) }
      });

      if (!product) {
        return res.status(404).json({ 
          message: "Product not found", 
          success: false 
        });
      }

      // Add tags to product
      const createdTags = [];
      
      for (const tag of tags) {
        const { name, weight = 1.0 } = tag;
        
        const productTag = await prisma.productTag.upsert({
          where: {
            productId_name: {
              productId: Number(productId),
              name
            }
          },
          update: {
            weight: parseFloat(weight)
          },
          create: {
            productId: Number(productId),
            name,
            weight: parseFloat(weight)
          }
        });
        
        createdTags.push(productTag);
      }

      return res.json({
        tags: createdTags,
        message: "Product tags added successfully",
        success: true
      });
    } catch (error) {
      console.error("Error adding product tags:", error);
      return res.status(500).json({ 
        message: error.message, 
        success: false 
      });
    }
  },

  // Generate recommendations based on user purchase history
  getPurchaseBasedRecommendations: async (req, res) => {
    try {
      const { userId } = req.params;
      const { limit = 10 } = req.query;
      
      if (!userId) {
        return res.status(400).json({ 
          message: "User ID is required", 
          success: false 
        });
      }

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) }
      });

      if (!user) {
        return res.status(404).json({ 
          message: "User not found", 
          success: false 
        });
      }

      // Get user's purchase history
      const userPurchases = await prisma.orderItem.findMany({
        where: {
          userId: Number(userId),
          order: {
            status: { in: ['DELIVERED', 'SHIPPED'] }
          }
        },
        include: {
          product: {
            include: {
              categories: true
            }
          }
        }
      });

      if (userPurchases.length === 0) {
        // If user has no purchase history, return popular products instead
        const popularProducts = await prisma.product.findMany({
          where: {
            featured: true
          },
          orderBy: {
            productViews: {
              _count: 'desc'
            }
          },
          take: Number(limit)
        });

        return res.json({
          recommendations: popularProducts,
          message: "No purchase history found. Showing popular products instead.",
          success: true
        });
      }

      // Extract category IDs from purchased products
      const categoryIds = [...new Set(userPurchases.map(purchase => purchase.product.category_Id))];
      
      // Get product IDs that the user has already purchased
      const purchasedProductIds = userPurchases.map(purchase => purchase.productId);

      // Find products in the same categories that the user hasn't purchased yet
      const recommendedProducts = await prisma.product.findMany({
        where: {
          category_Id: { in: categoryIds },
          NOT: {
            id: { in: purchasedProductIds }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: Number(limit)
      });

      return res.json({
        recommendations: recommendedProducts,
        success: true
      });
    } catch (error) {
      console.error("Error getting purchase-based recommendations:", error);
      return res.status(500).json({ 
        message: error.message, 
        success: false 
      });
    }
  }
};