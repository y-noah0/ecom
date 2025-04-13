import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/apiService";

const New = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: ""
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submitFormData = new FormData();
      
      // Handle basic user data
      const { address, ...userData } = formData;
      
      // Append basic user fields
      Object.keys(userData).forEach(key => {
        submitFormData.append(key, userData[key]);
      });

      // Append address as a stringified object
      submitFormData.append('address', JSON.stringify(address));

      // Append profile picture if exists
      if (file) {
        submitFormData.append('profilePicture', file);
      }

      const response = await userService.register(submitFormData);

      if (response.data) {
        navigate("/users");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
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
          <h1>Add New User</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={handleAdd}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                  accept="image/*"
                />
              </div>

              <div className="formInput">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  onChange={handleInput}
                  required
                />
              </div>

              <div className="formInput">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="johndoe"
                  onChange={handleInput}
                  required
                />
              </div>

              <div className="formInput">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  onChange={handleInput}
                  required
                />
              </div>

              <div className="formInput">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••"
                  onChange={handleInput}
                  required
                />
              </div>

              <div className="formInput">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="+1234567890"
                  onChange={handleInput}
                  required
                />
              </div>

              <h3>Address Information</h3>
              <div className="formInput">
                <label>Street</label>
                <input
                  type="text"
                  name="address.street"
                  placeholder="123 Main St"
                  onChange={handleInput}
                  required
                />
              </div>

              <div className="formInput">
                <label>City</label>
                <input
                  type="text"
                  name="address.city"
                  placeholder="New York"
                  onChange={handleInput}
                  required
                />
              </div>

              <div className="formInput">
                <label>State</label>
                <input
                  type="text"
                  name="address.state"
                  placeholder="NY"
                  onChange={handleInput}
                  required
                />
              </div>

              <div className="formInput">
                <label>Country</label>
                <input
                  type="text"
                  name="address.country"
                  placeholder="USA"
                  onChange={handleInput}
                  required
                />
              </div>

              <div className="formInput">
                <label>Zip Code</label>
                <input
                  type="text"
                  name="address.zipCode"
                  placeholder="10001"
                  onChange={handleInput}
                  required
                />
              </div>

              {error && <div className="error">{error}</div>}
              
              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;