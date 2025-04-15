import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./components/HomePage";
import AllProducts from "./components/AllProducts";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Contact from "./components/Contact";
import NotFound from "./components/NotFound";
import WishList from "./components/WishList";
import Signup from "./components/Signup";
import SignIn from "./components/SignIn";
import About from "./components/About";
import Account from "./components/Account";
import Header from "./components/Header";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ResetPassword from "./components/ResetPassword";
import EmailVerification from "./components/EmailVerification";
import MyAddress from "./components/MyAddress";
import MyOrders from "./components/MyOrders";

import { CartProvider } from "./context/cart-context";
import { WishlistProvider } from "./context/wishlist-context";

function App() {
  return (

      <WishlistProvider>
        <CartProvider>
          <ToastContainer />
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<AllProducts />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Protected Routes */}
            <Route path="/account" element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/wishlist" element={
              <ProtectedRoute>
                <WishList />
              </ProtectedRoute>
            } />
            <Route path="/address-book" element={
              <ProtectedRoute>
                <MyAddress />
              </ProtectedRoute>
            } />
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </WishlistProvider>
  );
}
export default App;