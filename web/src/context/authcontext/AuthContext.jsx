import { createContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import SessionManager from "../../utils/SessionManager";
import RateLimiter from "../../utils/RateLimiter";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = SessionManager.getStoredUser();
        if (user) {
          if (SessionManager.isTokenExpiringSoon(user.token)) {
            handleLogout();
            toast.error("Session expired. Please login again.");
          } else {
            dispatch({ type: "LOGIN", payload: user });
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initAuth();
    SessionManager.init(() => {
      handleLogout();
      toast.error("Session expired. Please login again.");
    });

    return () => SessionManager.cleanup();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    RateLimiter.resetAttempts("login");
  };

  return (
    <AuthContext.Provider value={{ ...state, dispatch, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};