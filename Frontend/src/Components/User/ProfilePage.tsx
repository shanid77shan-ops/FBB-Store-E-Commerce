<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, MapPin, ShoppingBag, Heart, Settings, LogOut, Package, Clock, Truck, CheckCircle, Edit, Mail, Phone, CreditCard, Trash2, Plus, Minus, ArrowLeft, Shield, Lock, Printer, Download, ChevronLeft, X, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { baseurl } from '../../Constant/Base';
import NavBar from '../Layouts/Navbar';
=======
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, MapPin, ShoppingBag, Heart, Settings, LogOut, Package, Clock, Truck, CheckCircle, Edit, Mail, Phone, CreditCard, Trash2, Plus, Minus, Lock, Printer, Download, ChevronLeft, X, AlertCircle, Home, Building } from 'lucide-react';
import axios from 'axios';
import { baseurl } from '../../Constant/Base';
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
import Footer from '../Layouts/Footer';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: {
    shipping: {
      street: string;
      city: string;
      state: string;
      country: string;
      pincode: string;
      phone: string;
    };
    billing: {
      street: string;
      city: string;
      state: string;
      country: string;
      pincode: string;
      phone: string;
    };
  };
  cartCount: number;
  wishlistCount: number;
  ordersCount: number;
<<<<<<< HEAD
  joinDate: string;
=======
  createdAt: string;
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
}

interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    brand: string;
    images: {
      image1: string;
    };
    priceINR: number;
    stock: number;
    colors?: string[];
    sizes?: string[];
  };
  quantity: number;
  price: number;
  selectedColor?: string;
  selectedSize?: string;
  itemStatus: string;
  sellerStatus: string;
  cancellationReason?: string;
  returnStatus?: string;
  returnReason?: string;
  canCancel?: boolean;
  canReturn?: boolean;
}

interface SellerOrder {
  seller: {
    _id: string;
    name: string;
    companyName: string;
    phone: string;
    email: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  sellerStatus: string;
}

interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  sellerOrders: SellerOrder[];
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  subtotal: number;
  shipping: number;
  tax: number;
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
  trackingNumber?: string;
  notes?: string;
  cancellationReason?: string;
}

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    brand: string;
    priceINR: number;
    priceAED: number;
    images: {
      image1: string;
      image2?: string;
      image3?: string;
      image4?: string;
    };
    stock: number;
    colors?: string[];
    sizes?: string[];
  };
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  price: number;
}

<<<<<<< HEAD
=======
interface WishlistItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    brand: string;
    priceINR: number;
    images: {
      image1: string;
    };
    stock: number;
  };
  addedAt: string;
}

interface Address {
  _id?: string;
  type: 'shipping' | 'billing';
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
}

>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
<<<<<<< HEAD
=======
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
  const [loading, setLoading] = useState({
    overview: true,
    orders: true,
    cart: true,
<<<<<<< HEAD
=======
    wishlist: true,
    addresses: true,
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
    orderDetails: false
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingCart, setUpdatingCart] = useState<string | null>(null);
  const [cartTotal, setCartTotal] = useState(0);
  const [shippingCost] = useState(0);
  const [tax] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
<<<<<<< HEAD
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [processingAction, setProcessingAction] = useState(false);
=======
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [processingAction, setProcessingAction] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    isDefault: false
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: baseurl,
  });

  useEffect(() => {
<<<<<<< HEAD
    if (activeTab === 'overview') {
      fetchProfileData();
      fetchRecentOrders();
    } else if (activeTab === 'orders') {
      fetchAllOrders();
    } else if (activeTab === 'cart') {
      fetchCartData();
    }
  }, [activeTab]);
=======
    if (isLoggedIn) {
      if (activeTab === 'overview') {
        fetchProfileData();
        fetchRecentOrders();
      } else if (activeTab === 'orders') {
        fetchAllOrders();
      } else if (activeTab === 'cart') {
        fetchCartData();
      } else if (activeTab === 'wishlist') {
        fetchWishlistData();
      } else if (activeTab === 'addresses') {
        fetchAddresses();
      }
    } else {
      navigate('/');
      toast.error('Please login to access profile');
    }
  }, [activeTab, isLoggedIn]);
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae

  const fetchProfileData = async () => {
    try {
      const response = await api.get('/profile', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (response.data.success) {
        setProfile(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const fetchRecentOrders = async () => {
    try {
      setLoading(prev => ({ ...prev, overview: true }));
      const response = await api.get('/orders', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(prev => ({ ...prev, overview: false }));
    }
  };

  const fetchAllOrders = async () => {
    try {
      setLoading(prev => ({ ...prev, orders: true }));
      const response = await api.get('/orders', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  const fetchCartData = async () => {
    try {
      setLoading(prev => ({ ...prev, cart: true }));
<<<<<<< HEAD
      const response = await api.get('/cart',{
=======
      const response = await api.get('/cart', {
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (response.data.success) {
        setCartItems(response.data.cart || []);
        setCartTotal(response.data.cartTotal || 0);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
      setCartItems([]);
    } finally {
      setLoading(prev => ({ ...prev, cart: false }));
    }
  };

<<<<<<< HEAD
=======
  const fetchWishlistData = async () => {
    try {
      setLoading(prev => ({ ...prev, wishlist: true }));
      const response = await api.get('/wishlist', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (response.data.success) {
        setWishlistItems(response.data.wishlist || []);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
      setWishlistItems([]);
    } finally {
      setLoading(prev => ({ ...prev, wishlist: false }));
    }
  };

  const fetchAddresses = async () => {
    try {
      setLoading(prev => ({ ...prev, addresses: true }));
      const response = await api.get('/profile/addresses', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (response.data.success) {
        setAddresses(response.data.addresses || []);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddresses([]);
    } finally {
      setLoading(prev => ({ ...prev, addresses: false }));
    }
  };

>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdatingCart(cartItemId);
<<<<<<< HEAD
      await api.put('/cart/cart/update', {
        cartItemId,
        quantity: newQuantity
      });
=======
      await api.put('/cart/update', {
        cartItemId,
        quantity: newQuantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
      await fetchCartData();
    } catch (error: any) {
      console.error('Error updating quantity:', error);
      if (error.response?.data?.message === 'Insufficient stock available') {
        toast.error('Insufficient stock available');
      } else {
        toast.error('Failed to update quantity');
      }
    } finally {
      setUpdatingCart(null);
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
<<<<<<< HEAD
      await api.delete(`/cart/cart/remove/${cartItemId}`);
=======
      await api.delete(`/cart/remove/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
      toast.success('Item removed from cart');
      await fetchCartData();
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

<<<<<<< HEAD
  const clearCart = async () => {
    try {
      await api.delete('/cart/cart/clear');
=======
  const removeFromWishlist = async (productId: string) => {
    try {
      await api.delete(`/wishlist/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Item removed from wishlist');
      await fetchWishlistData();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item');
    }
  };

  const moveToCart = async (productId: string) => {
    try {
      await api.post('/wishlist/move-to-cart', {
        productId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Item moved to cart');
      await fetchWishlistData();
      await fetchCartData();
    } catch (error) {
      console.error('Error moving to cart:', error);
      toast.error('Failed to move item');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear', {
        headers: { Authorization: `Bearer ${token}` }
      });
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
      toast.success('Cart cleared');
      await fetchCartData();
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

<<<<<<< HEAD
=======
  const handleAddAddress = () => {
    setSelectedAddress(null);
    setAddressForm({
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      country: 'India',
      pincode: '',
      isDefault: addresses.length === 0
    });
    setEditingAddress(false);
    setShowAddressModal(true);
  };

  const handleEditAddress = (address: Address) => {
    setSelectedAddress(address);
    setAddressForm({
      name: address.name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      pincode: address.pincode,
      isDefault: address.isDefault
    });
    setEditingAddress(true);
    setShowAddressModal(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await api.delete(`/profile/addresses/${addressId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Address deleted successfully');
        await fetchAddresses();
      } catch (error) {
        console.error('Error deleting address:', error);
        toast.error('Failed to delete address');
      }
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await api.put(`/profile/addresses/${addressId}/default`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Default address updated');
      await fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to update default address');
    }
  };

  const saveAddress = async () => {
    try {
      if (editingAddress && selectedAddress?._id) {
        await api.put(`/profile/addresses/${selectedAddress._id}`, addressForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Address updated successfully');
      } else {
        await api.post('/profile/addresses', addressForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Address added successfully');
      }
      setShowAddressModal(false);
      await fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    }
  };

  const updatePassword = async () => {
    const errors = [];
    if (passwordForm.newPassword.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }

    try {
      await api.put('/profile/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Password updated successfully');
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordErrors([]);
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error.response?.data?.message || 'Failed to update password');
    }
  };

>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
  const handleCancelItem = (item: OrderItem) => {
    setSelectedItem(item);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const handleReturnItem = (item: OrderItem) => {
    setSelectedItem(item);
    setReturnReason('');
    setShowReturnModal(true);
  };

  const confirmCancelItem = async () => {
    if (!selectedItem || !cancelReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }

    try {
      setProcessingAction(true);
      const response = await api.post(`/order/${selectedOrder?.orderId}/cancel-item`, {
        itemId: selectedItem._id,
        reason: cancelReason
<<<<<<< HEAD
=======
      }, {
        headers: { Authorization: `Bearer ${token}` }
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
      });

      if (response.data.success) {
        toast.success('Item cancelled successfully');
        setShowCancelModal(false);
        setSelectedItem(null);
        setCancelReason('');
        
        if (selectedOrder) {
          const updatedOrder = response.data.order;
          setSelectedOrder(updatedOrder);
          
          const updatedOrders = orders.map(order => 
            order.orderId === updatedOrder.orderId ? updatedOrder : order
          );
          setOrders(updatedOrders);
        }
      }
    } catch (error: any) {
      console.error('Error cancelling item:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel item');
    } finally {
      setProcessingAction(false);
    }
  };

  const confirmReturnItem = async () => {
    if (!selectedItem || !returnReason.trim()) {
      toast.error('Please provide a return reason');
      return;
    }

    try {
      setProcessingAction(true);
      const response = await api.post(`/order/${selectedOrder?.orderId}/return`, {
        itemId: selectedItem._id,
        reason: returnReason
<<<<<<< HEAD
=======
      }, {
        headers: { Authorization: `Bearer ${token}` }
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
      });

      if (response.data.success) {
        toast.success('Return requested successfully');
        setShowReturnModal(false);
        setSelectedItem(null);
        setReturnReason('');
        
        if (selectedOrder) {
          const updatedOrder = response.data.order;
          setSelectedOrder(updatedOrder);
          
          const updatedOrders = orders.map(order => 
            order.orderId === updatedOrder.orderId ? updatedOrder : order
          );
          setOrders(updatedOrders);
        }
      }
    } catch (error: any) {
      console.error('Error requesting return:', error);
      toast.error(error.response?.data?.message || 'Failed to request return');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
<<<<<<< HEAD
    navigate('/login');
    toast.success('Logged out successfully');
=======
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    navigate('/');
    toast.success('Logged out successfully');
    
    window.dispatchEvent(new Event('auth-change'));
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'processing': return <Package className="h-4 w-4 text-blue-500" />;
      case 'shipped': return <Truck className="h-4 w-4 text-purple-500" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled': return <X className="h-4 w-4 text-red-500" />;
      default: return <Package className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      case 'returned': return 'Returned';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending': return 'Your order has been received and is being processed.';
      case 'processing': return 'We are preparing your items for shipping.';
      case 'shipped': return 'Your order is on the way to you.';
      case 'delivered': return 'Your order has been delivered successfully.';
      case 'cancelled': return 'This order has been cancelled.';
      case 'returned': return 'Return has been requested for this order.';
      default: return '';
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = cartTotal + shippingCost + tax;

<<<<<<< HEAD
  if (loading.overview && activeTab === 'overview') {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <NavBar />
=======
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="flex-grow flex items-center justify-center mt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
            <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-amber-500 text-white hover:bg-amber-600 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading.overview && activeTab === 'overview') {
    return (
      <div className="min-h-screen flex flex-col bg-white">
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
        <div className="flex-grow flex items-center justify-center mt-16">
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
<<<<<<< HEAD
      <NavBar />
      
=======
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
      <main className="flex-grow pt-16">
        <div className="relative h-[250px] overflow-hidden bg-black">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=300&fit=crop&auto=format&q=80"
              alt="Profile Background"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
          </motion.div>

          <div className="relative h-full flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center border-4 border-amber-400 shadow-lg"
              >
                <User className="h-10 w-10 md:h-12 md:w-12 text-gray-800" />
              </motion.div>
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-white text-2xl md:text-3xl font-bold"
                >
                  Welcome back, {profile?.name || 'User'}!
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-gray-300 text-sm md:text-base"
                >
<<<<<<< HEAD
                  Member since {profile?.joinDate || '2023'}
=======
          <span>
            Member since{" "}
            {profile?.createdAt
              ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : ""}
          </span>
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
                </motion.p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-24"
              >
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === 'overview' 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <User className="h-5 w-5" />
                    Overview
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === 'orders' 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    My Orders
                  </button>

                  <button
                    onClick={() => setActiveTab('cart')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === 'cart' 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    My Cart
                  </button>

                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === 'wishlist' 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Heart className="h-5 w-5" />
                    Wishlist
                  </button>

                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === 'addresses' 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <MapPin className="h-5 w-5" />
                    Addresses
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === 'settings' 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors mt-4"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Spent</span>
                      <span className="font-bold text-gray-900">
                        ₹{(orders || []).reduce((sum, order) => sum + (order?.total || 0), 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Completed Orders</span>
                      <span className="font-bold text-gray-900">
                        {(orders || []).filter(o => o?.status === 'delivered').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Member Since</span>
<<<<<<< HEAD
                      <span className="font-bold text-gray-900">{profile?.joinDate || '2023'}</span>
=======
                      <span>
  Member since{" "}
  {profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""}
</span>
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-3">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
                        <p className="text-gray-600">Your latest purchases</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2"
                      >
                        View All
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    {loading.overview ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (orders?.length || 0) === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">No orders yet</p>
                        <p className="text-gray-500 text-sm mb-4">Start shopping to see your orders here</p>
                        <button
                          onClick={() => navigate('/shop')}
                          className="bg-amber-500 text-white hover:bg-amber-600 px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                          Start Shopping
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
<<<<<<< HEAD
                      {(orders || []).slice(0, 3).map((order) => (
                        <motion.div
                          key={order._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border border-gray-200"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                {getStatusIcon(order.status)}
                                <span className="font-medium text-gray-900">Order #{order.orderId}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                  {getStatusText(order.status)}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })} • {(order.items || []).length} items
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-gray-900">₹{order.total}</div>
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setActiveTab('order-details');
                                }}
                                className="text-sm text-amber-600 hover:text-amber-700 mt-2"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
=======
                        {(orders || []).slice(0, 3).map((order) => (
                          <motion.div
                            key={order._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border border-gray-200"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  {getStatusIcon(order.status)}
                                  <span className="font-medium text-gray-900">Order #{order.orderId}</span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                    {getStatusText(order.status)}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })} • {(order.items || []).length} items
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-gray-900">₹{order.total}</div>
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setActiveTab('order-details');
                                  }}
                                  className="text-sm text-amber-600 hover:text-amber-700 mt-2"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
                    )}
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                        <p className="text-gray-600">Manage your personal details</p>
                      </div>
                      <button className="flex items-center gap-2 text-amber-600 hover:text-amber-700">
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Full Name</label>
                          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                            <User className="h-5 w-5 text-gray-400" />
                            <span className="font-medium">{profile?.name}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Email Address</label>
                          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <span>{profile?.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Phone Number</label>
                          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                            <Phone className="h-5 w-5 text-gray-400" />
                            <span>{profile?.phone}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Account Status</label>
                          <div className="flex items-center gap-3 bg-green-50 rounded-lg p-3 border border-green-200">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-green-700">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
                      <p className="text-gray-600">Track and manage your orders</p>
                    </div>
                  </div>

                  {loading.orders ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (orders?.length || 0) === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                      <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
                      <p className="text-gray-600 mb-8">You haven't placed any orders yet.</p>
                      <button
                        onClick={() => navigate('/shop')}
                        className="bg-amber-500 text-white hover:bg-amber-600 px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {(orders || []).map((order) => (
                        <div key={order._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                          <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  {getStatusIcon(order.status)}
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                    {getStatusText(order.status)}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  Order #{order.orderId} • 
                                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-gray-900">₹{order.total}</div>
                                <div className="text-sm text-gray-600 capitalize">
                                  {order.paymentMethod === 'razorpay' ? 'Paid Online' : 'Cash on Delivery'}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-6">
                            <div className="space-y-4">
                              {(order.items || []).slice(0, 2).map((item, index) => (
                                <div key={index} className="flex gap-4">
                                  <div className="w-20 h-20 flex-shrink-0">
                                    <img
                                      src={item.product?.images?.image1 || ''}
                                      alt={item.product?.name || 'Product'}
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{item.product?.name || 'Product'}</h4>
                                    <p className="text-sm text-gray-600">{item.product?.brand || ''}</p>
                                    <div className="flex justify-between items-center mt-2">
                                      <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                                      <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
                              <div className="text-sm text-gray-600">
                                {(order.items || []).length} item{(order.items || []).length !== 1 ? 's' : ''}
                              </div>
                              <div className="flex gap-4">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setActiveTab('order-details');
                                  }}
                                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                  View Details
                                </button>
                                {order.status === 'delivered' && (
                                  <button className="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 rounded-lg transition-colors">
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
                </motion.div>
              )}

              {activeTab === 'cart' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  {loading.cart ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (cartItems?.length || 0) === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
                      <p className="text-gray-600 mb-8">
                        Looks like you haven't added any products to your cart yet.
                      </p>
                      <button
                        onClick={() => navigate('/shop')}
                        className="bg-amber-500 text-white hover:bg-amber-600 px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                          <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                            <div className="text-gray-600">
                              {totalCartItems} {totalCartItems === 1 ? 'item' : 'items'}
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          {(cartItems || []).map((item) => (
                            <div key={item._id} className="flex gap-4 py-6 border-b border-gray-200 last:border-0">
                              <div className="w-24 h-24 flex-shrink-0">
                                <img
                                  src={item.product.images.image1}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>

                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <div>
                                    <h3 className="font-medium text-gray-900 mb-1">
                                      {item.product.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">{item.product.brand}</p>
                                    
                                    {(item.selectedColor || item.selectedSize) && (
                                      <div className="flex gap-4 text-sm text-gray-600 mb-3">
                                        {item.selectedColor && (
                                          <span>Color: {item.selectedColor}</span>
                                        )}
                                        {item.selectedSize && (
                                          <span>Size: {item.selectedSize}</span>
                                        )}
                                      </div>
                                    )}

                                    <div className={`text-sm font-medium ${
                                      item.product.stock > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      {item.product.stock > 0 
                                        ? `${item.product.stock} in stock` 
                                        : 'Out of stock'}
                                    </div>
                                  </div>

                                  <div className="text-right">
                                    <div className="text-lg font-bold text-gray-900 mb-2">
                                      ₹{item.price * item.quantity}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      ₹{item.price} each
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                      <button
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        disabled={item.quantity <= 1 || updatingCart === item._id}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
                                      >
                                        <Minus className="h-4 w-4" />
                                      </button>
                                      <span className="w-12 text-center font-medium">
                                        {updatingCart === item._id ? '...' : item.quantity}
                                      </span>
                                      <button
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        disabled={item.quantity >= item.product.stock || updatingCart === item._id}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
                                      >
                                        <Plus className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => removeItem(item._id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}

                          <div className="flex justify-end mt-6">
                            <button
                              onClick={clearCart}
                              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              Clear Cart
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                        <div className="space-y-4">
                          <div className="flex justify-between text-gray-600">
                            <span>Subtotal ({totalCartItems} items)</span>
                            <span className="font-medium">₹{cartTotal}</span>
                          </div>
                          
                          <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span className="font-medium">
                              {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                            </span>
                          </div>
                          
                          <div className="flex justify-between text-gray-600">
                            <span>Tax</span>
                            <span className="font-medium">₹{tax}</span>
                          </div>

                          <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between text-lg font-bold">
                              <span>Total</span>
                              <span>₹{grandTotal}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-amber-500 text-white hover:bg-amber-600 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                          >
                            <CreditCard className="h-5 w-5" />
                            Proceed to Checkout
                          </button>

                          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <Lock className="h-4 w-4" />
                            Secure checkout
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

<<<<<<< HEAD
=======
              {activeTab === 'wishlist' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Wishlist</h1>
                      <p className="text-gray-600">Your saved favorite items</p>
                    </div>
                    <div className="text-gray-600">
                      {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                    </div>
                  </div>

                  {loading.wishlist ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : wishlistItems.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h2>
                      <p className="text-gray-600 mb-8">
                        Save your favorite items here to purchase them later.
                      </p>
                      <button
                        onClick={() => navigate('/shop')}
                        className="bg-amber-500 text-white hover:bg-amber-600 px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Browse Products
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistItems.map((item) => (
                        <div key={item._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                          <div className="p-4">
                            <div className="relative h-48 mb-4">
                              <img
                                src={item.product.images.image1}
                                alt={item.product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <button
                                onClick={() => removeFromWishlist(item.product._id)}
                                className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-500 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <h3 className="font-medium text-gray-900 mb-2 line-clamp-1">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">{item.product.brand}</p>
                            
                            <div className="flex items-center justify-between mb-4">
                              <div className="text-lg font-bold text-gray-900">
                                ₹{item.product.priceINR}
                              </div>
                              <div className={`text-sm font-medium ${
                                item.product.stock > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {item.product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => moveToCart(item.product._id)}
                                disabled={item.product.stock === 0}
                                className="flex-1 bg-amber-500 text-white hover:bg-amber-600 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Add to Cart
                              </button>
                              <button
                                onClick={() => navigate(`/product/${item.product._id}`)}
                                className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 rounded-lg font-medium transition-colors"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'addresses' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Addresses</h1>
                      <p className="text-gray-600">Manage your shipping and billing addresses</p>
                    </div>
                    <button
                      onClick={handleAddAddress}
                      className="bg-amber-500 text-white hover:bg-amber-600 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add New Address
                    </button>
                  </div>

                  {loading.addresses ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">No Addresses Saved</h2>
                      <p className="text-gray-600 mb-8">
                        Add your shipping and billing addresses for faster checkout.
                      </p>
                      <button
                        onClick={handleAddAddress}
                        className="bg-amber-500 text-white hover:bg-amber-600 px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Add Your First Address
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.map((address) => (
                        <div key={address._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              {address.type === 'shipping' ? (
                                <Home className="h-5 w-5 text-amber-500" />
                              ) : (
                                <Building className="h-5 w-5 text-blue-500" />
                              )}
                              <div>
                                <h3 className="font-bold text-gray-900 capitalize">{address.type} Address</h3>
                                {address.isDefault && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditAddress(address)}
                                className="text-gray-400 hover:text-amber-600 transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => address._id && handleDeleteAddress(address._id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="font-medium text-gray-900">{address.name}</p>
                            <p className="text-gray-600">{address.street}</p>
                            <p className="text-gray-600">
                              {address.city}, {address.state}
                            </p>
                            <p className="text-gray-600">
                              {address.country} - {address.pincode}
                            </p>
                            <p className="text-gray-600 mt-2">Phone: {address.phone}</p>
                          </div>

                          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                            {!address.isDefault && (
                              <button
                                onClick={() => address._id && handleSetDefaultAddress(address._id)}
                                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                              >
                                Set as Default
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div>
                            <span className="font-medium text-gray-900">Email Notifications</span>
                            <p className="text-sm text-gray-600">Receive updates about your orders</p>
                          </div>
                          <input type="checkbox" className="toggle toggle-amber" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div>
                            <span className="font-medium text-gray-900">Promotional Offers</span>
                            <p className="text-sm text-gray-600">Get notified about sales and new arrivals</p>
                          </div>
                          <input type="checkbox" className="toggle toggle-amber" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div>
                            <span className="font-medium text-gray-900">Order Updates</span>
                            <p className="text-sm text-gray-600">Get real-time updates on your orders</p>
                          </div>
                          <input type="checkbox" className="toggle toggle-amber" />
                        </label>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                        <button
                          onClick={() => setShowPasswordModal(true)}
                          className="text-amber-600 hover:text-amber-700 font-medium"
                        >
                          Change Password
                        </button>
                      </div>
                      <p className="text-gray-600 mb-4">
                        For security reasons, we recommend changing your password regularly.
                      </p>
                    </div>

                    <div className="pt-8 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 mb-3">Permanently delete your account and all associated data.</p>
                        <button className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-lg font-medium transition-colors">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
              {activeTab === 'order-details' && selectedOrder && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back to Orders
                    </button>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={handlePrintInvoice}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Printer className="h-4 w-4" />
                        Print Invoice
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-200">
                      <div className="flex flex-col lg:flex-row justify-between gap-6">
                        <div>
                          <div className="flex items-center gap-4 mb-4">
                            {getStatusIcon(selectedOrder.status)}
                            <div>
                              <h1 className="text-2xl font-bold text-gray-900">{getStatusText(selectedOrder.status)}</h1>
                              <p className="text-gray-600">{getStatusDescription(selectedOrder.status)}</p>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Order ID:</span> {selectedOrder.orderId}
                            </div>
                            <div>
                              <span className="font-medium">Order Date:</span> 
                              {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            {selectedOrder.trackingNumber && (
                              <div>
                                <span className="font-medium">Tracking Number:</span> {selectedOrder.trackingNumber}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-6 rounded-lg lg:w-80 border border-gray-200">
                          <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Subtotal</span>
                              <span className="text-gray-900">₹{selectedOrder.subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Shipping</span>
                              <span className="text-gray-900">{selectedOrder.shipping === 0 ? 'FREE' : `₹${selectedOrder.shipping}`}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tax</span>
                              <span className="text-gray-900">₹{selectedOrder.tax}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                              <span className="text-gray-900">Total</span>
                              <span className="text-gray-900">₹{selectedOrder.total}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Shipping Address
                          </h3>
                          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <p className="font-medium text-gray-900 mb-2">{selectedOrder.shippingAddress.name}</p>
                            <p className="text-gray-600 mt-1">{selectedOrder.shippingAddress.street}</p>
                            <p className="text-gray-600">
                              {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                            </p>
                            <p className="text-gray-600">
                              {selectedOrder.shippingAddress.country} - {selectedOrder.shippingAddress.pincode}
                            </p>
                            <p className="text-gray-600 mt-2">Phone: {selectedOrder.shippingAddress.phone}</p>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Payment Information
                          </h3>
                          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                              <span className="font-medium text-gray-900">Payment Method</span>
                              <span className="capitalize text-gray-600">
                                {selectedOrder.paymentMethod === 'razorpay' ? 'Credit/Debit Card & UPI' : 'Cash on Delivery'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-900">Payment Status</span>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                selectedOrder.paymentStatus === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-amber-100 text-amber-800'
                              } capitalize`}>
                                {selectedOrder.paymentStatus}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Order Items</h3>
                        <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 font-medium text-gray-900">
                            <div className="col-span-5">Product</div>
                            <div className="col-span-2 text-center">Quantity</div>
                            <div className="col-span-2 text-center">Price</div>
                            <div className="col-span-3 text-right">Actions</div>
                          </div>
                          
                          {selectedOrder.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 last:border-0">
                              <div className="col-span-5">
                                <div className="flex gap-4">
                                  <div className="w-16 h-16 flex-shrink-0">
                                    <img
                                      src={item.product?.images?.image1 || ''}
                                      alt={item.product?.name || 'Product'}
                                      className="w-full h-full object-cover rounded"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{item.product?.name || 'Product'}</h4>
                                    <p className="text-sm text-gray-600">{item.product?.brand || ''}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.itemStatus)}`}>
                                        {getStatusText(item.itemStatus)}
                                      </span>
                                      {item.cancellationReason && (
                                        <span className="text-xs text-red-600">(Cancelled: {item.cancellationReason})</span>
                                      )}
                                      {item.returnReason && (
                                        <span className="text-xs text-orange-600">(Return: {item.returnReason})</span>
                                      )}
                                    </div>
                                    {(item.selectedColor || item.selectedSize) && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        {item.selectedColor && <span>Color: {item.selectedColor} </span>}
                                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="col-span-2 flex items-center justify-center text-gray-900">
                                {item.quantity}
                              </div>
                              <div className="col-span-2 flex items-center justify-center text-gray-900">
                                ₹{item.price}
                              </div>
                              <div className="col-span-3 flex items-center justify-end gap-2">
                                {item.canCancel && (
                                  <button
                                    onClick={() => handleCancelItem(item)}
                                    className="px-3 py-1.5 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                                  >
                                    Cancel Item
                                  </button>
                                )}
                                {item.canReturn && (
                                  <button
                                    onClick={() => handleReturnItem(item)}
                                    className="px-3 py-1.5 text-sm bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg transition-colors"
                                  >
                                    Return Item
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedOrder.notes && (
                        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-2">Order Notes</h4>
                          <p className="text-gray-600">{selectedOrder.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
<<<<<<< HEAD

              {activeTab === 'addresses' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Shipping Address</h2>
                        <p className="text-gray-600">Your primary delivery address</p>
                      </div>
                      <button className="flex items-center gap-2 text-amber-600 hover:text-amber-700">
                        <Edit className="h-4 w-4" />
                        Edit Address
                      </button>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                      {profile?.address.shipping ? (
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-amber-500 mt-1" />
                            <div>
                              <p className="font-medium text-gray-900 mb-1">{profile.address.shipping.street}</p>
                              <p className="text-gray-600">
                                {profile.address.shipping.city}, {profile.address.shipping.state}
                              </p>
                              <p className="text-gray-600">
                                {profile.address.shipping.country} - {profile.address.shipping.pincode}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{profile.address.shipping.phone}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-600 mb-2">No shipping address saved</p>
                          <button className="text-amber-600 hover:text-amber-700 font-medium">
                            Add Shipping Address
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Billing Address</h2>
                        <p className="text-gray-600">Address for invoices and receipts</p>
                      </div>
                      <button className="flex items-center gap-2 text-amber-600 hover:text-amber-700">
                        <Edit className="h-4 w-4" />
                        Edit Address
                      </button>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      {profile?.address.billing ? (
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <CreditCard className="h-5 w-5 text-gray-500 mt-1" />
                            <div>
                              <p className="font-medium text-gray-900 mb-1">{profile.address.billing.street}</p>
                              <p className="text-gray-600">
                                {profile.address.billing.city}, {profile.address.billing.state}
                              </p>
                              <p className="text-gray-600">
                                {profile.address.billing.country} - {profile.address.billing.pincode}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{profile.address.billing.phone}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-600 mb-2">No billing address saved</p>
                          <button className="text-amber-600 hover:text-amber-700 font-medium">
                            Add Billing Address
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div>
                            <span className="font-medium text-gray-900">Email Notifications</span>
                            <p className="text-sm text-gray-600">Receive updates about your orders</p>
                          </div>
                          <input type="checkbox" className="toggle toggle-amber" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div>
                            <span className="font-medium text-gray-900">Promotional Offers</span>
                            <p className="text-sm text-gray-600">Get notified about sales and new arrivals</p>
                          </div>
                          <input type="checkbox" className="toggle toggle-amber" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div>
                            <span className="font-medium text-gray-900">Order Updates</span>
                            <p className="text-sm text-gray-600">Get real-time updates on your orders</p>
                          </div>
                          <input type="checkbox" className="toggle toggle-amber" />
                        </label>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                      <div className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                            <input
                              type="password"
                              placeholder="Enter current password"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                            />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <input
                              type="password"
                              placeholder="Enter new password"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                            />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                            <input
                              type="password"
                              placeholder="Confirm new password"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                            />
                        </div>
                        <button className="bg-amber-500 text-white hover:bg-amber-600 px-6 py-3 rounded-lg font-medium transition-colors">
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 mb-3">Permanently delete your account and all associated data.</p>
                        <button className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-lg font-medium transition-colors">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'wishlist' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h2>
                  <div className="text-center py-12">
                    <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Your wishlist is empty</h3>
                    <p className="text-gray-600 mb-8">
                      Save your favorite items here to purchase them later.
                    </p>
                    <button
                      onClick={() => navigate('/shop')}
                      className="bg-amber-500 text-white hover:bg-amber-600 px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Browse Products
                    </button>
                  </div>
                </motion.div>
              )}
=======
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
            </div>
          </div>
        </div>
      </main>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-bold text-gray-900">Cancel Item</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this item? This action cannot be undone.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Reason *
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancellation"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                disabled={processingAction}
              >
                Cancel
              </button>
              <button
                onClick={confirmCancelItem}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                disabled={processingAction || !cancelReason.trim()}
              >
                {processingAction ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-orange-500" />
              <h3 className="text-lg font-bold text-gray-900">Request Return</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Please provide a reason for returning this item. Returns are accepted within 30 days of delivery.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Return Reason *
              </label>
              <textarea
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="Please provide a reason for return"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReturnModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                disabled={processingAction}
              >
                Cancel
              </button>
              <button
                onClick={confirmReturnItem}
                className="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-lg transition-colors disabled:opacity-50"
                disabled={processingAction || !returnReason.trim()}
              >
                {processingAction ? 'Processing...' : 'Request Return'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

<<<<<<< HEAD
=======
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={addressForm.name}
                  onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <textarea
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  rows={2}
                  placeholder="Enter street address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    placeholder="Enter state"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    placeholder="Enter country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    placeholder="Enter pincode"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  Set as default address
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveAddress}
                className="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 rounded-lg transition-colors"
              >
                {editingAddress ? 'Update Address' : 'Save Address'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordErrors([]);
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {passwordErrors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                {passwordErrors.map((error, index) => (
                  <p key={index} className="text-sm text-red-600">{error}</p>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password *
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password *
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="Enter new password (min. 6 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordErrors([]);
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updatePassword}
                className="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 rounded-lg transition-colors"
              >
                Update Password
              </button>
            </div>
          </motion.div>
        </div>
      )}

>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
      <Footer />
    </div>
  );
};

export default ProfilePage;