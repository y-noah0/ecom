import { useContext } from 'react';
import { AuthContext } from '../../context/authcontext/AuthContext';
import { toast } from 'react-toastify';
import DataPersistenceManager from '../../utils/DataPersistenceManager';

export const useLogout = () => {
  const { dispatch } = useContext(AuthContext);

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    DataPersistenceManager.clearGuestData();
    toast.success('Successfully logged out');
  };

  return { logout };
};