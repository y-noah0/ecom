import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./styles/dark.scss";
import { useContext } from "react";
import PropTypes from "prop-types";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./Context/authcontext/AuthContext";
import SingleProduct from "./pages/SingleProduct/SingleProduct";
import ProductList from "./pages/productList/ProductList";
import OrderList from "./pages/orderList/OrderList";
import SingleOrder from "./pages/singleorder/SingleOrder";


const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const { user } = useContext(AuthContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            {/* Public Routes */}
            <Route path="login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="register" element={!user ? <Register /> : <Navigate to="/" />} />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />

            {/* Users Routes */}
            <Route path="users">
              <Route index element={
                <ProtectedRoute>
                  <List />
                </ProtectedRoute>
              } />
              <Route path=":userId" element={
                <ProtectedRoute>
                  <Single />
                </ProtectedRoute>
              } />
              <Route path="new" element={
                <ProtectedRoute>
                  <New inputs={userInputs} title="Add New User" />
                </ProtectedRoute>
              } />
            </Route>

            {/* Products Routes */}
            <Route path="products">
              <Route index element={
                <ProtectedRoute>
                  <ProductList />
                </ProtectedRoute>
              } />
              <Route path=":productId" element={
                <ProtectedRoute>
                  <SingleProduct />
                </ProtectedRoute>
              } />
              <Route path="new" element={
                <ProtectedRoute>
                  <New inputs={productInputs} title="Add New Product" />
                </ProtectedRoute>
              } />
            </Route>

            {/* Orders Routes */}
            <Route path="orders">
              <Route index element={
                <ProtectedRoute>
                  <OrderList />
                </ProtectedRoute>
              } />
              <Route path=":orderId" element={
                <ProtectedRoute>
                  <SingleOrder />
                </ProtectedRoute>
              } />
              <Route path="new" element={
                <ProtectedRoute>
                  <New inputs={[]} title="Add New Order" />
                </ProtectedRoute>
              } />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;