import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const OrderOverviewTable = ({ orders }) => {
  const navigate = useNavigate();

  const handleDetailsClick = (id) => {
    navigate(`/order/${id}`); // Navigate to the order details page with the order ID
  };

  return (
    <div className='mt-4 mx-auto'>
      <TableContainer component={Paper}>
        <Table aria-label="order overview table">
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>shipping Status</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Shipping Fee</TableCell>
              <TableCell>Estimated Delivery</TableCell>
              <TableCell>Payment Type</TableCell>
              <TableCell>Details</TableCell> {/* New Details Column */}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(orders) && orders.map((order) => (
              <TableRow key={order.id}>
                {console.log(order)}
                <TableCell>{order.products ? order.products.name : 'N/A'}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>${order.total}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.shipping.city.name}</TableCell>
                <TableCell>{order.shipping.state}</TableCell>
                <TableCell>${order.shipping.shippingFee}</TableCell>
                <TableCell>{new Date(order.shipping.estimatedDelivery).toLocaleDateString()}</TableCell>
                <TableCell>{order.payments.paymentType}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleDetailsClick(order.id)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {(!Array.isArray(orders) || orders.length<1) && (
              <TableRow>
                <TableCell colSpan={10} className='flex items-center justify-center' >
                  <center>

                  No orders found. or something went wrong
                  </center>
                  </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default OrderOverviewTable;
