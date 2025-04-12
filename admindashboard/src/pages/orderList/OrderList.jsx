import Navbar from "../../components/navbar/Navbar";
import OrderDatatable from "../../components/OrderDatatable/OrderDatatable";
import Sidebar from "../../components/sidebar/Sidebar";
import "./OrderList.scss";

const OrderList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <OrderDatatable />
      </div>
    </div>
  );
};

export default OrderList;