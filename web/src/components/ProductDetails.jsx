// src/components/ProductDetails.jsx
import { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { HiOutlineHeart, HiHeart } from "react-icons/hi";
import StarRatings from "react-star-ratings";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import Footer from "../components/Footer.jsx";
import { CartContext } from "../context/cart-context.jsx";
import CartSidebar from "../components/CartSidebar.jsx";
import { useWishlist } from "../context/wishlist-context";
import { useProduct } from "../Hooks/useProduct";

const ProductDetails = () => {
  const { productId } = useParams();
  const { useGetProduct } = useProduct();
  const { data: product, isLoading, error } = useGetProduct(productId);
  const [quantity, setQuantity] = useState(1);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { addToWishlist, removeFromWishlist, isItemInWishlist } = useWishlist();
  const {
    addToCart,
    cartItems,
    removeFromCart,
    removeItemFromCart,
    clearCart,
    getCartTotal,
  } = useContext(CartContext);

  if (isLoading) {
    return <div className="text-center p-8">Loading product details...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error.message}</div>;
  }

  if (!product) {
    return <div className="text-center p-8">Product not found</div>;
  }

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    setSidebarOpen(true);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleToggleWishlist = () => {
    if (isItemInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const inWishlist = isItemInWishlist(product._id);
  
  // Ensure we have images array before accessing it
  const productImages = Array.isArray(product.images) ? product.images : [];
  
  // Make sure we have a string for category and properly format tags
  const productCategory = typeof product.category === 'object' ? 
    (product.category.name || 'Uncategorized') : 
    (product.category || 'Uncategorized');
    
  const productTags = Array.isArray(product.tags) ? 
    product.tags.join(', ') : 
    (typeof product.tags === 'string' ? product.tags : '');

  return (
    <>
      <div className="container mx-auto p-6 bg-white rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={productImages[0] || '/placeholder-image.jpg'}
              alt={product.name}
              className="w-[420px] h-[500px] rounded-md bg-F9F1E7"
            />
            <div className="flex space-x-4 mt-4">
              {productImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index}`}
                  className="w-16 h-16 rounded-md shadow-md"
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <div>
                <p className="text-2xl font-semibold text-999999 mb-4">
                  ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                </p>
                <div className="flex items-center mb-4">
                  <StarRatings
                    rating={product.rating || 0}
                    starRatedColor="orange"
                    numberOfStars={5}
                    name="rating"
                    starDimension="24px"
                    starSpacing="2px"
                  />
                  <span className="ml-2 text-999999 text-sm">
                    ({product.numReviews || 0} Customer Reviews)
                  </span>
                </div>
              </div>
              <p className="text-black text-sm mb-4">{product.description}</p>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                <div className="product-quantity flex items-center bg-white rounded-md border border-gray-400 p-2 sm:p-0">
                  <button
                    onClick={decreaseQuantity}
                    className="text-black text-base px-3 py-1 rounded-md mr-2"
                  >
                    -
                  </button>
                  <span className="text-center w-12 text-base">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="text-black px-3 py-1 text-base rounded-md ml-2"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto px-4 py-2 text-black text-xl border border-black rounded-md hover:bg-gray-200"
                >
                  Add To Cart
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className="w-full sm:w-auto flex items-center justify-center space-x-1 px-4 py-2 text-black text-xl border border-black rounded-md hover:bg-gray-200"
                >
                  {inWishlist ? (
                    <HiHeart size="24" />
                  ) : (
                    <HiOutlineHeart size="24" />
                  )}
                  <span>{inWishlist ? "Remove" : "Add to Wishlist"}</span>
                </button>
              </div>
            </div>
            <hr />
            <div className="flex flex-col text-sm text-999999 gap-4">
              <div>SKU: {product.sku || 'N/A'}</div>
              <div>Category: {productCategory}</div>
              <div>Tags: {productTags}</div>
              <div className="flex items-center">
                Share:
                <a href="#" className="text-gray-600 hover:text-gray-900 ml-2">
                  <FaFacebook size="24" color="black" />
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 ml-2">
                  <FaLinkedin size="24" color="black" />
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 ml-2">
                  <FaSquareXTwitter size="24" color="black" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <hr className="my-8 w-full" />
        
        <div className="related-products">
          <h2 className="text-center text-black font-bold text-3xl mb-4">
            Related Products
          </h2>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-4">
            {/* We'll implement related products in the next iteration */}
          </section>
        </div>
      </div>
      
      <div className="flex justify-center mt-8 mb-4">
        <button className="bg-white text-B88E2F px-4 py-2 w-[245px] rounded-md border border-B88E2F">
          Show More
        </button>
      </div>
      
      <Footer />

      <CartSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        removeItemFromCart={removeItemFromCart}
        clearCart={clearCart}
        getCartTotal={getCartTotal}
      />
    </>
  );
};

export default ProductDetails;