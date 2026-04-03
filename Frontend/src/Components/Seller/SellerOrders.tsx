import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { 
  Package, Truck, CheckCircle, XCircle, Clock, 
  Search, Download, Eye, 
  Menu, X, LogOut, Phone,
  BarChart3, ShoppingBag, TrendingUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { baseurl } from '../../Constant/Base';
import { useGetToken } from '../../Token/getToken';

interface User {
  name?: string;
  email?: string;
  phone?: string;
}

interface Product {
  name?: string;
  brand?: string;
  images?: {
    image1: string;
  };
}

interface ShippingAddress {
  name?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  phone?: string;
}

interface SellerOrder {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  trackingNumber?: string;
  shippedAt?: string;
}

interface OrderItem {
  product?: Product;
  quantity: number;
  price: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface Order {
  orderId: string;
  user?: User;
  items: OrderItem[];
  total: number;
  status: string;
  orderDate: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress?: ShippingAddress;
  sellerOrder?: SellerOrder;
}

const SellerOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const api = axios.create({
    baseURL: baseurl,
  });

  const token = useGetToken("sellerToken");

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      toast.error('Authentication required');
      navigate('/seller/login');
    }
  }, [statusFilter]);

  const fetchOrders = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get('/seller/orders', {
        params: { 
          status: statusFilter === 'all' ? null : statusFilter,
          search: searchQuery || null
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error(error.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateItemStatus = async (
    orderId: string, 
    itemId: string | null, 
    status: string, 
    trackingNumber: string = ''
  ): Promise<void> => {
    try {
      setUpdatingStatus(true);
      await api.post('/seller/orders/update-status', {
        orderId,
        itemId,
        status,
        trackingNumber
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Status updated successfully');
      fetchOrders();
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder(prev => prev ? {...prev, status} : null);
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTotalItems = (order: Order): number => {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setStatusFilter(e.target.value);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      fetchOrders();
    }
  };

  const handleMarkAsShipped = (orderId: string): void => {
    const trackingNumber = prompt('Enter tracking number:');
    if (trackingNumber && trackingNumber.trim()) {
      updateItemStatus(orderId, null, 'shipped', trackingNumber.trim());
    } else if (trackingNumber !== null) {
      toast.error('Please enter a valid tracking number');
    }
  };

  const handleExportOrders = (): void => {
    toast.success('Export feature coming soon!');
  };

  const handleLogout = (): void => {
    localStorage.removeItem('sellerToken');
    navigate('/seller/login');
  };

  const toggleSidebar = (): void => setSidebarOpen(!sidebarOpen);

  const Sidebar = () => (
    <aside className="w-full bg-white h-full flex flex-col">
      <div className="p-6 flex-1">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">FBB STORE</h1>
          <p className="text-sm text-gray-500 mt-1">Seller Dashboard</p>
        </div>
        
        <nav className="space-y-1">
          <button 
            onClick={() => navigate('/seller/dashboard')}
            className="w-full text-left py-3 px-4 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center space-x-3"
          >
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => navigate('/seller/products')}
            className="w-full text-left py-3 px-4 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center space-x-3"
          >
            <Package size={20} />
            <span>Products</span>
          </button>
          <button 
            onClick={() => navigate('/seller/orders')}
            className="w-full text-left py-3 px-4 rounded-lg bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition-all flex items-center space-x-3"
          >
            <ShoppingBag size={20} />
            <span>Orders</span>
          </button>
          <button 
            onClick={() => navigate('/seller/sales-report')}
            className="w-full text-left py-3 px-4 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center space-x-3"
          >
            <TrendingUp size={20} />
            <span>Sales Report</span>
          </button>
        </nav>
      </div>
      
      <div className="p-6 border-t border-gray-200 space-y-3">
        <button
          onClick={() => window.open(`https://wa.me/7012551507`, '_blank')}
          className="w-full py-3 px-4 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-all flex items-center justify-center space-x-2"
        >
          <Phone size={20} />
          <span>Contact Admin</span>
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-all flex items-center justify-center space-x-2"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className={`fixed lg:relative inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex justify-between items-center p-4 lg:hidden">
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
            <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100">
              <X size={24} />
            </button>
          </div>
          <Sidebar />
        </div>

        <main className="flex-1 p-4 lg:p-8">
          <div className="mb-6 flex items-center justify-between lg:justify-end">
            <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 lg:hidden">Orders</h1>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 hidden lg:block">Orders</h1>
            <p className="text-gray-600 mt-2 hidden lg:block">Manage your product orders and shipments</p>
          </div>

          <div className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div></div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearch}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent w-48"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <button
                onClick={handleExportOrders}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Export Orders"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {orders.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600">No orders match your current filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.orderId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{order.orderId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900">{order.user?.name || 'Guest'}</div>
                            <div className="text-sm text-gray-500">{order.user?.email || 'No email'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-400" />
                            <span>{getTotalItems(order)} items</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">₹{order.total}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)} capitalize`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.orderDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            
                            {order.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateItemStatus(order.orderId, null, 'accepted')}
                                  disabled={updatingStatus}
                                  className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50"
                                  title="Accept Order"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => updateItemStatus(order.orderId, null, 'cancelled')}
                                  disabled={updatingStatus}
                                  className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                                  title="Reject Order"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            
                            {order.status === 'accepted' && (
                              <button
                                onClick={() => updateItemStatus(order.orderId, null, 'processing')}
                                disabled={updatingStatus}
                                className="p-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                                title="Start Processing"
                              >
                                <Clock className="h-4 w-4" />
                              </button>
                            )}
                            
                            {order.status === 'processing' && (
                              <button
                                onClick={() => handleMarkAsShipped(order.orderId)}
                                disabled={updatingStatus}
                                className="p-1 text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                                title="Mark as Shipped"
                              >
                                <Truck className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selectedOrder && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedOrder(null);
              }}
            >
              <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Order ID</h3>
                        <p className="font-medium">{selectedOrder.orderId}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
                        <p className="font-medium">{formatDate(selectedOrder.orderDate)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                        <p className="font-medium">{selectedOrder.user?.name || 'Guest'}</p>
                        <p className="text-sm text-gray-500">{selectedOrder.user?.phone || 'No phone'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Payment</h3>
                        <p className="font-medium capitalize">{selectedOrder.paymentMethod}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${selectedOrder.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {selectedOrder.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Items</h3>
                      <div className="space-y-3">
                        {selectedOrder.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <img
                              src={item.product?.images?.image1 || 'https://via.placeholder.com/64'}
                              alt={item.product?.name || 'Product'}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/64';
                              }}
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{item.product?.name || 'Unnamed Product'}</h4>
                              <p className="text-sm text-gray-600">{item.product?.brand || 'No brand'}</p>
                              <div className="flex gap-4 text-sm text-gray-500 mt-1">
                                <span>Qty: {item.quantity}</span>
                                {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                                {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</div>
                              <div className="text-xs text-gray-500">₹{item.price.toLocaleString()} each</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping Address</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="font-medium">{selectedOrder.shippingAddress?.name || 'No name'}</p>
                          <p className="text-gray-600">{selectedOrder.shippingAddress?.street || 'No street'}</p>
                          <p className="text-gray-600">
                            {selectedOrder.shippingAddress?.city || 'City'}, 
                            {selectedOrder.shippingAddress?.state || 'State'} - 
                            {selectedOrder.shippingAddress?.pincode || 'Pincode'}
                          </p>
                          <p className="text-gray-600">{selectedOrder.shippingAddress?.country || 'Country'}</p>
                          <p className="text-gray-600 mt-2">Phone: {selectedOrder.shippingAddress?.phone || 'No phone'}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Order Summary</h3>
                        <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">₹{selectedOrder.sellerOrder?.subtotal?.toLocaleString() || '0'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium">₹{selectedOrder.sellerOrder?.shipping?.toLocaleString() || '0'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax</span>
                            <span className="font-medium">₹{selectedOrder.sellerOrder?.tax?.toLocaleString() || '0'}</span>
                          </div>
                          <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
                            <span className="font-bold text-lg">Total</span>
                            <span className="font-bold text-lg">₹{selectedOrder.sellerOrder?.total?.toLocaleString() || '0'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedOrder.sellerOrder?.trackingNumber && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium text-blue-900 mb-2">Shipping Information</h3>
                        <p className="text-blue-800">
                          Tracking Number: {selectedOrder.sellerOrder.trackingNumber}
                        </p>
                        {selectedOrder.sellerOrder.shippedAt && (
                          <p className="text-blue-800 text-sm">
                            Shipped on: {formatDate(selectedOrder.sellerOrder.shippedAt)}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Close
                      </button>
                      {selectedOrder.status === 'pending' && (
                        <button
                          onClick={() => {
                            updateItemStatus(selectedOrder.orderId, null, 'accepted');
                            setSelectedOrder(null);
                          }}
                          disabled={updatingStatus}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                        >
                          {updatingStatus ? 'Processing...' : 'Accept Order'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SellerOrders;
