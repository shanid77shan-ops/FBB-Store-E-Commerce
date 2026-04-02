<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle, ChevronRight, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { baseurl } from '../../Constant/Base';
import NavBar from '../Layouts/Navbar';
=======
import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { baseurl } from '../../Constant/Base';
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
import Footer from '../Layouts/Footer';
import { toast } from 'react-hot-toast';

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
}

interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: baseurl,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-gray-400" />;
      case 'processing': return <Package className="h-5 w-5 text-gray-400" />;
      case 'shipped': return <Truck className="h-5 w-5 text-gray-400" />;
      case 'delivered': return <CheckCircle className="h-5 w-5 text-gray-400" />;
      default: return <Package className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-800 text-gray-300';
      case 'processing': return 'bg-gray-800 text-gray-300';
      case 'shipped': return 'bg-gray-800 text-gray-300';
      case 'delivered': return 'bg-gray-800 text-gray-300';
      default: return 'bg-gray-800 text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
<<<<<<< HEAD
        <NavBar />
=======
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
        <div className="flex-grow flex items-center justify-center mt-[80px] pb-24">
          <div className="w-16 h-16 border-4 border-gray-800 border-t-white rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
<<<<<<< HEAD
      <NavBar />
=======

>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
      <div className="h-[80px]"></div>
      
      <main className="flex-grow pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center text-sm text-gray-400 mb-8">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="mx-2">/</span>
            <span className="font-medium">My Orders</span>
          </nav>

          <h1 className="text-3xl font-bold mb-8">My Orders</h1>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-24 w-24 text-gray-700 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
              <p className="text-gray-400 mb-8">You haven't placed any orders yet.</p>
              <button
                onClick={() => navigate('/shop')}
                className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-lg font-medium"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                  <div className="p-6 border-b border-gray-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">
                          Order #{order.orderId} • 
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">₹{order.total}</div>
                        <div className="text-sm text-gray-400 capitalize">
                          {order.paymentMethod === 'razorpay' ? 'Paid Online' : 'Cash on Delivery'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="w-20 h-20 flex-shrink-0">
                            <img
                              src={item.product.images.image1}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.product.name}</h4>
                            <p className="text-sm text-gray-400">{item.product.brand}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm text-gray-400">Qty: {item.quantity}</span>
                              <span className="font-medium">₹{item.price * item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between gap-4">
                      <div className="text-sm text-gray-400">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={() => navigate(`/order/${order.orderId}`)}
                          className="px-4 py-2 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          View Details
                        </button>
                        {order.status === 'delivered' && (
                          <button className="px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-lg transition-colors">
                            Buy Again
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrdersPage;