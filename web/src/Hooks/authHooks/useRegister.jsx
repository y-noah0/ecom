import { useState, useContext } from 'react';
import { AuthContext } from '../../context/authcontext/AuthContext';
import { userService } from '../../Services/Api';
import { toast } from 'react-toastify';
import DataPersistenceManager from '../../utils/DataPersistenceManager';

export const useRegister = () => {
  const [registerError, setError] = useState(null);
  const [isRegisterLoading, setIsLoading] = useState(false);
  const { dispatch } = useContext(AuthContext);

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userService.register(userData);
      const userDataToStore = {
        ...response.data,
        token: response.data.token || response.headers?.authorization
      };

      localStorage.setItem('user', JSON.stringify(userDataToStore));
      await DataPersistenceManager.handleAuthStateChange(true);
      dispatch({ type: 'LOGIN', payload: userDataToStore });

      toast.success('Registration successful!');
      return { error: null };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { register, registerError, isRegisterLoading };
};