import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, MapPin, CreditCard, Download, Printer, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { baseurl } from '../../Constant/Base';
import NavBar from '../Layouts/Navbar';
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
  selectedColor?: string;
  selectedSize?: string;
}

interface Order {
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  billingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
}

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: baseurl,
  });

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-6 w-6 text-gray-400" />;
      case 'processing': return <Package className="h-6 w-6 text-gray-400" />;
      case 'shipped': return <Truck className="h-6 w-6 text-gray-400" />;
      case 'delivered': return <CheckCircle className="h-6 w-6 text-gray-400" />;
      default: return <Package className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Order Placed';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending': return 'Your order has been received and is being processed.';
      case 'processing': return 'We are preparing your items for shipping.';
      case 'shipped': return 'Your order is on the way to you.';
      case 'delivered': return 'Your order has been delivered successfully.';
      default: return '';
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <NavBar />
        <div className="flex-grow flex items-center justify-center mt-[80px] pb-24">
          <div className="w-16 h-16 border-4 border-gray-800 border-t-white rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white">
        <NavBar />
        <div className="flex-grow flex flex-col items-center justify-center mt-[80px] pb-24">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <button
            onClick={() => navigate('/orders')}
            className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-lg"
          >
            Back to Orders
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <NavBar />
      <div className="h-[80px]"></div>
      
      <main className="flex-grow pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/orders')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Orders
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={handlePrintInvoice}
                className="flex items-center gap-2 px-4 py-2 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Printer className="h-4 w-4" />
                Print Invoice
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden mb-8">
            <div className="p-8 border-b border-gray-800">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <h1 className="text-2xl font-bold">{getStatusText(order.status)}</h1>
                      <p className="text-gray-400">{getStatusDescription(order.status)}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div>
                      <span className="font-medium">Order ID:</span> {order.orderId}
                    </div>
                    <div>
                      <span className="font-medium">Order Date:</span> 
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    {order.trackingNumber && (
                      <div>
                        <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg lg:w-80">
                  <h3 className="font-bold mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal</span>
                      <span>₹{order.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shipping</span>
                      <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tax</span>
                      <span>₹{order.tax}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-700">
                      <span>Total</span>
                      <span>₹{order.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </h3>
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <p className="font-medium mb-2">{order.shippingAddress.name}</p>
                    <p className="text-gray-400 mt-1">{order.shippingAddress.street}</p>
                    <p className="text-gray-400">
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </p>
                    <p className="text-gray-400">
                      {order.shippingAddress.country} - {order.shippingAddress.pincode}
                    </p>
                    <p className="text-gray-400 mt-2">Phone: {order.shippingAddress.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </h3>
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium">Payment Method</span>
                      <span className="capitalize">
                        {order.paymentMethod === 'razorpay' ? 'Credit/Debit Card & UPI' : 'Cash on Delivery'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Payment Status</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.paymentStatus === 'completed' 
                          ? 'bg-gray-800 text-gray-300' 
                          : 'bg-gray-800 text-gray-300'
                      } capitalize`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-bold mb-6">Order Items</h3>
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 font-medium">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>
                  
                  {order.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 last:border-0">
                      <div className="col-span-6">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 flex-shrink-0">
                            <img
                              src={item.product.images.image1}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{item.product.name}</h4>
                            <p className="text-sm text-gray-400">{item.product.brand}</p>
                            {(item.selectedColor || item.selectedSize) && (
                              <div className="text-xs text-gray-500 mt-1">
                                {item.selectedColor && <span>Color: {item.selectedColor} </span>}
                                {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center justify-center">
                        {item.quantity}
                      </div>
                      <div className="col-span-2 flex items-center justify-center">
                        ₹{item.price}
                      </div>
                      <div className="col-span-2 flex items-center justify-end font-medium">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {order.notes && (
                <div className="mt-8 p-6 bg-gray-800 rounded-lg">
                  <h4 className="font-medium mb-2">Order Notes</h4>
                  <p className="text-gray-400">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetails;
