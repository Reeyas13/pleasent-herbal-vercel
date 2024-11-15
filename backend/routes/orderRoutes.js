import {Router} from 'express'
import orderController from '../controllers/orderController.js';
const orderRoutes = Router();


orderRoutes.get('/',orderController.get);
orderRoutes.post('/',orderController.post);
orderRoutes.get('/:id',orderController.getOne);
// orderRoutes.put('/:id',orderController.update);
orderRoutes.delete('/:id',orderController.delete);
export default orderRoutes