import { useState, useEffect } from "react";
import "./NewProduct.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useNavigate } from "react-router-dom";
import { productService, categoryService } from "../../services/apiService";

const NewProduct = () => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    variants: [{ color: "", size: "", quantity: "" }]
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (err) {
      setError("Failed to load categories");
      console.log(err);
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setFormData(prev => {
      const newVariants = [...prev.variants];
      newVariants[index] = {
        ...newVariants[index],
        [field]: value
      };
      return {
        ...prev,
        variants: newVariants
      };
    });
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { color: "", size: "", quantity: "" }]
    }));
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // Create preview URLs
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate variants data
      if (!formData.variants.every(v => v.color && v.size && v.quantity)) {
        setError("All variant fields are required");
        setLoading(false);
        return;
      }

      const submitFormData = new FormData();
      
      // Convert quantity to number in variants
      const processedVariants = formData.variants.map(v => ({
        ...v,
        quantity: Number(v.quantity)
      }));
      
      // Append basic fields
      submitFormData.append("name", formData.name);
      submitFormData.append("description", formData.description);
      submitFormData.append("price", Number(formData.price));
      submitFormData.append("categoryId", formData.categoryId);
      
      // Append variants as JSON string
      submitFormData.append("variants", JSON.stringify(processedVariants));
      
      // Append all images
      files.forEach(file => {
        submitFormData.append("images", file);
      });

      await productService.create(submitFormData);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Product</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <div className="images-preview">
              {previews.length > 0 ? (
                previews.map((preview, index) => (
                  <img key={index} src={preview} alt={`Preview ${index + 1}`} />
                ))
              ) : (
                <img
                  src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                  alt="no image"
                />
              )}
            </div>
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label htmlFor="file">
                  Images: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  accept="image/*"
                />
              </div>

              <div className="formInput">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInput}
                  required
                />
              </div>

              <div className="formInput">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInput}
                  required
                />
              </div>

              <div className="formInput">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  value={formData.price}
                  onChange={handleInput}
                  required
                />
              </div>

              <div className="formInput">
                <label>Category</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInput}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="variants-section">
                <h3>Variants</h3>
                {formData.variants.map((variant, index) => (
                  <div key={index} className="variant-group">
                    <div className="formInput">
                      <label>Color</label>
                      <input
                        type="text"
                        value={variant.color}
                        onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                        required
                      />
                    </div>
                    <div className="formInput">
                      <label>Size</label>
                      <input
                        type="text"
                        value={variant.size}
                        onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                        required
                      />
                    </div>
                    <div className="formInput">
                      <label>Quantity</label>
                      <input
                        type="number"
                        value={variant.quantity}
                        onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                        required
                      />
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="remove-variant"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addVariant} className="add-variant">
                  Add Variant
                </button>
              </div>

              {error && <div className="error">{error}</div>}
              
              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;