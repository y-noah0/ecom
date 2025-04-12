import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from "../../services/apiService";
import Avatar from '@mui/material/Avatar';

const Datatable = () => {
  const queryClient = useQueryClient();
  
  // Fetch users
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  });

  const handleDelete = async (id) => {
    try {
      await deleteUserMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 230 },
    { 
      field: 'username', 
      headerName: 'Username', 
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <Avatar 
              src={params.row.profilePicture || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} 
              alt={params.row.username}
              className="cellImg"
            />
            <span>{params.row.username}</span>
          </div>
        );
      }
    },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'role', headerName: 'Role', width: 100 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/users/${params.row._id}`} style={{ textDecoration: "none" }}>
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
    }
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const rows = users?.data || [];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Manage Users
        <Link to="/users/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={rows}
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Datatable;