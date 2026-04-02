import React, { useState } from "react";
import axios from "axios";
import { baseurl } from "../../Constant/Base";

interface ForgotPasswordModalProps {
  show: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ show, onClose }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  if (!show) return null;

  const resetForm = () => {
    setEmail("");
    setIsEmailSent(false);
    setIsLoading(false);
  };

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${baseurl}user/forgot-password`,
        { email },
        { withCredentials: true }
      );

      console.log("Reset link sent:", res.data);
      setIsEmailSent(true);
      alert("Reset link sent to your email!");
    } catch (error: any) {
      console.error("Forgot Password Error:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md p-4" style={{background: 'linear-gradient(135deg, rgba(20, 78, 140, 0.1), rgba(120, 205, 209, 0.1))'}}>
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-gray-100/50 overflow-hidden relative">
        
        <div className="absolute inset-0 opacity-5">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <defs>
              <radialGradient id="wave1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#78CDD1" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#78CDD1" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <path d="M0,200 Q100,150 200,200 T400,200 V400 H0 V200" fill="url(#wave1)">
              <animate attributeName="d" values="M0,200 Q100,150 200,200 T400,200 V400 H0 V200;M0,200 Q100,250 200,200 T400,200 V400 H0 V200;M0,200 Q100,150 200,200 T400,200 V400 H0 V200" dur="6s" repeatCount="indefinite"/>
            </path>
          </svg>
        </div>
        
        <div className="relative px-8 py-8" style={{ background: 'linear-gradient(135deg, #CFEAE3, #78CDD1)' }}>
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 rounded-full mr-4 flex items-center justify-center" style={{backgroundColor: '#144E8C'}}>
                  {!isEmailSent ? (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: '#144E8C' }}>
                    {isEmailSent ? 'Check Your Email' : 'Reset Password'}
                  </h2>
                  <p className="text-sm mt-1" style={{ color: '#144E8C', opacity: 0.8 }}>
                    {isEmailSent 
                      ? 'We\'ve sent recovery instructions' 
                      : 'Recover your account'
                    }
                  </p>
                </div>
              </div>
            </div>
            <button 
              onClick={handleModalClose}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{ backgroundColor: 'rgba(20, 78, 140, 0.1)' }}
            >
              <span className="text-2xl" style={{ color: '#144E8C' }}>×</span>
            </button>
          </div>
        </div>
        
        <div className="px-8 py-6">
          {!isEmailSent ? (
            <form onSubmit={handleSendResetLink} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#144E8C' }}>
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:outline-none focus:border-transparent transition-all duration-300 text-sm"
                    style={{ 
                      backgroundColor: '#CFEAE3',
                      color: '#144E8C',
                      boxShadow: 'inset 0 2px 4px rgba(20, 78, 140, 0.1)'
                    }}
                    placeholder="Enter your email address"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5" style={{ color: '#78C7A2' }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #144E8C, #78CDD1)' }}
              >
                <span className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                  Send Recovery Link
                </span>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <div className="relative">
                <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center relative" style={{ backgroundColor: '#CFEAE3' }}>
                  <svg className="w-8 h-8" style={{ color: '#144E8C' }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#78C7A2' }}>
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#144E8C' }}>Recovery Link Sent!</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#144E8C', opacity: 0.8 }}>
                  We've sent password recovery instructions to <span className="font-semibold" style={{ color: '#78C7A2' }}>{email}</span>. 
                  Check your inbox and follow the link to reset your password.
                </p>
              </div>
              <button
                onClick={handleModalClose}
                className="w-full py-4 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm"
                style={{ background: 'linear-gradient(135deg, #144E8C, #78CDD1)' }}
              >
                Return to Sign In
              </button>
            </div>
          )}
        </div>

        {!isEmailSent && (
          <div className="px-8 pb-6">
            <div className="text-center">
              <button 
                onClick={handleModalClose}
                className="text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{ color: '#78C7A2' }}
              >
                Back to Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;