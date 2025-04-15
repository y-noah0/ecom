import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { QueryProvider } from "./components/QueryProvider";
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { AuthContextProvider } from "./context/authcontext/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
    <AuthContextProvider>
      <BrowserRouter>
        <QueryProvider>
          <App />
        </QueryProvider>
      </BrowserRouter>
      </AuthContextProvider>
    </ErrorBoundary>
  </React.StrictMode>
);