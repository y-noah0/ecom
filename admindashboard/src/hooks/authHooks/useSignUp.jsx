import { useContext, useState } from "react";
import { AuthContext } from "../../Context/authcontext/AuthContext";
import { userService } from "../../services/apiService";

export const useSignUp = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useContext(AuthContext);

  const signup = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userService.register(userData);
      const responseData = response.data;

      // Add token to user data if not present
      const userToStore = {
        ...responseData,
        token: responseData.token || response.headers?.authorization
      };

      // Save user data in local storage using consistent key
      localStorage.setItem("user", JSON.stringify(userToStore));

      // Dispatch login action
      dispatch({ type: "LOGIN", payload: userToStore });

      setIsLoading(false);
      return { error: null };
    } catch (err) {
      // Handle error from the backend
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Registration failed";
      console.error("Sign-up error:", errorMessage);
      setError(errorMessage);
      setIsLoading(false);
      return { error: errorMessage };
    }
  };

  return { signup, error, isLoading };
};