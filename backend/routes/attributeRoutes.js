import attributeController from '../controllers/attributeController.js';
import {Router} from 'express'
// Attribute routes
const attributeRoutes = Router();
attributeRoutes.get('/shoe-sizes', attributeController.getAllSizes);
attributeRoutes.get('/shoe-sizes/:id', attributeController.getSizeById);
attributeRoutes.post('/shoe-sizes', attributeController.createSize);
attributeRoutes.put('/shoe-sizes/:id', attributeController.updateSize);
attributeRoutes.delete('/shoe-sizes/:id', attributeController.deleteSize);

// Shoe Colors
attributeRoutes.get('/shoe-colors', attributeController.getAllColors);
attributeRoutes.post('/shoe-colors', attributeController.createColor);
attributeRoutes.put('/shoe-colors/:id', attributeController.updateColor);
attributeRoutes.delete('/shoe-colors/:id', attributeController.deleteColor);

// Shoe Brands
attributeRoutes.get('/shoe-brands', attributeController.getAllBrands);
attributeRoutes.post('/shoe-brands', attributeController.createBrand);
attributeRoutes.put('/shoe-brands/:id', attributeController.updateBrand);
attributeRoutes.delete('/shoe-brands/:id', attributeController.deleteBrand);

// Product Tags
attributeRoutes.get('/products/:productId/tags', attributeController.getProductTags);
attributeRoutes.post('/products/:productId/tags', attributeController.createProductTag);
attributeRoutes.put('/products/:productId/tags/:tagId', attributeController.updateProductTag);
attributeRoutes.delete('/products/:productId/tags/:tagId', attributeController.deleteProductTag);// Changed to plural
export default attributeRoutes