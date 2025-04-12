import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { format } from "date-fns";

const List = ({ orders = [] }) => {
  // Format date helper function
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="orders table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Order ID</TableCell>
            <TableCell className="tableCell">Products</TableCell>
            <TableCell className="tableCell">Date</TableCell>
            <TableCell className="tableCell">Total Amount</TableCell>
            <TableCell className="tableCell">Payment Method</TableCell>
            <TableCell className="tableCell">Payment Status</TableCell>
            <TableCell className="tableCell">Order Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="tableCell">{order._id}</TableCell>
                <TableCell className="tableCell">
                  <div className="cellWrapper">
                    {order.products.map((item, index) => (
                      <div key={item._id} className="productItem">
                        <span className="productName">
                          {item.productId?.name || "Unknown Product"}
                        </span>
                        {index < order.products.length - 1 && <span>, </span>}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="tableCell">{formatDate(order.createdAt)}</TableCell>
                <TableCell className="tableCell">${order.totalPrice.toFixed(2)}</TableCell>
                <TableCell className="tableCell">
                  {order.paymentMethod === "mobile_money" ? "Mobile Money" : 
                   order.paymentMethod === "PayOnDelivery" ? "Cash on Delivery" : 
                   "Card Payment"}
                </TableCell>
                <TableCell className="tableCell">
                  <span className={`paymentStatus ${order.paymentStatus}`}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="tableCell">
                  <span className={`status ${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">No orders found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;