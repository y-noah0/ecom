import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { userService } from "../Services/Api";
import { toast } from "react-toastify";
import Footer from "./Footer";
import { useAuthContext } from "../Hooks/authHooks/useAuthContext";


const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();// Add this line to get the authenticated user

    console.log("user from context",user);


  useEffect(() => {
    if (user) { // Only fetch if user is logged in
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders...'); // Debug log
      const response = await userService.getOrders();
      console.log('Orders response:', response); // Debug log

      if (response.data) {
        setOrders(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      console.log('Error response:', error.response); // Debug log
      toast.error(
        error.response?.data?.error || 
        "Failed to fetch orders. Please try again later."
      );
      setLoading(false);
    }
  };

  // Add this check for user authentication
  if (!user) {
    return <div className="text-center p-8">Please log in to view your orders</div>;
  }

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <>
      <div className="container mx-auto p-4">
        {/* Header Navigation */}
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="relative z-10 p-8 flex flex-col items-center">
            <div className="flex space-x-2 text-black">
              <Link to="/" className="hover:text-black">Home</Link>
              <IoIosArrowForward size="24" className="font-bold" />
              <Link to="/account" className="hover:text-black">Account</Link>
              <IoIosArrowForward size="24" className="font-bold" />
              <span className="text-black">My Orders</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-1/4 mb-8 lg:mb-0">
            <div className="mb-4">
              <h1 className="text-lg font-bold">
                <Link to="/account">Manage My Account</Link>
              </h1>
            </div>
            <div className="profile mb-8">
              <h2 className="text-gray-400 mb-2">
                <Link to="/account">My Profile</Link>
              </h2>
              <h2 className="text-gray-400 mb-2">
                <Link to="/address-book">Address Book</Link>
              </h2>
              <h2 className="text-gray-400 mb-2">
                <Link to="/payment-options">My Payment Options</Link>
              </h2>
            </div>
            <div>
              <h1 className="text-lg font-bold mb-4">
                <Link to="/orders" className="text-red-500">My Orders</Link>
              </h1>
              <div className="order">
                <h2 className="text-gray-400 mb-2">
                  <Link to="/returns">My Returns</Link>
                </h2>
                <h2 className="text-gray-400 mb-2">
                  <Link to="/cancellations">My Cancellations</Link>
                </h2>
                <h2 className="text-lg font-bold mt-4">
                  <Link to="/wishlist">My WishList</Link>
                </h2>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4 lg:pl-8">
            <h2 className="text-2xl font-bold mb-6">My Orders</h2>
            {orders.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No orders found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          Order #{order._id.slice(-6)}
                        </h3>
                        <p className="text-gray-600">
                          Placed on: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Total: ${order.totalPrice}</p>
                        <p className={`text-sm ${
                          order.status === 'filled' ? 'text-green-600' : 
                          order.status === 'canceled' ? 'text-red-600' : 
                          'text-yellow-600'
                        }`}>
                          Status: {order.status}
                        </p>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Items:</h4>
                      <div className="space-y-2">
                        {order.products.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <p>{item.productId.name} x {item.quantity}</p>
                            <p>${item.priceAtPurchase * item.quantity}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;