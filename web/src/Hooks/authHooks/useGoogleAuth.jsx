import { useState, useContext } from 'react';
import { AuthContext } from '../../context/authcontext/AuthContext';
import { userService } from '../../Services/Api';
import { toast } from 'react-toastify';
import DataPersistenceManager from '../../utils/DataPersistenceManager';

export const useGoogleAuth = () => {
  const [googleError, setError] = useState(null);
  const [isGoogleLoading, setIsLoading] = useState(false);
  const { dispatch } = useContext(AuthContext);

  const googleLogin = async (token) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userService.googleLogin(token);
      const userData = {
        ...response.data,
        token: response.data.token || response.headers?.authorization
      };

      localStorage.setItem('user', JSON.stringify(userData));
      await DataPersistenceManager.handleAuthStateChange(true);
      dispatch({ type: 'LOGIN', payload: userData });

      toast.success('Successfully logged in with Google');
      return { error: null };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Google login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { googleLogin, googleError, isGoogleLoading };
};