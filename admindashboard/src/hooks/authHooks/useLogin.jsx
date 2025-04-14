import { useContext, useState } from "react";
import { AuthContext } from "../../context/authcontext/AuthContext";
import { userService } from "../../services/apiService";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useContext(AuthContext);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userService.login({ email, password });
      const userData = response.data;

      // Add token to user data if not present
      const userToStore = {
        ...userData,
        token: userData.token || response.headers?.authorization
      };

      // Save user data in local storage with consistent key
      localStorage.setItem("user", JSON.stringify(userToStore));

      // Dispatch login action
      dispatch({ type: "LOGIN", payload: userToStore });

      setIsLoading(false);
      return { error: null };
    } catch (err) {
      console.error("Login error:", err.response?.data?.error || err.message);
      setError(err.response?.data?.error || "Email or password are incorrect");
      setIsLoading(false);
      return { error: err.response?.data?.error || "Email or password are incorrect" };
    }
  };

  return { login, error, isLoading };
};
