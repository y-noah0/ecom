import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useAuthContext } from "../Hooks/useAuthContext";
import Footer from "./Footer";

function SignUp() {
  const navigate = useNavigate();
  const { register, googleLogin, error: authError, clearError, isLoading, isAuthenticated } = useAuthContext();
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    password: ""
  });
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    return () => clearError();
  }, [isAuthenticated, navigate, clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    await register.mutateAsync(formData);
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

  const togglePasswordVisibility = () => setPasswordVisibility(!passwordVisibility);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
        <form
          onSubmit={handleSignup}
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
        >
          <h1 className="text-black text-4xl font-bold mb-4 text-center">
            Create an account
          </h1>
          <p className="text-999999 text-base font-normal mb-6 text-center">
            Enter your details below
          </p>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              className="border-b-2 border-999999 p-2 focus:border-black focus:outline-none"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              required
              className="border-b-2 border-999999 p-2 focus:border-black focus:outline-none"
              value={formData.email}
              onChange={handleChange}
            />
            <div className="relative w-full">
              <input
                type={passwordVisibility ? "text" : "password"}
                placeholder="Password"
                name="password"
                className="border-b-2 border-999999 p-2 focus:border-black focus:outline-none w-full"
                required
                value={formData.password}
                onChange={handleChange}
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
              className="w-full h-14 bg-B88E2F text-neutral-50 rounded-md flex items-center justify-center transition-shadow duration-300 cursor-pointer hover:bg-black"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Create Account"}
            </button>
            {authError && <p className="text-red-500 mt-4 text-center">{authError}</p>}
          </div>
          <div className="flex flex-col py-10">
            <div className="w-full h-14 bg-B88E2F text-neutral-50 rounded-md flex items-center justify-center transition-shadow duration-300 cursor-pointer hover:bg-black">
              <button
                className="flex items-center justify-center gap-4"
                type="button"
                onClick={handleGoogleSignin}
              >
                <FcGoogle size="24" />
                <span className="text-white">Sign up with Google</span>
              </button>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            <p className="text-gray-600">Already have an account?</p>
            <Link className="text-black underline" to="/signin">
              Log in
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default SignUp;
