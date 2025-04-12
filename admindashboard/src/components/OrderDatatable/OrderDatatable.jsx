import "./OrderDatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useOrder } from "../../hooks/orderHooks/useOrder";
import { format } from "date-fns";

const OrderDatatable = () => {
  const { orders, isLoading, error, deleteOrder } = useOrder();

  const handleDelete = (id) => {
    deleteOrder.mutate(id);
  };

  const orderColumns = [
    { 
      field: "_id", 
      headerName: "Order ID", 
      width: 220 
    },
    {
      field: "products",
      headerName: "Products",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="cellWithProducts">
            {params.row.products.map((product, index) => (
              <div key={product._id} className="productItem">
                {product.productId?.name || "Unknown Product"}
                <span className="productDetails">
                  {` (Qty: ${product.quantity})`}
                </span>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Date",
      width: 130,
      renderCell: (params) => format(new Date(params.row.createdAt), "MMM d, yyyy"),
    },
    {
      field: "totalPrice",
      headerName: "Total Amount",
      width: 130,
      renderCell: (params) => `$${params.row.totalPrice.toFixed(2)}`,
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      width: 130,
      renderCell: (params) => (
        <div className="cellWithPayment">
          {(params.row.paymentMethod || "Unknown").toUpperCase()}
        </div>
      ),
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      width: 130,
      renderCell: (params) => (
        <div className={`cellWithPayment ${params.row.paymentStatus}`}>
          {params.row.paymentStatus}
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Order Status",
      width: 130,
      renderCell: (params) => (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      ),
    },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/orders/${params.row._id}`} style={{ textDecoration: "none" }}>
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

  if (isLoading) return <div>Loading orders...</div>;
  if (error) return <div>Error loading orders: {error.message}</div>;

  const orderData = orders?.orders || [];
  const totalCount = orders?.count || 0;

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Orders List ({totalCount} total)
      </div>
      <DataGrid
        className="datagrid"
        rows={orderData}
        columns={orderColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row._id}
        onError={(error) => {
          console.error("DataGrid Error:", error);
        }}
        noRowsOverlayComponent={() => <div>No orders available</div>}
      />
    </div>
  );
};

export default OrderDatatable;