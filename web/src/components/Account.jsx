import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { useAuthContext } from "../Hooks/useAuthContext";
import Footer from "./Footer";

function Account() {
  const { profile, error: authError, isLoading, logout, updateProfile } = useAuthContext();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    newPassword: "",
    currentPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        address: profile.address || ""
      }));
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName.trim()) {
      alert("First name is required");
      return;
    }

    // Validate password change if attempting to change password
    if (formData.newPassword || formData.confirmNewPassword || formData.currentPassword) {
      if (formData.newPassword !== formData.confirmNewPassword) {
        alert("New passwords don't match");
        return;
      }
      if (!formData.currentPassword) {
        alert("Current password is required to change password");
        return;
      }
    }

    try {
      await updateProfile.mutateAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        ...(formData.newPassword && {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="relative z-10 p-8 flex flex-col items-center">
            <div className="flex space-x-2 text-black">
              <Link to="/" className="hover:text-black">Home</Link>
              <IoIosArrowForward size="24" className="font-bold" />
              <Link to="/account" className="hover:text-black">Account</Link>
            </div>
          </div>
          <div className="text-sm">
            <p>Welcome! <span className="text-red-500">{formData.firstName}</span></p>
          </div>
        </div>

        <div className="flex flex-wrap">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-1/4 mb-8 lg:mb-0">
            <div className="mb-4">
              <h1 className="text-lg font-bold">
                <Link to="/my-profile">Manage My Account</Link>
              </h1>
            </div>
            <div className="profile mb-8">
              <h2 className="text-red-500 mb-2">
                <Link to="/my-profile">My Profile</Link>
              </h2>
              <h2 className="text-gray-400 mb-2">
                <Link to="/address-book">My Address Book</Link>
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
            <h1 className="text-2xl text-red-500 mb-4">Edit Your Profile</h1>
            {authError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {authError}
              </div>
            )}
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="firstName"
                >
                  First Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  placeholder="Jane"
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="lastName"
                >
                  Last Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  placeholder="Doe"
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="janedoe@gmail.com"
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="address"
                >
                  Address
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  placeholder="Toronto, 2249, Canada"
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="currentPassword"
                >
                  Current Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id="currentPassword"
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  placeholder="Current Password"
                  onChange={handleInputChange}
                />
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="newPassword"
                >
                  New Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  placeholder="New Password"
                  onChange={handleInputChange}
                />
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="confirmNewPassword"
                >
                  Confirm New Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="confirmNewPassword"
                  type="password"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  placeholder="Confirm New Password"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={() => setFormData({
                    firstName: profile?.firstName || "",
                    lastName: profile?.lastName || "",
                    email: profile?.email || "",
                    address: profile?.address || "",
                    newPassword: "",
                    currentPassword: "",
                    confirmNewPassword: "",
                  })}
                  className="bg-B88E2F hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-B88E2F hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={logout}
                  disabled={isLoading}
                  className="bg-B88E2F hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto"
                >
                  {isLoading ? "Logging Out..." : "Log Out"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Account;
