import { createContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import SessionManager from "../../utils/SessionManager";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: SessionManager.getStoredUser(), // Initialize with stored user
    isAuthenticated: !!SessionManager.getStoredUser(),
    isLoading: false
  });

  // Remove the useEffect that was causing the loop
  // Only check token expiration
  useEffect(() => {
    if (state.user && SessionManager.isTokenExpiringSoon(state.user.token)) {
      toast.warning("Your session will expire soon");
    }
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};