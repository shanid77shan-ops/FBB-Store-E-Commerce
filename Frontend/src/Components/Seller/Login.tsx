import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

const SellerLogin = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      localStorage.setItem('sellerTestLogin', 'true');
      toast.success('Logged in successfully');
      setTimeout(() => {
        navigate('/seller/product');
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <Toaster position="top-right" richColors />
      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">FBB STORE</h1>
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">Seller Login</h2>
          <p className="mt-2 text-gray-600">Please sign in to your seller account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <p className="text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-lg p-3">
            Test mode is enabled. Click Sign in to continue without username or password.
          </p>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="flex items-center justify-between">
           <Link to="/seller/register"> Create an account</Link>
             
          
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerLogin;