import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { baseurl } from '../../Constant/Base';

interface OtpModalProps {
  show: boolean;
  onClose: () => void;
  email: string;
  onVerifySuccess?: () => void;
  onLoginSuccess?: (userData: any, token: string) => Promise<void>; // Add this prop
}

const api = axios.create({
  baseURL: baseurl,
});

const OtpModal: React.FC<OtpModalProps> = ({
  show,
  onClose,
  email,
  onVerifySuccess,
  onLoginSuccess
}) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  useEffect(() => {
    if (show) {
      setOtp(['', '', '', '', '', '']);
      setError('');
      setSuccess('');
      setIsVerified(false);
      setVerificationMessage('');
      setResendTimer(30);
    }
  }, [show]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  if (!show) return null;

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }
    
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split('');
      while (newOtp.length < 6) newOtp.push('');
      setOtp(newOtp);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/verify-otp', {
        email,
        otp: otpString
      });

      if (response.data.success) {
        setSuccess('Email verified successfully!');
        setIsVerified(true);
        setVerificationMessage(response.data.message || 'Your email has been verified.');

        // If token is returned, automatically log in the user
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          
          // Fetch user data if not included in response
          if (response.data.user) {
            localStorage.setItem('userData', JSON.stringify(response.data.user));
            if (onLoginSuccess) {
              await onLoginSuccess(response.data.user, response.data.token);
            }
          } else {
            // If user data not included, fetch it
            const userResponse = await api.get('/profile', {
              headers: { Authorization: `Bearer ${response.data.token}` }
            });
            
            if (userResponse.data.success) {
              localStorage.setItem('userData', JSON.stringify(userResponse.data.user));
              if (onLoginSuccess) {
                await onLoginSuccess(userResponse.data.user, response.data.token);
              }
            }
          }
        }

        if (onVerifySuccess) {
          setTimeout(() => {
            onVerifySuccess();
          }, 1500);
        }

        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Verification failed');
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      setError(error.response?.data?.message || 
               error.response?.data?.error || 
               'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setError('');
    setSuccess('');
    
    try {
      const response = await api.post('/resend-otp', { email });
      
      if (response.data.success) {
        setSuccess('New OTP sent to your email!');
        setResendTimer(30);
      } else {
        setError(response.data.message || 'Failed to resend OTP');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 
               error.response?.data?.error || 
               'Failed to resend OTP');
    }
  };

  const handleClose = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setSuccess('');
    setIsVerified(false);
    setVerificationMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" 
         style={{ background: 'rgba(20, 78, 140, 0.15)', backdropFilter: 'blur(8px)' }}>
      <div className="relative w-full max-w-md">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl" 
             style={{ background: 'black' }}>
          
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all hover:rotate-90"
            style={{ background: 'rgba(255, 255, 255, 0.2)' }}
            disabled={isSubmitting}
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <div className="p-8">
            {isVerified ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                     style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                  <CheckCircle className="w-12 h-12" style={{ color: '#22c55e' }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Verification Successful!</h3>
                <p className="text-white/70 mb-6">{verificationMessage}</p>
                <p className="text-white/60 text-sm">You are now logged in and will be redirected shortly...</p>
                <div className="mt-6">
                  <div className="w-12 h-1 mx-auto rounded-full" 
                       style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}></div>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                       style={{ background: 'rgba(255, 255, 255, 0.15)' }}>
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Verify Your Email</h3>
                  <p className="text-white/70 text-sm">
                    Enter the 6-digit code sent to<br />
                    <span className="font-semibold text-white">{email}</span>
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-xl text-sm" 
                       style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <p className="text-red-400">{error}</p>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-3 rounded-xl text-sm" 
                       style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                    <p className="text-green-400">{success}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <div className="flex justify-center gap-3 mb-4">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <input
                          key={index}
                          id={`otp-input-${index}`}
                          type="text"
                          inputMode="numeric"
                          value={otp[index]}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          maxLength={1}
                          className="w-12 h-14 text-center text-xl font-bold rounded-xl border-0 focus:outline-none focus:ring-2 transition-all"
                          style={{ 
                            background: 'rgba(255, 255, 255, 0.15)',
                            color: '#fff',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                          }}
                          autoFocus={index === 0}
                          disabled={isSubmitting}
                        />
                      ))}
                    </div>
                    <p className="text-center text-xs text-white/60 mt-4">
                      Didn't receive the code?{' '}
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendTimer > 0 || isSubmitting}
                        className={`font-bold ${resendTimer > 0 ? 'text-white/40' : 'text-white hover:underline'}`}
                      >
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                      </button>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 text-white rounded-xl font-bold text-sm transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)' }}
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-xs text-white/60">
                    By verifying, you agree to our Terms and Privacy Policy
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;