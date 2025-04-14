import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { userService } from '../Services/Api';
import { toast } from 'react-toastify';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus('invalid');
        return;
      }

      try {
        await userService.verifyEmail(token);
        setVerificationStatus('success');
        toast.success('Email verified successfully!');
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      } catch (error) {
        setVerificationStatus('error');
        toast.error(error.message || 'Verification failed');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  const renderMessage = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-B88E2F mb-4"></div>
            <p>Verifying your email...</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Email Verified!</h2>
            <p>Your email has been successfully verified.</p>
            <p className="mt-2">Redirecting to login page...</p>
          </div>
        );
      case 'error':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Verification Failed</h2>
            <p>Sorry, we couldn&apos;t verify your email.</p>
            <button
              onClick={() => navigate('/signin')}
              className="mt-4 bg-B88E2F text-white px-6 py-2 rounded hover:bg-opacity-90"
            >
              Go to Login
            </button>
          </div>
        );
      case 'invalid':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Link</h2>
            <p>This verification link is invalid or has expired.</p>
            <button
              onClick={() => navigate('/signin')}
              className="mt-4 bg-B88E2F text-white px-6 py-2 rounded hover:bg-opacity-90"
            >
              Go to Login
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Email Verification</h1>
        {renderMessage()}
      </div>
    </div>
  );
};

export default EmailVerification;