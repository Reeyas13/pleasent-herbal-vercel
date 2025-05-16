import { Router } from "express";
import recommendationController from "../controllers/recomendationController.js";

const recommendationRoutes = Router();

// Track user product views (used for building recommendations)
recommendationRoutes.post("/track-view", recommendationController.trackProductView);

// Get personalized recommendations for a user
recommendationRoutes.get("/user/:userId", recommendationController.getRecommendations);

// Get similar products (content-based recommendation)
recommendationRoutes.get("/similar/:productId", recommendationController.getSimilarProducts);

// Get popular products (non-personalized recommendations)
recommendationRoutes.get("/popular", recommendationController.getPopularProducts);

// Add tags to a product (for content-based recommendations)
recommendationRoutes.post("/tags/:productId", recommendationController.addProductTags);

// Get recommendations based on purchase history
recommendationRoutes.get("/purchase-history/:userId", recommendationController.getPurchaseBasedRecommendations);

export default recommendationRoutes;