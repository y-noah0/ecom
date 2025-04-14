import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useAuthContext } from "../Hooks/useAuthContext";
import { userService } from "../Services/Api";
import Footer from "./Footer";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin, error: authError, clearError, isLoading, isAuthenticated } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      // Navigate to the return path if it exists, otherwise go to home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
    return () => clearError();
  }, [isAuthenticated, navigate, location, clearError]);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login.mutateAsync({ email, password });
  };

  const handleGoogleSignin = async () => {
    try {
      const { google } = window;
      if (!google) {
        console.error('Google SDK not loaded');
        return;
      }

      const auth2 = await google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: async (response) => {
          if (response.access_token) {
            await googleLogin.mutateAsync(response.access_token);
          }
        },
      });

      auth2.requestAccessToken();
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email address");
      return;
    }
    try {
      await userService.forgotPassword(email);
      setResetEmailSent(true);
    } catch (error) {
      console.error('Failed to send reset email:', error);
    }
  };

  const togglePasswordVisibility = () => setPasswordVisibility(!passwordVisibility);

  if (isForgotPassword) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-black text-4xl font-bold mb-4 text-center">
              Reset Password
            </h1>
            <p className="text-gray-600 text-base font-normal mb-6 text-center">
              {resetEmailSent 
                ? "Check your email for reset instructions" 
                : "Enter your email to reset your password"}
            </p>
            {!resetEmailSent && (
              <form onSubmit={handleForgotPassword}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="border-b-2 border-gray-300 p-2 focus:border-black focus:outline-none w-full mb-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="w-full h-14 bg-B88E2F text-white rounded-md hover:bg-black"
                  type="submit"
                >
                  Send Reset Instructions
                </button>
              </form>
            )}
            <button
              className="mt-4 text-gray-600 hover:text-black"
              onClick={() => setIsForgotPassword(false)}
            >
              Back to Login
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
        >
          <h1 className="text-black text-4xl font-bold mb-4 text-center">
            Log In
          </h1>
          <p className="text-gray-600 text-base font-normal mb-6 text-center">
            Enter your credentials below
          </p>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              id="emailOrNumber"
              name="emailOrNumber"
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|\d+"
              placeholder="Enter email or number"
              required
              className="border-b-2 border-gray-300 p-2 focus:border-black focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative w-full">
              <input
                type={passwordVisibility ? "text" : "password"}
                placeholder="Password"
                id="passWordBox"
                className="border-b-2 border-gray-300 p-2 focus:border-black focus:outline-none w-full"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {passwordVisibility ? (
                  <FaRegEyeSlash size="20" />
                ) : (
                  <FaRegEye size="20" />
                )}
              </span>
            </div>
          </div>
          <div className="mt-6">
            <button
              className="w-full h-14 bg-B88E2F text-neutral-50 rounded-md flex items-center justify-center transition-shadow duration-300 cursor-pointer hover:bg-black-lg hover:bg-black"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
            {authError && <p className="text-red-500 mt-4 text-center">{authError}</p>}
          </div>
          <div className="flex flex-col py-10">
            <div className="w-full h-14 bg-B88E2F rounded-md flex items-center justify-center transition-shadow duration-300 cursor-pointer hover:bg-black-lg hover:bg-black">
              <button
                className="flex items-center justify-center gap-4"
                type="button"
                onClick={handleGoogleSignin}
              >
                <FcGoogle size="20" />
                <span className="text-white">Log in with Google</span>
              </button>
            </div>
          </div>
          <div className="mt-10">
            <button
              onClick={() => setIsForgotPassword(true)}
              className="text-red-500 hover:text-red-700"
            >
              Forgot Password?
            </button>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            <p className="text-gray-600">Don&apos;t have an account?</p>
            <Link className="text-black underline" to="/signup">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Login;
