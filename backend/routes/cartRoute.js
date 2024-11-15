import {Router} from 'express'
import cartController from '../controllers/cartController.js';
const cartRoute = Router();

cartRoute.get('/',cartController.get);
cartRoute.post('/',cartController.post);
cartRoute.get('/:id',cartController.getOne);
cartRoute.put('/:id',cartController.update);
cartRoute.delete('/:id',cartController.delete);
cartRoute.post('/user',cartController.getByUser);
cartRoute.post('/add',cartController.add);
cartRoute.post('/sub',cartController.sub);
cartRoute.post('/checkout',cartController.checkoutCart);

export default cartRoute