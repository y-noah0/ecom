import { useState, useContext } from 'react';
import { AuthContext } from '../../context/authcontext/AuthContext';
import { userService } from '../../Services/Api';
import { toast } from 'react-toastify';
import DataPersistenceManager from '../../utils/DataPersistenceManager';

export const useLogin = () => {
  const [loginError, setError] = useState(null);
  const [isLoginLoading, setIsLoading] = useState(false);
  const { dispatch } = useContext(AuthContext);

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userService.login(credentials);
      const userData = {
        ...response.data,
        token: response.data.token || response.headers?.authorization
      };

      localStorage.setItem('user', JSON.stringify(userData));
      await DataPersistenceManager.handleAuthStateChange(true);
      dispatch({ type: 'LOGIN', payload: userData });
      
      toast.success('Successfully logged in');
      return { error: null };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { login, loginError, isLoginLoading };
};
