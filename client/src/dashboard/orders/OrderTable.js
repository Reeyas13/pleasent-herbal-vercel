import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem } from '@mui/material';
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../axios"; // Adjust the path based on your file structure

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editData, setEditData] = useState({ shippingAddress: '', shippingStatus: '' });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/api/admin/order/');
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load orders data');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setEditData({
      shippingAddress: order.shipping?.address || '',
      shippingStatus: order.status || ''
    });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      await api.put(`/api/admin/order/${selectedOrder.id}`, {
        shipping: { address: editData.shippingAddress },
        status: editData.shippingStatus
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, shipping: { address: editData.shippingAddress }, status: editData.shippingStatus }
            : order
        )
      );
      handleModalClose();
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>{error}</div>;

  return (
    <DashboardLayout>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Order ID</th>
              <th className="border px-4 py-2">User</th>
              <th className="border px-4 py-2">Total</th>
              <th className="border px-4 py-2">Shipping Status</th>
              <th className="border px-4 py-2">Paid Amt</th>
              <th className="border px-4 py-2">Payment Type</th>
              <th className="border px-4 py-2">Shipping Address</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="border px-4 py-2">{order.id}</td>
                <td className="border px-4 py-2">{order.user.name}</td>
                <td className="border px-4 py-2">${order.total}</td>
                <td className="border px-4 py-2">{order.status}</td>
                <td className="border px-4 py-2">{order.payments.amountPaid || 'N/A'}</td>
                <td className="border px-4 py-2">{order.payments.paymentType}</td>
                <td className="border px-4 py-2">{order.shipping.address}</td>
                <td className="border px-4 py-2">
                  <button className="text-blue-500" onClick={() => handleViewClick(order)}>View</button>
                  <button className="text-red-500 ml-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for editing order details */}
      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>Edit Order</DialogTitle>
        <DialogContent>
          <TextField
            label="Shipping Address"
            name="shippingAddress"
            value={editData.shippingAddress}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Shipping Status"
            name="shippingStatus"
            value={editData.shippingStatus}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="PROCESSING">PROCESSING</MenuItem>
            <MenuItem value="SHIPPED">SHIPPED</MenuItem>
            <MenuItem value="DELIVERED">DELIVERED</MenuItem>
            <MenuItem value="CANCELLED">CANCELLED</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button onClick={handleSaveChanges} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default OrderTable;
