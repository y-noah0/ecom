import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { userService } from "../Services/Api";
import { toast } from "react-toastify";
import Footer from "./Footer";
import { FaUserCircle } from "react-icons/fa";

const MyAddress = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await userService.getProfile();
      setUserData(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch user data");
      setLoading(false);
    }
  };

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
              <span className="text-black">Address Book</span>
            </div>
          </div>
          <div className="text-sm">
            <p>Welcome! <span className="text-red-500">{userData?.name}</span></p>
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
              <h2 className="text-red-500 mb-2">
                <Link to="/my-address">My Address Book</Link>
              </h2>
              <h2 className="text-gray-400 mb-2">
                <Link to="/payment-options">My Payment Options</Link>
              </h2>
            </div>
            <div>
              <h1 className="text-lg font-bold mb-4">
                <Link to="/orders">My Orders</Link>
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
            {/* User Profile Section */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {userData?.profilePicture ? (
                    <img
                      src={userData.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/128";
                      }}
                    />
                  ) : (
                    <FaUserCircle className="w-full h-full text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">Profile Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="font-medium">{userData?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium">{userData?.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Phone</p>
                      <p className="font-medium">{userData?.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Account Created</p>
                      <p className="font-medium">
                        {new Date(userData?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Addresses Section */}
            <h2 className="text-2xl font-bold mb-6">My Addresses</h2>
            {!userData?.addresses?.length ? (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No addresses found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userData.addresses.map((address, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-lg mb-2">
                      Address {index + 1}
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <p>{address.street}</p>
                      <p>
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p>{address.country}</p>
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

export default MyAddress;