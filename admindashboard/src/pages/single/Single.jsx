import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userService } from "../../services/apiService";
import { format } from "date-fns";

const Single = () => {
  const { userId } = useParams();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getById(userId),
    enabled: !!userId
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const userData = user?.data;
  const address = userData?.addresses?.[0]; // Get first address

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Information</h1>
            <div className="item">
              <img
                src={userData?.profilePicture || "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg"}
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{userData?.name || "N/A"}</h1>
                <div className="detailItem">
                  <span className="itemKey">Username:</span>
                  <span className="itemValue">{userData?.username || "N/A"}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{userData?.email || "N/A"}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{userData?.phone || "N/A"}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">
                    {address ? `${address.street}, ${address.city}, ${address.state}` : "N/A"}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Country:</span>
                  <span className="itemValue">{address?.country || "N/A"}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Zip Code:</span>
                  <span className="itemValue">{address?.zipCode || "N/A"}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Role:</span>
                  <span className="itemValue">{userData?.role || "N/A"}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Created:</span>
                  <span className="itemValue">
                    {userData?.createdAt ? format(new Date(userData.createdAt), 'dd/MM/yyyy HH:mm') : "N/A"}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Orders:</span>
                  <span className="itemValue">{userData?.orders?.length || 0} orders</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Last Transactions</h1>
          <List orders={userData?.orders || []}/>
        </div>
      </div>
    </div>
  );
};

export default Single;