// routes.js

// Shoe Sizes
router.get('/shoe-sizes', attributeController.getAllSizes);
router.get('/shoe-sizes/:id', attributeController.getSizeById);
router.post('/shoe-sizes', attributeController.createSize);
router.put('/shoe-sizes/:id', attributeController.updateSize);
router.delete('/shoe-sizes/:id', attributeController.deleteSize);

// Shoe Colors
router.get('/shoe-colors', attributeController.getAllColors);
router.post('/shoe-colors', attributeController.createColor);
router.put('/shoe-colors/:id', attributeController.updateColor);
router.delete('/shoe-colors/:id', attributeController.deleteColor);

// Shoe Brands
router.get('/shoe-brands', attributeController.getAllBrands);
router.post('/shoe-brands', attributeController.createBrand);
router.put('/shoe-brands/:id', attributeController.updateBrand);
router.delete('/shoe-brands/:id', attributeController.deleteBrand);

// Product Tags
router.get('/products/:productId/tags', attributeController.getProductTags);
router.post('/products/:productId/tags', attributeController.createProductTag);
router.put('/products/:productId/tags/:tagId', attributeController.updateProductTag);
router.delete('/products/:productId/tags/:tagId', attributeController.deleteProductTag);