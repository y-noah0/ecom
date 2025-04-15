import { useContext } from 'react';
import { AuthContext } from '../../context/authcontext/AuthContext';
import { useLogin } from './useLogin';
import { useLogout } from './useLogout';
import { useRegister } from './useRegister';
import { useGoogleAuth } from './useGoogleAuth';

export const useAuth = () => {
  const { user } = useContext(AuthContext);
  const { login, loginError, isLoginLoading } = useLogin();
  const { logout } = useLogout();
  const { register, registerError, isRegisterLoading } = useRegister();
  const { googleLogin, googleError, isGoogleLoading } = useGoogleAuth();

  return {
    user,
    login,
    logout,
    register,
    googleLogin,
    isLoading: isLoginLoading || isRegisterLoading || isGoogleLoading,
    error: loginError || registerError || googleError,
  };
};