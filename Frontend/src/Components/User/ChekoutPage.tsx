import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Package, Shield, Lock, ChevronRight, MapPin, Home } from 'lucide-react';
import axios from 'axios';
import { baseurl } from '../../Constant/Base';
import NavBar from '../Layouts/Navbar';
import Footer from '../Layouts/Footer';
import { toast } from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Address {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    brand: string;
    priceINR: number;
    images: {
      image1: string;
    };
  };
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  price: number;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [tax, setTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [sameAsShipping, setSameAsShipping] = useState(true);
  
  const [shippingAddress, setShippingAddress] = useState<Address>({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    country: 'India',
    pincode: ''
  });
  
  const [billingAddress, setBillingAddress] = useState<Address>({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    country: 'India',
    pincode: ''
  });

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: baseurl,
  });

  useEffect(() => {
    fetchCartData();
    loadRazorpayScript();
  }, []);

  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress(shippingAddress);
    }
  }, [sameAsShipping, shippingAddress]);

  const loadRazorpayScript = () => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
    };
    document.body.appendChild(script);
  };

  const fetchCartData = async () => {
    try {
      const response = await api.get('/cart', {
        headers: token ? { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } : {}
      });
      
      if (response.data.success) {
        setCartItems(response.data.cart || []);
        const subtotal = response.data.cart.reduce((total: number, item: any) => {
          return total + (item.price * item.quantity);
        }, 0);
        const shipping = subtotal > 5000 ? 0 : 100;
        const tax = Math.round(subtotal * 0.18);
        const total = subtotal + shipping + tax;
        
        setCartTotal(subtotal);
        setShippingCost(shipping);
        setTax(tax);
        setGrandTotal(total);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'shipping' | 'billing') => {
    const { name, value } = e.target;
    if (type === 'shipping') {
      setShippingAddress(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setBillingAddress(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const requiredFields = ['name', 'phone', 'street', 'city', 'state', 'pincode'];
    
    for (const field of requiredFields) {
      if (!shippingAddress[field as keyof Address]) {
        toast.error(`Please fill in ${field} in shipping address`);
        return false;
      }
    }

    if (!sameAsShipping) {
      for (const field of requiredFields) {
        if (!billingAddress[field as keyof Address]) {
          toast.error(`Please fill in ${field} in billing address`);
          return false;
        }
      }
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    if (paymentMethod === 'razorpay' && !razorpayLoaded) {
      toast.error('Payment gateway is still loading. Please try again.');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        paymentMethod
      };

      const response = await api.post('/order/create', orderData, {
        headers: token ? { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } : {}
      });

      if (response.data.success) {
        if (paymentMethod === 'razorpay') {
          if (typeof window.Razorpay !== 'function') {
            throw new Error('Razorpay SDK not loaded');
          }

          const options = {
            key: "rzp_test_Rgm99jMXnxSkGK" || response.data.key_id,
            amount: response.data.razorpayOrder.amount,
            currency: response.data.razorpayOrder.currency,
            name: "Your Store Name",
            description: "Order Payment",
            order_id: response.data.razorpayOrder.id,
            handler: async (paymentResponse: any) => {
              try {
                const verifyResponse = await api.post('/payment/verify', {
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                  orderId: response.data.order.orderId
                }, {
                  headers: token ? { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  } : {}
                });

                if (verifyResponse.data.success) {
                  navigate('/order-success', { 
                    state: { orderId: response.data.order.orderId }
                  });
                } else {
                  toast.error('Payment verification failed');
                }
              } catch (error) {
                console.error('Error verifying payment:', error);
                toast.error('Payment verification failed');
              }
            },
            prefill: {
              name: shippingAddress.name,
              email: "customer@example.com",
              contact: shippingAddress.phone
            },
            theme: {
              color: "#000000"
            },
            modal: {
              ondismiss: () => {
                setLoading(false);
                toast.error('Payment cancelled');
              }
            }
          };

          const razorpay = new window.Razorpay(options);
          razorpay.open();
          
          razorpay.on('payment.failed', (response: any) => {
            console.error('Payment failed:', response);
            toast.error('Payment failed. Please try again.');
            setLoading(false);
          });

        } else if (paymentMethod === 'cod') {
          navigate('/order-success', { 
            state: { orderId: response.data.order.orderId }
          });
        }
      } else {
        toast.error(response.data.message || 'Failed to create order');
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
      
      if (error.message === 'Razorpay SDK not loaded') {
        toast.error('Payment gateway failed to load. Please refresh the page.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to place order');
      }
      
    } finally {
      if (paymentMethod === 'cod') {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <div className="h-[80px]"></div>
      
      <main className="flex-grow pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center text-sm text-gray-500 mb-8">
            <a href="/" className="hover:text-black transition-colors">Home</a>
            <ChevronRight className="h-4 w-4 mx-2" />
            <a href="/cart" className="hover:text-black transition-colors">Cart</a>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-black font-medium">Checkout</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={shippingAddress.name}
                        onChange={(e) => handleInputChange(e, 'shipping')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={(e) => handleInputChange(e, 'shipping')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={shippingAddress.street}
                      onChange={(e) => handleInputChange(e, 'shipping')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter street address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={(e) => handleInputChange(e, 'shipping')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={(e) => handleInputChange(e, 'shipping')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="State"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={shippingAddress.pincode}
                        onChange={(e) => handleInputChange(e, 'shipping')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Pincode"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={shippingAddress.country}
                      onChange={(e) => handleInputChange(e, 'shipping')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Billing Address
                  </h2>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm text-gray-600">Same as shipping address</span>
                  </label>
                </div>

                {!sameAsShipping && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={billingAddress.name}
                          onChange={(e) => handleInputChange(e, 'billing')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="Enter your full name"
                          required={!sameAsShipping}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={billingAddress.phone}
                          onChange={(e) => handleInputChange(e, 'billing')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="Enter your phone number"
                          required={!sameAsShipping}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={billingAddress.street}
                        onChange={(e) => handleInputChange(e, 'billing')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Enter street address"
                        required={!sameAsShipping}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={billingAddress.city}
                          onChange={(e) => handleInputChange(e, 'billing')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="City"
                          required={!sameAsShipping}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={billingAddress.state}
                          onChange={(e) => handleInputChange(e, 'billing')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="State"
                          required={!sameAsShipping}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={billingAddress.pincode}
                          onChange={(e) => handleInputChange(e, 'billing')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="Pincode"
                          required={!sameAsShipping}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </h2>
                
                {paymentMethod === 'razorpay' && !razorpayLoaded && (
                  <div className="text-sm text-yellow-600 mb-4">
                    Loading payment gateway...
                  </div>
                )}
                
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-black">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-black focus:ring-black"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Credit/Debit Card & UPI</div>
                      <div className="text-sm text-gray-600">Pay securely with Razorpay</div>
                    </div>
                    <Shield className="h-5 w-5 text-gray-400" />
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-black">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-black focus:ring-black"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Cash on Delivery</div>
                      <div className="text-sm text-gray-600">Pay when you receive your order</div>
                    </div>
                    <Package className="h-5 w-5 text-gray-400" />
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-[100px]">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={item.product.images.image1}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">{item.product.brand}</p>
                        {(item.selectedColor || item.selectedSize) && (
                          <div className="text-xs text-gray-500 mt-1">
                            {item.selectedColor && <span>Color: {item.selectedColor} </span>}
                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                          </div>
                        )}
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                          <span className="font-medium">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200">
                    <span>Total</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || (paymentMethod === 'razorpay' && !razorpayLoaded)}
                  className="w-full bg-black text-white hover:bg-gray-900 py-3 rounded-lg font-medium mt-6 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : paymentMethod === 'razorpay' ? (
                    <>
                      <Lock className="h-4 w-4" />
                      Proceed to Payment
                    </>
                  ) : (
                    'Place Order (COD)'
                  )}
                </button>

                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>By placing your order, you agree to our Terms of Service</p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <span>Secure SSL Encryption</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Truck className="h-4 w-4 text-gray-400" />
                    <span>Free shipping on orders above ₹5000</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span>Easy 30-day returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;