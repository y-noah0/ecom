import PropTypes from 'prop-types';
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCartContext } from "../Hooks/useCartContext";

const CartSidebar = ({ isOpen, toggleSidebar }) => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCartContext();

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">Your cart is empty</p>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-250px)]">
              {cartItems.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center gap-4 border-b py-4"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-gray-600">${item.product.price}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="px-2 py-1 border rounded"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="px-2 py-1 border rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-bold">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="space-y-2">
                <Link
                  to="/cart"
                  className="block w-full py-2 px-4 text-center bg-B88E2F text-white rounded hover:bg-opacity-90"
                  onClick={toggleSidebar}
                >
                  View Cart
                </Link>
                <Link
                  to="/checkout"
                  className="block w-full py-2 px-4 text-center border border-B88E2F text-B88E2F rounded hover:bg-gray-50"
                  onClick={toggleSidebar}
                >
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

CartSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired
};

export default CartSidebar;
