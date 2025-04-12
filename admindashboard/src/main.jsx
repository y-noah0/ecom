import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { DarkModeContextProvider } from "./context/darkModeContext.jsx";
import QueryProvider from "./provider/QueryClientProvider.jsx";
import { AuthContextProvider } from "./Context/authcontext/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryProvider>
    <AuthContextProvider>
      <DarkModeContextProvider>
        <App />
      </DarkModeContextProvider>
    </AuthContextProvider>
    </QueryProvider>
  </StrictMode>
);
