import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { userService } from '../Services/Api';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Footer from './Footer';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    try {
      setIsLoading(true);
      await userService.resetPassword(token, formData.password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const togglePasswordVisibility = () => setPasswordVisibility(!passwordVisibility);

  if (!token) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-red-500 text-xl text-center">Invalid reset link</h1>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-black text-4xl font-bold mb-4 text-center">
            Reset Password
          </h1>
          {success ? (
            <div className="text-green-500 text-center">
              Password reset successful! Redirecting to login...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type={passwordVisibility ? "text" : "password"}
                  name="password"
                  placeholder="New Password"
                  className="border-b-2 border-gray-300 p-2 focus:border-black focus:outline-none w-full"
                  value={formData.password}
                  onChange={handleChange}
                  required
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
              
              <div className="relative">
                <input
                  type={passwordVisibility ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  className="border-b-2 border-gray-300 p-2 focus:border-black focus:outline-none w-full"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-B88E2F text-white rounded-md hover:bg-black disabled:opacity-50"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResetPassword;