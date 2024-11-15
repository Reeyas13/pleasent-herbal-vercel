import prisma from "../prisma/prisma.js";

export default {
  getAllOrders: async (req, res) => {
    try {
      const orders = await prisma.order.findMany({
        include: {
          payments: true,
          shipping: true,
          products: true,
          user: true,
          payment: true,
        },
      });
      res.json(orders);
    } catch (err) {
      return res.status(400).json({ error: err?.message || "No Orders found" });
    }
  },
  edit: async (req, res) => {
    const { orderId } = req.params;
    // const { shippingAddress, shippingStatus } = req.body;
    const shippingAddress = req.body.shipping.address;
    const shippingStatus = req.body.status;
    
  
    try {
      // Find the order by ID and update with new data
      const updatedOrder = await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: {
          shipping: {
            update: {
              address: shippingAddress,
            },
          },
          status: shippingStatus,
        },
        include: {
          shipping: true, // Include the updated shipping info in the response
        },
      });

      res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ message: 'Failed to update order' });
    }
  }
  ,
  delete: async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await prisma.order.delete({
        where: {
          id: parseInt(orderId),
        },
      });
      return res.json(order);
    } catch (error) {
      return res.json({ error: error.message });
    }
  },
  
};
