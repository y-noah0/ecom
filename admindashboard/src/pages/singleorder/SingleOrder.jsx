// SingleOrder.jsx
import "./SingleOrder.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/apiService";

const SingleOrder = () => {
  const { orderId } = useParams();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderService.getById(orderId),
    enabled: !!orderId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const orderData = order?.data;

  // Move chartData after orderData initialization
  const chartData = {
    data: [
      { name: "Jan", Total: 1200 },
      { name: "Feb", Total: 1500 },
      { name: "Mar", Total: 800 },
      { name: "Apr", Total: 2000 },
      { name: "May", Total: 1700 },
      { name: "Jun", Total: orderData?.totalAmount || 1000 },
    ],
  };

  console.log("order data", orderData);

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Order Information</h1>
            <div className="item">
              <div className="details">
                <h1 className="itemTitle">Order #{orderData?._id || "N/A"}</h1>
                <div className="detailItem">
                  <span className="itemKey">Customer:</span>
                  <span className="itemValue">{orderData?.userId.name || "N/A"}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Status:</span>
                  <span className="itemValue">{orderData?.status || "Pending"}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Total Amount:</span>
                  <span className="itemValue">
                    ${orderData?.totalPrice?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Order Date:</span>
                  <span className="itemValue">
                    {orderData?.createdAt
                      ? new Date(orderData.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Shipping Address:</span>
                  <span className="itemValue">
                    {orderData?.shippingAddress
                      ? `${orderData.shippingAddress.street}, ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state}`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <Chart
              aspect={3 / 1}
              title="Order Spending (Last 6 Months)"
              data={chartData}
            />
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Order Items</h1>
          <table className="itemTable">
            <thead>
              <tr>
                <th>Product</th>
                <th>Details</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orderData?.products?.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="productCell">
                      <img 
                        src={item.productId?.images[0]} 
                        alt={item.productId?.name} 
                        className="productImage"
                      />
                      <span>{item.productId?.name || "N/A"}</span>
                    </div>
                  </td>
                  <td>
                    <div className="productDetails">
                      <span>Size: {item.size}</span>
                      <span>Color: {item.color}</span>
                    </div>
                  </td>
                  <td>${item.priceAtPurchase?.toFixed(2) || "0.00"}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.quantity * item.priceAtPurchase)?.toFixed(2) || "0.00"}</td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="5">No items found</td>
                </tr>
              )}
              <tr className="totalRow">
                <td colSpan="4" className="totalLabel">Total Amount:</td>
                <td>${orderData?.totalPrice?.toFixed(2) || "0.00"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SingleOrder;