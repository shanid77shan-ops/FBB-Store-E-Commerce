import { useEffect, useState } from 'react';
import { Search, Filter, Package, User, CreditCard, Truck, Calendar, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { baseurl } from '../../Constant/Base';
import axios from "axios";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface Seller {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface Product {
  _id: string;
  name: string;
  images: {
    image1?: string;
  };
}

interface OrderItem {
  _id: string;
  product: Product;
  seller: Seller;
  quantity: number;
  price: number;
  selectedColor?: string;
  selectedSize?: string;
  itemStatus: string;
  sellerStatus: string;
  createdAt: string;
}

interface Order {
  _id: string;
  orderId: string;
  user: Customer;
  items: OrderItem[];
  shippingAddress: {
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
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  cancellationReason?: string;
  refundAmount: number;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const api = axios.create({ baseURL: baseurl });

  const getOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/orders");
      if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.phone.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesPayment = filterPayment === 'all' || order.paymentStatus === filterPayment;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'pending':
        return 'bg-gray-100 text-gray-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'returned':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'refunded':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'razorpay':
        return <CreditCard className="w-4 h-4" />;
      case 'cod':
        return <Package className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };


  useEffect(() => {
    getOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
          <p className="text-gray-600 mt-1">View and manage all customer orders</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
          <div className="text-2xl font-bold text-gray-800">{orders.length}</div>
          <div className="text-sm text-gray-600 mt-1">Total Orders</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl">
          <div className="text-2xl font-bold text-gray-800">
            {orders.filter(o => o.status === 'delivered').length}
          </div>
          <div className="text-sm text-gray-600 mt-1">Delivered</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl">
          <div className="text-2xl font-bold text-gray-800">
            {orders.filter(o => o.status === 'pending' || o.status === 'processing').length}
          </div>
          <div className="text-sm text-gray-600 mt-1">In Progress</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl">
          <div className="text-2xl font-bold text-gray-800">
            ₹{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mt-1">Total Revenue</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="search"
                placeholder="Search orders by ID, customer name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                </select>
              </div>
              <select
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Payments</option>
                <option value="pending">Payment Pending</option>
                <option value="completed">Payment Completed</option>
                <option value="failed">Payment Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <div key={order._id} className="hover:bg-gray-50 transition-colors">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Package className="text-white" size={24} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-gray-800">Order #{order.orderId}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            {formatDate(order.createdAt)}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <User size={14} />
                            {order.user.name} • {order.user.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">₹{order.total.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{order.items.length} items</div>
                      </div>
                      <button
                        onClick={() => toggleOrderExpansion(order._id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {expandedOrder === order._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Order Details - Expanded View */}
                  {expandedOrder === order._id && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Customer & Shipping Details */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-4">Customer & Shipping Details</h4>
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <User size={16} className="text-gray-500" />
                                <span className="font-medium text-gray-700">Customer Information</span>
                              </div>
                              <div className="space-y-1 text-sm">
                                <div><span className="text-gray-600">Name:</span> {order.user.name}</div>
                                <div><span className="text-gray-600">Email:</span> {order.user.email}</div>
                                <div><span className="text-gray-600">Phone:</span> {order.user.phone}</div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <Truck size={16} className="text-gray-500" />
                                <span className="font-medium text-gray-700">Shipping Address</span>
                              </div>
                              <div className="space-y-1 text-sm">
                                <div>{order.shippingAddress.name}</div>
                                <div>{order.shippingAddress.street}</div>
                                <div>{order.shippingAddress.city}, {order.shippingAddress.state}</div>
                                <div>{order.shippingAddress.country} - {order.shippingAddress.pincode}</div>
                                <div>Phone: {order.shippingAddress.phone}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Payment & Order Summary */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-4">Payment & Order Summary</h4>
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <CreditCard size={16} className="text-gray-500" />
                                <span className="font-medium text-gray-700">Payment Details</span>
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Method:</span>
                                  <span className="flex items-center gap-1">
                                    {getPaymentMethodIcon(order.paymentMethod)}
                                    {order.paymentMethod.toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Status:</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs ${getPaymentStatusColor(order.paymentStatus)}`}>
                                    {order.paymentStatus.toUpperCase()}
                                  </span>
                                </div>
                                {order.razorpayPaymentId && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Payment ID:</span>
                                    <span className="font-mono text-xs">{order.razorpayPaymentId}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="font-medium text-gray-700 mb-3">Order Summary</div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Subtotal:</span>
                                  <span>₹{order.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Shipping:</span>
                                  <span>₹{order.shipping.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Tax:</span>
                                  <span>₹{order.tax.toLocaleString()}</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between font-semibold">
                                  <span>Total:</span>
                                  <span>₹{order.total.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-800 mb-4">Order Items ({order.items.length})</h4>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item._id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center space-x-4">
                                <img 
                                  src={item.product.images?.image1 || ''} 
                                  alt={item.product.name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNGOEY4RjgiLz48cGF0aCBkPSJNNDIgMjZDMjkuODUxIDI2IDIwIDM1Ljg1MSAyMCA0OEMyMCA2MC4xNDkgMjkuODUxIDcwIDQyIDcwQzU0LjE0OSA3MCA2NCA2MC4xNDkgNjQgNDhDNjQgMzUuODUxIDU0LjE0OSAyNiA0MiAyNlpNNDIgNTkuMzMzQzMzLjQyMiA1OS4zMzMgMjYuNDY3IDUyLjM3OCAyNi40NjcgNDRDMjYuNDY3IDM1LjYyMiAzMy40MjIgMjguNjY3IDQyIDI4LjY2N0M1MC41NzggMjguNjY3IDU3LjUzMyAzNS42MjIgNTcuNTMzIDQ0QzU3LjUzMyA1Mi4zNzggNTAuNTc4IDU5LjMzMyA0MiA1OS4zMzNaTTU1LjA2NyAyMy4zMzNMNTUuNzMxIDI0LjM3MUM1Ni40MjggMjUuNDY4IDU2LjgxNSAyNi43MyA1Ni44MTUgMjhDNjAuMTA5IDI4LjY4MiA2Mi41MzMgMzEuNzU2IDYyLjUzMyAzNS40NzdINUuNDY3QzUuNDY3IDMxLjc1NiA3Ljg5MSAyOC42ODIgMTEuMTg1IDI4QzExLjE4NSAyNi43MyAxMS41NzIgMjUuNDY4IDEyLjI2OSAyNC4zNzFMMTIuOTMzIDIzLjMzM0MxMi45MzMgMTkuNjEyIDE2LjAxIDExLjY2NyAyMiAxMC4xNjZDMjIgOC4wMSAyMy4wNjcgNCAzMiA0QzQwLjkzMyA0IDQyIDguMDEgNDIgMTAuMTY2QzQ3Ljk5IDExLjY2NyA1MS4wNjcgMTkuNjEyIDUxLjA2NyAyMy4zMzNaIiBmaWxsPSIjQ0RDREI4Ii8+PC9zdmc+';
                                  }}
                                />
                                <div>
                                  <div className="font-medium text-gray-800">{item.product.name}</div>
                                  <div className="text-sm text-gray-600">
                                    Qty: {item.quantity} × ₹{item.price} = ₹{(item.quantity * item.price).toLocaleString()}
                                  </div>
                                  {(item.selectedColor || item.selectedSize) && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      {item.selectedColor && `Color: ${item.selectedColor}`}
                                      {item.selectedColor && item.selectedSize && ' • '}
                                      {item.selectedSize && `Size: ${item.selectedSize}`}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <div className="font-medium text-gray-800">₹{(item.quantity * item.price).toLocaleString()}</div>
                                  <div className="text-xs text-gray-500">Seller: {item.seller.name}</div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(item.itemStatus)}`}>
                                      {item.itemStatus}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      Seller: {item.sellerStatus}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end space-x-3">
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          View Invoice
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Update Status
                        </button>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          Contact Customer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">No orders found</div>
              {(searchTerm || filterStatus !== 'all' || filterPayment !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                    setFilterPayment('all');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {currentOrders.length > 0 && (
          <div className="px-6 py-4 border-t">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;