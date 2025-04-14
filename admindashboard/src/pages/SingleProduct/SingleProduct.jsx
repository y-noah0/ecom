import "./Single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useProduct } from "../../context/productHook/useProduct";

const SingleProduct = () => {
  const { productId } = useParams();
  const { useGetProduct, updateProduct } = useProduct();
  const { data: product, isLoading, error } = useGetProduct(productId);
  const [activeImage, setActiveImage] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // Initialize form data when product data loads
  useState(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
        inStock: product.inStock
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProduct.mutate({
      id: productId,
      productData: formData
    }, {
      onSuccess: () => setEditMode(false)
    });
  };

  if (isLoading) return <div className="single-product-loading">Loading product information...</div>;
  if (error) return <div className="single-product-error">Error: {error.message}</div>;
  if (!product) return <div className="single-product-not-found">Product not found</div>;

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <Link to="/products" className="backButton">Back to Products</Link>
            <div className="editButton" onClick={() => setEditMode(!editMode)}>
              {editMode ? "Cancel" : "Edit"}
            </div>
            <h1 className="title">Product Information</h1>
            <div className="item">
              {product.images && product.images.length > 0 && (
                <div className="productImages">
                  <img
                    src={product.images[activeImage]}
                    alt={product.name}
                    className="itemImg"
                  />
                  <div className="thumbnails">
                    {product.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Thumbnail ${index}`}
                        className={`thumbnail ${activeImage === index ? "active" : ""}`}
                        onClick={() => setActiveImage(index)}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {!editMode ? (
                <div className="details">
                  <h1 className="itemTitle">{product.name}</h1>
                  <div className="detailItem">
                    <span className="itemKey">Price:</span>
                    <span className="itemValue">${product.price?.toFixed(2)}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Description:</span>
                    <span className="itemValue">{product.description}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Category:</span>
                    <span className="itemValue">{product.category?.name || "N/A"}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Stock Status:</span>
                    <span className={`itemValue ${product.inStock ? "inStock" : "outOfStock"}`}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Rating:</span>
                    <span className="itemValue">{product.rating} / 5 ({product.numReviews} reviews)</span>
                  </div>
                  {product.tags && product.tags.length > 0 && (
                    <div className="detailItem">
                      <span className="itemKey">Tags:</span>
                      <div className="itemValue tags">
                        {product.tags.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.variants && product.variants.length > 0 && (
                    <div className="detailItem">
                      <span className="itemKey">Variants:</span>
                      <div className="variants">
                        {product.variants.map((variant, index) => (
                          <div key={index} className="variant">
                            {variant.color && <span>Color: {variant.color}</span>}
                            {variant.size && <span>Size: {variant.size}</span>}
                            {variant.quantity !== undefined && <span>Qty: {variant.quantity}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="editDetails">
                  <form onSubmit={handleSubmit}>
                    <div className="formItem">
                      <label>Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name || ''} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div className="formItem">
                      <label>Price</label>
                      <input 
                        type="number" 
                        name="price" 
                        value={formData.price || 0} 
                        onChange={handleChange} 
                        step="0.01" 
                        required 
                      />
                    </div>
                    <div className="formItem">
                      <label>Description</label>
                      <textarea 
                        name="description" 
                        value={formData.description || ''} 
                        onChange={handleChange} 
                        rows="5"
                      />
                    </div>
                    <div className="formItem checkbox">
                      <label>In Stock</label>
                      <input 
                        type="checkbox" 
                        name="inStock" 
                        checked={formData.inStock || false} 
                        onChange={handleChange} 
                      />
                    </div>
                    <button type="submit" className="saveButton">
                      {updateProduct.isLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
          <div className="right">
            <div className="productStats">
              <h2>Product Information</h2>
              <div className="statItem">
                <div className="statTitle">ID</div>
                <div className="statValue">{product._id}</div>
              </div>
              <div className="statItem">
                <div className="statTitle">Created</div>
                <div className="statValue">
                  {new Date(product.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="statItem">
                <div className="statTitle">Last Updated</div>
                <div className="statValue">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </div>
              </div>
              <div className="statItem">
                <div className="statTitle">Reviews</div>
                <div className="statValue">{product.reviews?.length || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;