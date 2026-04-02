import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Home, Package, Truck, Clock, ChevronRight } from 'lucide-react';
import NavBar from '../Layouts/Navbar';
import Footer from '../Layouts/Footer';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { baseurl } from '../../Constant/Base';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    brand: string;
    images: {
      image1: string;
    };
  };
  quantity: number;
  price: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface Order {
  orderId: string;
  items: OrderItem[];
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = location.state || {};

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: baseurl,
  });

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      navigate('/orders');
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/order/${orderId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (response.data.success) {
        setOrder(response.data.order);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'processing': return 'text-blue-600';
      case 'shipped': return 'text-purple-600';
      case 'delivered': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center mt-[80px] pb-24">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center mt-[80px] pb-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
            <button
              onClick={() => navigate('/orders')}
              className="bg-black text-white hover:bg-gray-900 px-6 py-2 rounded-lg"
            >
              View All Orders
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <div className="h-[80px]"></div>
      
      <main className="flex-grow pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center text-sm text-gray-500 mb-8">
            <a href="/" className="hover:text-black transition-colors">Home</a>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-black font-medium">Order Confirmation</span>
          </nav>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 text-center border-b border-gray-100">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
              <p className="text-gray-600 mb-2">
                Thank you for your order. We've received your order and will begin processing it soon.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                <span className="font-medium">Order ID:</span>
                <span className="font-mono">{order.orderId}</span>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Package className="h-5 w-5 text-gray-600" />
                    <h3 className="font-medium text-gray-900">Order Status</h3>
                  </div>
                  <p className={`text-lg font-semibold capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.status === 'pending' ? 'Your order is being processed' :
                     order.status === 'processing' ? 'Preparing your order' :
                     order.status === 'shipped' ? 'On the way to you' :
                     'Delivered successfully'}
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <h3 className="font-medium text-gray-900">Order Date</h3>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Truck className="h-5 w-5 text-gray-600" />
                    <h3 className="font-medium text-gray-900">Payment</h3>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {order.paymentMethod === 'razorpay' ? 'Online Payment' : 'Cash on Delivery'}
                  </p>
                  <p className={`text-sm capitalize ${
                    order.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
                  } mt-1`}>
                    {order.paymentStatus}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Order Details</h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 flex-shrink-0">
                          <img
                            src={item.product.images.image1}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded"
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

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-gray-900 font-medium mb-2">
                      <span>Total Amount</span>
                      <span className="text-xl">₹{order.total}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                    <p className="text-gray-600 mt-1">{order.shippingAddress.street}</p>
                    <p className="text-gray-600">
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                    <p className="text-gray-600 mt-1">India</p>
                    <p className="text-gray-600 mt-1">Phone: {order.shippingAddress.phone}</p>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">What's Next?</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                          1
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Order Processing</p>
                          <p className="text-sm text-gray-600">We'll prepare your items for shipping</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                          2
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Shipping</p>
                          <p className="text-sm text-gray-600">Your order will be dispatched within 24 hours</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                          3
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Delivery</p>
                          <p className="text-sm text-gray-600">Expected delivery in 3-7 business days</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/orders')}
                  className="flex-1 bg-black text-white hover:bg-gray-900 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  View All Orders
                </button>
                <button
                  onClick={() => navigate('/shop')}
                  className="flex-1 bg-white text-black hover:bg-gray-50 border border-gray-300 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;