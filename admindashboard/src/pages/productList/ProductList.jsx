import "./ProductList.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ProductDatatable from "../../components/ProductDatatable/ProductDatatable";


const ProductList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <ProductDatatable />
      </div>
    </div>
  );
};

export default ProductList;