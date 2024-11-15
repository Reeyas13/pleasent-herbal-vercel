import { getTokenInfo } from "../helpers/TokenHandler.js";
import prisma from "../prisma/prisma.js";

export default {
  get: async (req, res) => {
    try {
      const cartItems = await prisma.cart.findMany({
        include: {
          product: true,
          user: true,
        },
      });
  
      // Map cart items and add a message for items where quantity exceeds stock
      const cartWithMessages = cartItems.map((item) => {
        console.log(item)
        if (item.quantity > item.product.stock) {
          return {
            ...item,
            message: `Only ${item.product.stock} units of ${item.product.name} are available in stock.`,
          };
        }
        return {
          ...item,
          message: null, // No message needed if quantity is within stock limits
        };
      });
  
      return res.json({ cart: cartWithMessages, success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  
  post: async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "Log in First" });
      }
  
      const { userId } = await getTokenInfo(token);
      const existingCartItem = await prisma.cart.findFirst({
        where: {
          productId: parseInt(productId),
          userId: parseInt(userId),
        },
      });
  
      // If item exists, update the quantity
      if (existingCartItem) {
        const updatedCartItem = await prisma.cart.update({
          where: {
            id: existingCartItem.id,
          },
          data: {
            quantity: existingCartItem.quantity + parseInt(quantity),
          },
        });
        return res.json({
          cart: updatedCartItem,
          message: `Quantity updated for ${existingCartItem.productId}.`,
        });
      }
  
      // If item does not exist, create a new cart entry
      const newCartItem = await prisma.cart.create({
        data: {
          productId: parseInt(productId),
          quantity: parseInt(quantity),
          userId: parseInt(userId),
        },
      });
  
      return res.json({
        cart: newCartItem,
        message: `Added new item to cart.`,
      });
    } catch (error) {
      return res.json({ error: error.message });
    }
  },
  
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const cart = await prisma.cart.delete({
        where: {
          id: parseInt(id),
        },
      });
      return res.json(cart);
    } catch (error) {
      return res.json({ error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const cart = await prisma.cart.update({
        where: {
          id: parseInt(id),
        },
        data: {
          quantity: parseInt(quantity),
        },
      });
      return res.json(cart);
    } catch (error) {
      return res.json({ error: error.message });
    }
  },
  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const cart = await prisma.cart.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      return res.json(cart);
    } catch (error) {
      return res.json({ error: error.message });
    }
  },
  getByUser: async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "Log in First" });
      }
      const { userId } = await getTokenInfo(token);
      const cart = await prisma.cart.findMany({
        where: {
          userId: parseInt(userId),
        },
        include: {
          product: true,
        },
      });
      let total = 0;
      let quantity = 0;
     
      if(cart.length>0){
        for (let i = 0; i < cart.length; i++) {
          total += cart[i].product.price * cart[i].quantity;
          quantity += cart[i].quantity;
        }
        
      }
      const cartWithMessages = cart.map((item) => {
        const { quantity, product } = item;
      
        // Out of stock
        if (product.stock === 0) {
          return {
            ...item,
            message: `${product.name} is currently out of stock.`,
          };
        }
      
        // Limited stock (quantity exceeds available stock)
        if (quantity > product.stock) {
          return {
            ...item,
            message: `Only ${product.stock} units of ${product.name} are available in stock.`,
          };
        }
      
        // Max quantity reached (quantity equals available stock)
        if (quantity === product.stock) {
          return {
            ...item,
            message: `You have added the maximum available stock of ${product.name}.`,
          };
        }
      
        // No message if quantity is within stock limits
        return {
          ...item,
          message: null,
        };
      });
      
  
      return res.json({ cart: cartWithMessages, success: true,total,quantity });
      // return res.json({cart,success:true,total,quantity});
    } catch (error) {
      return res.json({ error: error.message });
    }
  },
  add: async (req, res) => {
    try {
      const id = req.body.itemId;
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "Log in First" });
      }
      const cartItem = await prisma.cart.findFirst({
        where: {
          id: parseInt(id),
        },
      });
      if (!cartItem) {
        return res.json({ message: "Item not found", success: false });
      }
      //checking if product stock is enough
      const product = await prisma.product.findFirst({
        where: {
          id: cartItem.productId,
        },
      })
      if(product.stock<0){
        return res.json({message:"out of stock",success:false});
      }
      // const { userId } = await getTokenInfo(token);
      await prisma.cart.update({
        where: {
          id: parseInt(id),
        },
        data: {
          quantity: cartItem.quantity + 1,
          // userId: parseInt(userId),
        },
      });
      return res.json({message:"added one quantity of item ",success:true});
    } catch (error) {
      return res.json({ error: error.message });
    }
  },
  sub: async (req, res) => {
    try {
      const id = req.body.itemId;
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "Log in First", success: false });
      }
      const cartItem = await prisma.cart.findFirst({
        where: {
          id: parseInt(id),
        },
      });
      if (!cartItem) {
        return res.json({ message: "Item not found", success: false });
      }
      const { userId } = await getTokenInfo(token);
      if (cartItem.quantity === 1) {
        await prisma.cart.delete({
          where: {
            id: parseInt(id),
          },
        });
        return res.json({message:"deleted",success:true});
      }
      await prisma.cart.update({
        where: {
          id: parseInt(id),
        },
        data: {
          quantity: cartItem.quantity - 1,
          // userId: parseInt(userId),
        },
      });
      return res.json({message:"subtracted one quantity of item ",success:true});
    } catch (error) {
      return res.json({ error: error.message });
    }
  },
  checkoutCart: async (req, res) => {
    try {
      const {  address, city_id, state, paymentType } = req.body;
      const token = req.cookies.token;
  // console.log({ address, city, state, paymentType });
      if (!token) {
        return res.json({ message: "Unauthorized, please login first", success: false });
      }
  
      const { userId } = await getTokenInfo(token);
  const cartItems = await prisma.cart.findMany({
    where: {
      userId: parseInt(userId),
    },
    include: {
      product: true,
    },
  })
  const city = await prisma.city.findFirst({
    where: {
      id: parseInt(city_id),
    },
  })
      // Create shipping and payment records
      const shippingRow = await prisma.orderShipping.create({
        data: {
          address,
          city_id: parseInt(city.id),
          state,
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          shippingFee: city.shippingFees, // Static shipping fee
        },
      });
      const shippingId = shippingRow.id;
  
      const paymentRow = await prisma.orderPayment.create({
        data: {
          paymentType,
        },
      });
      const paymentId = paymentRow.id;
  
      const orderData = [];
      const outOfStockItems = [];
  
      for (const item of cartItems) {
        const { productId, quantity } = item;
  
        // Check product stock
        const product = await prisma.product.findFirst({
          where: { id: parseInt(productId) },
        });
  
        if (!product) {
          return res.json({ message: `Product with ID ${productId} not found`, success: false });
        }
  
        if (product.stock < quantity) {
          outOfStockItems.push({ productId, name: product.name });
          continue; // Skip to the next item if stock is insufficient
        }
  
        // Calculate total for this item
        const total = product.price * quantity + shippingRow.shippingFee;
  
        // Prepare order data for bulk insertion
        orderData.push({
          total,
          productId: parseInt(productId),
          userId: parseInt(userId),
          payment_id: paymentId,
          shipping_id: shippingId,
          quantity: parseInt(quantity),
        });
  
        // Update product stock
        await prisma.product.update({
          where: { id: parseInt(productId) },
          data: { stock: product.stock - quantity },
        });
      }
  
      // Insert all orders at once
      if (orderData.length > 0) {
        await prisma.order.createMany({
          data: orderData,
        });
      }
  
      // Remove items from cart if they were successfully ordered
      if (orderData.length > 0) {
        const cartItemIds = cartItems.map((item) => item.id);
        await prisma.cart.deleteMany({
          where: {
            id: { in: cartItemIds },
            userId: parseInt(userId),
          },
        });
      }
  
      if (outOfStockItems.length) {
        return res.json({
          success: false,
          message: "Some items are out of stock",
          outOfStockItems,
          createdOrders: orderData,
        });
      }
  
      return res.json({
        success: true,
        message: "Order(s) created and cart items removed successfully",
        orders: orderData,
      });
    } catch (error) {
      return res.json({ error: error.message });
    }
  },
  
};
