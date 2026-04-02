import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';
import { X, ArrowRight, Mail, Lock, User, Phone } from 'lucide-react';
<<<<<<< HEAD
import { ClientId, baseurl } from "../../Constant/Base";

const API_BASE_URL = baseurl;
const GOOGLE_CLIENT_ID = ClientId;
=======
import {  baseurl } from "../../Constant/Base";

const API_BASE_URL = baseurl;
// const GOOGLE_CLIENT_ID = ClientId;
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    const deviceId = localStorage.getItem('deviceId');
    if (deviceId) {
      config.headers['device-id'] = deviceId;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

interface AuthModalProps {
  show: boolean;
  onClose: () => void;
  onRegisterSuccess?: (email: string) => void;
  onLoginSuccess?: (userData: any, token: string) => Promise<void>;
  onForgotPassword?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  show,
  onClose,
  onRegisterSuccess,
  onLoginSuccess,
  onForgotPassword
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  React.useEffect(() => {
    const initDeviceId = () => {
      let deviceId = localStorage.getItem('deviceId');
      if (!deviceId) {
        deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('deviceId', deviceId);
      }
    };
    initDeviceId();
  }, []);

  React.useEffect(() => {
    if (show) {
      const checkExistingSession = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await api.get('/verify-token');
            if (response.data.success) {
              onClose();
            }
          } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      };
      checkExistingSession();
    }
  }, [show]);

  if (!show) return null;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setRegEmail("");
    setPhone("");
    setRegPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    console.log("klkk")
    e.preventDefault();
    setError("");
    setSuccess("");

    if (regPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!username.trim()) {
      setError("Name is required");
      return;
    }
    if (!regEmail.trim() || !/\S+@\S+\.\S+/.test(regEmail)) {
      setError("Valid email is required");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError("Valid phone number is required");
      return;
    }
    setIsSubmitting(true);
    try {
        console.log("nazeehnahaban09@gmail.com")

      const response = await api.post('/register', {
        username: username.trim(),
        email: regEmail.trim().toLowerCase(),
        phone: phone.trim(),
        password: regPassword
      });

      console.log(response)
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        setSuccess("Registration successful! Please verify your email with OTP.");
        
        if (onRegisterSuccess) {
          onRegisterSuccess(regEmail);
        }
        
        if (onLoginSuccess) {
          await onLoginSuccess(response.data.user, response.data.token);
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Valid email is required");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setIsSubmitting(true);
    try {
        console.log("first")
      const response = await api.post('/login', { 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        setSuccess("Login successful!");
        
        if (onLoginSuccess) {
          await onLoginSuccess(response.data.user, response.data.token);
        }
        
        setTimeout(() => {
          resetForm();
          onClose();
        }, 1000);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError("");
    setSuccess("");
    
    try {
      const response = await api.post('/google-auth', { 
        credential: credentialResponse.credential 
      });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        setSuccess("Google authentication successful!");
        
        if (onLoginSuccess) {
          await onLoginSuccess(response.data.user, response.data.token);
        }
        
        setTimeout(() => {
          resetForm();
          onClose();
        }, 1000);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Google authentication failed";
      setError(errorMessage);
    }
  };

  const handleGoogleError = () => {
    setError("Google authentication failed. Please try again.");
  };

  const handleModalClose = () => {
    resetForm();
    setIsLogin(true);
    onClose();
  };

  const switchToLogin = () => {
    setIsLogin(true);
    resetForm();
  };

  const switchToRegister = () => {
    setIsLogin(false);
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(20, 78, 140, 0.15)', backdropFilter: 'blur(8px)' }}>
      <div className="relative w-full max-w-md">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ background: 'black' }}>
          
          <button 
            onClick={handleModalClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all hover:rotate-90"
            style={{ background: 'rgba(255, 255, 255, 0.2)' }}
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <div className="p-8">
            {error && (
              <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <p className="text-red-400">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                <p className="text-green-400">{success}</p>
              </div>
            )}

            <div className="flex gap-1 mb-8 p-1.5 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.15)' }}>
              <button
                onClick={switchToLogin}
                className="flex-1 py-2.5 text-sm font-bold rounded-xl transition-all"
                style={isLogin ? 
                  { background: 'rgba(255, 255, 255, 0.25)', color: '#fff', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' } : 
                  { color: 'rgba(255, 255, 255, 0.7)', background: 'transparent' }
                }
              >
                Login
              </button>
              <button
                onClick={switchToRegister}
                className="flex-1 py-2.5 text-sm font-bold rounded-xl transition-all"
                style={!isLogin ? 
                  { background: 'rgba(255, 255, 255, 0.25)', color: '#fff', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' } : 
                  { color: 'rgba(255, 255, 255, 0.7)', background: 'transparent' }
                }
              >
                Register
              </button>
            </div>

            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-white " />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 transition-all placeholder-white/50"
                    style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'white' }}
                    placeholder="Email"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-white " />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 transition-all placeholder-white/50"
                    style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff' }}
                    placeholder="Password"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                {onForgotPassword && (
                  <button 
                    type="button" 
                    onClick={onForgotPassword}
                    className="text-xs font-medium hover:underline"
                    style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    Forgot password?
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 text-white rounded-xl font-bold text-sm transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)' }}
                >
                  {isSubmitting ? 'Please wait...' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px" style={{ background: 'rgba(255, 255, 255, 0.2)' }}></div>
                  <span className="text-xs font-medium text-white opacity-70">or</span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255, 255, 255, 0.2)' }}></div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-1">
<<<<<<< HEAD
                    <GoogleLogin
                      clientId={GOOGLE_CLIENT_ID}
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      theme="light"
                      size="large"
                      width="100%"
                      text="signin_with"
                    />
=======
                  <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_blue"
                size="large"
                width="100%"
                text="signup_with"
              />
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-white opacity-70" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 placeholder-white/50"
                      style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff' }}
                      placeholder="Name"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 w-4 h-4 text-white opacity-70" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-12 pr-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 placeholder-white/50"
                      style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff' }}
                      placeholder="Phone"
                      required
                      disabled={isSubmitting}
                      maxLength={15}
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-white opacity-70" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 placeholder-white/50"
                    style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff' }}
                    placeholder="Email"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-4 h-4 text-white opacity-70" />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 placeholder-white/50"
                      style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff' }}
                      placeholder="Password"
                      required
                      disabled={isSubmitting}
                      minLength={6}
                    />
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-4 h-4 text-white opacity-70" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 placeholder-white/50"
                      style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff' }}
                      placeholder="Confirm"
                      required
                      disabled={isSubmitting}
                      minLength={6}
                    />
                  </div>
                </div>
                
                <div className="text-xs text-white/60">
                  <p>Password must be at least 6 characters long</p>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 text-white rounded-xl font-bold text-sm transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)' }}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px" style={{ background: 'rgba(255, 255, 255, 0.2)' }}></div>
                  <span className="text-xs font-medium text-white opacity-70">or</span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255, 255, 255, 0.2)' }}></div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-1">
<<<<<<< HEAD
                    <GoogleLogin
                      clientId={GOOGLE_CLIENT_ID}
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      theme="light"
                      size="large"
                      width="100%"
                      text="signup_with"
                    />
=======
                  <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_blue"
                  size="large"
                  width="100%"
                  text="signup_with"
                />

>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs text-white/60">Already have an account?</span>
                    <button
                      type="button"
                      onClick={switchToLogin}
                      className="text-xs font-bold text-white hover:underline"
                    >
                      Login here
                    </button>
                  </div>
                </div>
              </form>
            )}

            <p className="text-center text-xs mt-6 text-white opacity-60">
              By continuing, you agree to our Terms and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;