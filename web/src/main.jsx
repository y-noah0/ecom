import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/cart-context";
import { WishlistProvider } from "./context/wishlist-context.jsx";
import { AuthContextProvider } from "./context/auth-context.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <WishlistProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </WishlistProvider>
        </BrowserRouter>
    </React.StrictMode>
);
