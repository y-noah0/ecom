import PropTypes from 'prop-types';
import { createContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth as useAuthHook } from '../Hooks/useAuth';
import SessionManager from '../utils/SessionManager';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const auth = useAuthHook();
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionExpired = () => {
      toast.error('Your session has expired. Please log in again.');
      navigate('/signin');
    };

    // Initialize session checks
    SessionManager.init(handleSessionExpired);

    // Cleanup on unmount
    return () => {
      SessionManager.cleanup();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
