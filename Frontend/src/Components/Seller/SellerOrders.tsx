import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { 
<<<<<<< HEAD
  Package, Truck, CheckCircle, XCircle, Clock, 
  Search, Download, Eye, 
  Menu, X, LogOut, Phone,
  BarChart3, ShoppingBag, TrendingUp, DollarSign
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
=======
  Package, 
  Search, Download, Eye, Filter, ChevronDown, RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { SellerLayout } from '../Layouts/SellerLayout';
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
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
<<<<<<< HEAD
}

interface OrderItem {
=======
  sellerStatus: string;
}

interface OrderItem {
  _id: string;
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
  product?: Product;
  quantity: number;
  price: number;
  selectedColor?: string;
  selectedSize?: string;
<<<<<<< HEAD
}

interface Order {
=======
  itemStatus: string;
  trackingNumber?: string;
  returnStatus?: string;
  returnReason?: string;
  sellerStatus?: string;
}

interface Order {
  createdAt: string;
  tax: any;
  subtotal: any;
  shipping: any;
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
  orderId: string;
  user?: User;
  items: OrderItem[];
  total: number;
<<<<<<< HEAD
  status: string;
  orderDate: string;
=======
  orderStatus: string;
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress?: ShippingAddress;
  sellerOrder?: SellerOrder;
<<<<<<< HEAD
=======
  sellerStatus: string;
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
}

const SellerOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
<<<<<<< HEAD
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const navigate = useNavigate();
=======
  const [sortBy, setSortBy] = useState<string>('newest');
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [showTrackingModal, setShowTrackingModal] = useState<boolean>(false);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<string>('');
  const [returnStatusModal, setReturnStatusModal] = useState<boolean>(false);
  const [selectedItemForReturn, setSelectedItemForReturn] = useState<{orderId: string, itemId: string}>({orderId: '', itemId: ''});
  const [returnAction, setReturnAction] = useState<string>('');
  const [returnReason, setReturnReason] = useState<string>('');

>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
  const api = axios.create({
    baseURL: baseurl,
  });

  const token = useGetToken("sellerToken");

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      toast.error('Authentication required');
<<<<<<< HEAD
      navigate('/seller/login');
    }
  }, [statusFilter]);
=======
    }
  }, [statusFilter, sortBy]);
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae

  const fetchOrders = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get('/seller/orders', {
        params: { 
          status: statusFilter === 'all' ? null : statusFilter,
<<<<<<< HEAD
          search: searchQuery || null
=======
          search: searchQuery || null,
          sortBy,
          sortOrder: 'desc'
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
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

<<<<<<< HEAD
  const updateItemStatus = async (
    orderId: string, 
    itemId: string | null, 
=======
  const updateOrderStatus = async (
    orderId: string, 
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
    status: string, 
    trackingNumber: string = ''
  ): Promise<void> => {
    try {
<<<<<<< HEAD
      setUpdatingStatus(true);
      await api.post('/seller/orders/update-status', {
        orderId,
        itemId,
=======
      const order = orders.find(o => o.orderId === orderId);
      if (order && order.paymentStatus !== 'completed') {
        toast.error('Cannot update order status. Payment is still pending.');
        return;
      }

      setUpdatingStatus(true);
      await api.post('/seller/orders/update-status', {
        orderId,
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
        status,
        trackingNumber
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
<<<<<<< HEAD
      toast.success('Status updated successfully');
      fetchOrders();
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder(prev => prev ? {...prev, status} : null);
      }
=======
      toast.success('Order status updated successfully');
      fetchOrders();
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder(prev => prev ? {...prev, sellerStatus: status} : null);
      }
      setShowTrackingModal(false);
      setTrackingNumber('');
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

<<<<<<< HEAD
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
=======
  const updateReturnStatus = async (): Promise<void> => {
    try {
      if (!returnAction) {
        toast.error('Please select an action');
        return;
      }

      const order = orders.find(o => o.orderId === selectedItemForReturn.orderId);
      if (order && order.paymentStatus !== 'completed') {
        toast.error('Cannot process return. Payment is still pending.');
        return;
      }

      setUpdatingStatus(true);
      await api.post('/seller/orders/update-return-status', {
        orderId: selectedItemForReturn.orderId,
        itemId: selectedItemForReturn.itemId,
        status: returnAction,
        reason: returnReason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Return status updated successfully');
      fetchOrders();
      setReturnStatusModal(false);
      setReturnAction('');
      setReturnReason('');
      if (selectedOrder && selectedOrder.orderId === selectedItemForReturn.orderId) {
        const updatedItems = selectedOrder.items.map(item => 
          item._id === selectedItemForReturn.itemId 
            ? {...item, returnStatus: returnAction, returnReason} 
            : item
        );
        setSelectedOrder({...selectedOrder, items: updatedItems});
      }
    } catch (error: any) {
      console.error('Error updating return status:', error);
      toast.error(error.response?.data?.message || 'Failed to update return status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'requested': return 'bg-orange-100 text-orange-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'picked_up': return 'bg-purple-100 text-purple-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
<<<<<<< HEAD
      year: 'numeric'
=======
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
    });
  };

  const getTotalItems = (order: Order): number => {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setStatusFilter(e.target.value);
  };

<<<<<<< HEAD
=======
  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSortBy(e.target.value);
  };

>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      fetchOrders();
    }
  };

  const handleMarkAsShipped = (orderId: string): void => {
<<<<<<< HEAD
    const trackingNumber = prompt('Enter tracking number:');
    if (trackingNumber && trackingNumber.trim()) {
      updateItemStatus(orderId, null, 'shipped', trackingNumber.trim());
    } else if (trackingNumber !== null) {
      toast.error('Please enter a valid tracking number');
    }
=======
    const order = orders.find(o => o.orderId === orderId);
    if (order && order.paymentStatus !== 'completed') {
      toast.error('Cannot ship order. Payment is still pending.');
      return;
    }
    setSelectedOrderForTracking(orderId);
    setShowTrackingModal(true);
  };

  const handleReturnAction = (orderId: string, itemId: string): void => {
    const order = orders.find(o => o.orderId === orderId);
    if (order && order.paymentStatus !== 'completed') {
      toast.error('Cannot process return. Payment is still pending.');
      return;
    }
    setSelectedItemForReturn({orderId, itemId});
    setReturnStatusModal(true);
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
  };

  const handleExportOrders = (): void => {
    toast.success('Export feature coming soon!');
  };

<<<<<<< HEAD
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
=======
  const handleSubmitTracking = (): void => {
    if (!trackingNumber.trim()) {
      toast.error('Please enter a valid tracking number');
      return;
    }
    updateOrderStatus(selectedOrderForTracking, 'shipped', trackingNumber);
  };

  const getStatusOptions = (currentStatus: string, hasReturnRequest: boolean = false) => {
    if (hasReturnRequest) {
      return ['approved', 'rejected'];
    }
    
    const statusFlow = {
      'pending': ['processing'],
      'processing': ['shipped', 'cancelled'],
      'shipped': ['delivered'],
      'delivered': [],
      'cancelled': [],
      'requested': [],
      'approved': [],
      'rejected': [],
      'picked_up': [],
      'refunded': []
    };
    
    return statusFlow[currentStatus as keyof typeof statusFlow] || [];
  };

  const getReturnOptions = (currentStatus: string) => {
    const returnFlow = {
      'requested': ['approved', 'rejected'],
      'approved': ['picked_up'],
      'picked_up': ['refunded'],
      'rejected': [],
      'refunded': []
    };
    
    return returnFlow[currentStatus as keyof typeof returnFlow] || [];
  };

  const hasReturnRequest = (order: Order): boolean => {
    return order.items.some(item => item.returnStatus === 'requested');
  };

  return (
    <SellerLayout 
      activePage="orders"
      title="Orders"
      subtitle="Manage your product orders and shipments"
    >
      <div className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearch}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent w-64"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="requested">Return Requested</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="total_high">Amount: High to Low</option>
              <option value="total_low">Amount: Low to High</option>
            </select>
          </div>
          
          <button
            onClick={handleExportOrders}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            title="Export Orders"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
        
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && orders.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
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
                    Payment
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
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.sellerStatus)} capitalize`}>
                        {order.sellerStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.paymentStatus === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      } capitalize`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
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
                        
                        {order.paymentStatus === 'completed' && (
                          <div className="relative group">
                            <button
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="Update Status"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                            <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                              {getStatusOptions(order.sellerStatus, hasReturnRequest(order)).map((status) => (
                                <button
                                  key={status}
                                  onClick={() => {
                                    if (status === 'shipped') {
                                      handleMarkAsShipped(order.orderId);
                                    } else {
                                      updateOrderStatus(order.orderId, status);
                                    }
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 capitalize"
                                >
                                  {hasReturnRequest(order) ? status === 'approved' ? 'Accept Return' : 'Reject Return' : `Mark as ${status}`}
                                </button>
                              ))}
                            </div>
                          </div>
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

      {showTrackingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add Tracking Information</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter tracking number"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowTrackingModal(false);
                    setTrackingNumber('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitTracking}
                  disabled={updatingStatus}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {updatingStatus ? 'Processing...' : 'Mark as Shipped'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {returnStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Update Return Status</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action
                </label>
                <select
                  value={returnAction}
                  onChange={(e) => setReturnAction(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Select Action</option>
                  <option value="approved">Approve Return</option>
                  <option value="rejected">Reject Return</option>
                  <option value="picked_up">Mark as Picked Up</option>
                  <option value="refunded">Mark as Refunded</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter reason for approval/rejection"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setReturnStatusModal(false);
                    setReturnAction('');
                    setReturnReason('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={updateReturnStatus}
                  disabled={updatingStatus || !returnAction}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {updatingStatus ? 'Processing...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedOrder(null);
          }}
        >
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                  <p className="text-sm text-gray-500 mt-1">{selectedOrder.orderId}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Order Status</h3>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.sellerStatus)} capitalize`}>
                      {selectedOrder.sellerStatus}
                    </span>
                    {selectedOrder.paymentStatus === 'completed' && (
                      <div className="relative group">
                        <button
                          className="text-blue-600 text-sm font-medium"
                          disabled={updatingStatus}
                        >
                          Update Status
                        </button>
                        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          {getStatusOptions(selectedOrder.sellerStatus, hasReturnRequest(selectedOrder)).map((status) => (
                            <button
                              key={status}
                              onClick={() => {
                                if (status === 'shipped') {
                                  setSelectedOrder(null);
                                  handleMarkAsShipped(selectedOrder.orderId);
                                } else {
                                  updateOrderStatus(selectedOrder.orderId, status);
                                  setSelectedOrder(null);
                                }
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 capitalize"
                            >
                              {hasReturnRequest(selectedOrder) ? status === 'approved' ? 'Accept Return' : 'Reject Return' : `Mark as ${status}`}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Status</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedOrder.paymentStatus === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Order Date</h3>
                  <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{selectedOrder.user?.name || 'Guest'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedOrder.user?.email || 'No email'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{selectedOrder.user?.phone || 'No phone'}</p>
                    </div>
                  </div>
                </div>

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
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
                    <span className="text-sm text-gray-500">{getTotalItems(selectedOrder)} items</span>
                  </div>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.product?.images?.image1 || 'https://via.placeholder.com/64'}
                          alt={item.product?.name || 'Product'}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product?.name || 'Unnamed Product'}</h4>
                          <p className="text-sm text-gray-600">{item.product?.brand || 'No brand'}</p>
                          <div className="flex gap-4 text-sm text-gray-500 mt-1">
                            <span>Qty: {item.quantity}</span>
                            {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                          </div>
                          <div className="flex gap-2 mt-2">
                            {item.trackingNumber && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Tracking: {item.trackingNumber}
                              </span>
                            )}
                            {item.returnStatus && (
                              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(item.returnStatus)}`}>
                                Return: {item.returnStatus}
                              </span>
                            )}
                          </div>
                          {item.returnStatus && item.returnReason && (
                            <p className="text-xs text-gray-500 mt-1">Reason: {item.returnReason}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</div>
                          <div className="text-xs text-gray-500">₹{item.price.toLocaleString()} each</div>
                          <div className="mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.itemStatus)}`}>
                              {item.itemStatus}
                            </span>
                          </div>
                          {item.returnStatus && getReturnOptions(item.returnStatus).length > 0 && selectedOrder.paymentStatus === 'completed' && (
                            <button
                              onClick={() => handleReturnAction(selectedOrder.orderId, item._id)}
                              className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                            >
                              Update Return
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{selectedOrder?.subtotal?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">₹{selectedOrder?.shipping?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">₹{selectedOrder?.tax?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-lg">₹{selectedOrder?.total?.toLocaleString() || '0'}</span>
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
                    </div>
                  </div>
                </div>
              </div>
<<<<<<< HEAD
            </div>
          )}
        </main>
      </div>
    </div>
=======

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SellerLayout>
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
  );
};

export default SellerOrders;