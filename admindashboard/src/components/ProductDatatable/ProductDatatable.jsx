import "./ProductDatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useProduct } from "../../context/productHook/useProduct";


const ProductDatatable = () => {
  // Use the custom hook to fetch products
  const { products, isLoading, error, deleteProduct } = useProduct();

  // Handle product deletion
  const handleDelete = (id) => {
    deleteProduct.mutate(id);
  };

  // Define columns for products
  const productColumns = [
    { field: "_id", headerName: "ID", width: 220 },
    {
      field: "name",
      headerName: "Product Name",
      width: 230,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            {params.row.images && params.row.images.length > 0 && (
              <img className="cellImg" src={params.row.images[0]} alt="product" />
            )}
            {params.row.name}
          </div>
        );
      },
    },
    { field: "price", headerName: "Price", width: 130 },
    { 
      field: "category", 
      headerName: "Category", 
      width: 130,
      renderCell: (params) => {
        // Handle different category data structures
        const category = params.row.category;
        
        // If category is null or undefined
        if (!category) return <div>N/A</div>;
        
        // If category is populated as an object
        if (typeof category === 'object') {
          return <div>{category.name || 'N/A'}</div>;
        }
        
        // If category is just an ID
        if (typeof category === 'string') {
          return <div>{category}</div>;
        }
        
        return <div>N/A</div>;
      }
    },
    { 
      field: "inStock", 
      headerName: "Stock Status", 
      width: 130,
      renderCell: (params) => {
        // Check if params and params.row exist
        if (!params || !params.row) return <div>N/A</div>;
        
        return (
          <div className={`cellWithStatus ${params.row.inStock ? "active" : "inactive"}`}>
            {params.row.inStock ? "In Stock" : "Out of Stock"}
          </div>
        );
      }
    },
    { 
      field: "rating", 
      headerName: "Rating", 
      width: 130,
      renderCell: (params) => {
        const rating = params.row?.rating ?? 0;
        const numReviews = params.row?.numReviews ?? 0;
        
        return (
          <div className="ratingCell">
            <div className="ratingValue">
              <span className="stars">
                {rating.toFixed(1)} ★
              </span>
              <span className="reviewCount">
                ({numReviews})
              </span>
            </div>
          </div>
        );
      }
    },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        // Check if params and params.row exist
        if (!params || !params.row) return <div>N/A</div>;
        
        return (
          <div className="cellAction">
            <Link to={`/products/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  // Display loading or error states
  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products: {error.message}</div>;
  
  // Ensure products is an array before passing to DataGrid
  const productData = Array.isArray(products) ? products : [];
  
  // Debug products data
  console.log("Products data:", productData);
  
  if (productData.length === 0) return <div>No products found</div>;

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Products List
        <Link to="/products/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={productData}
        columns={productColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row._id}
        // Add error handling
        onError={(error) => {
          console.error("DataGrid Error:", error);
        }}
        // Add empty row handling
        noRowsOverlayComponent={() => <div>No products available</div>}
      />
    </div>
  );
};

export default ProductDatatable;