<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import { useState, useEffect } from 'react';
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowLeft, Shield, Truck, 
  Package, CheckCircle, CreditCard, Lock, Heart, ChevronRight 
} from 'lucide-react';
import axios from 'axios';
import { baseurl } from '../../Constant/Base';
<<<<<<< HEAD
import NavBar from '../Layouts/Navbar';
=======
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
import Footer from '../Layouts/Footer';
import { toast } from 'react-hot-toast';

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

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [cartTotal, setCartTotal] = useState(0);
  const [shippingCost] = useState(0);
  const [tax] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem('token')
  const api = axios.create({
    baseURL: baseurl,
  });

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Payment",
      description: "Your payment information is encrypted"
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Free Shipping",
      description: "Free delivery on orders above ₹5000"
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "Easy Returns",
      description: "30-day return policy"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Authentic Products",
      description: "100% genuine with warranty"
    }
  ];

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart', {
        headers: token ? { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } : {}
      });
      
      if (response.data.success) {
        setCartItems(response.data.cart || []);
        const cartTotal = response.data.cart.reduce((total: number, item: any) => {
          return total + (item.price * item.quantity);
        }, 0);
        setCartTotal(cartTotal);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };
  
  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating(cartItemId);
      await api.put('/cart/update', {
        cartItemId,
        quantity: newQuantity
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      await fetchCartData();
    } catch (error: any) {
      console.error('Error updating quantity:', error);
      if (error.response?.data?.message === 'Insufficient stock available') {
        toast.error('Insufficient stock available');
      } else {
        toast.error('Failed to update quantity');
      }
    } finally {
      setUpdating(null);
    }
  };
  
  const removeItem = async (cartItemId: string) => {
    try {
      await api.delete(`/cart/remove/${cartItemId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Item removed from cart');
      await fetchCartData();
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };



  const moveToWishlist = async (productId: string) => {
    try {
<<<<<<< HEAD
      await api.post('/cart/wishlist/add', { productId });
=======
      await api.post('/wishlist/add', { productId },{
        headers: { Authorization: `Bearer ${token}` }

      });
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
      await removeItem(productId);
      toast.success('Moved to wishlist');
    } catch (error) {
      console.error('Error moving to wishlist:', error);
      toast.error('Failed to move to wishlist');
    }
  };

  const clearCart = async () => {
    try {
<<<<<<< HEAD
      await api.delete('/cart/cart/clear');
=======
      await api.delete('/cart/clear',{
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

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = cartTotal + shippingCost + tax;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
<<<<<<< HEAD
        <NavBar />
=======
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
        <div className="flex-grow flex items-center justify-center mt-[80px] pb-24">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
<<<<<<< HEAD
        <NavBar />
=======
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
        <div className="flex-grow flex flex-col items-center justify-center px-4 mt-[80px] pb-24">
          <div className="text-center max-w-md">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any products to your cart yet. Start shopping to add items.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/shop')}
                className="w-full bg-black text-white hover:bg-gray-900 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Continue Shopping
              </button>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
<<<<<<< HEAD
      <NavBar />
      
      {/* Add a spacer div that matches navbar height */}
=======
 
      
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
      <div className="h-[80px]"></div>
      
      <main className="flex-grow pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center text-sm text-gray-500 mb-8 pt-6">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-black font-medium">Shopping Cart</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                    <div className="text-gray-600">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex gap-4 py-6 border-b border-gray-100 last:border-0">
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={item.product.images.image1 || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop&auto=format&q=80"}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 mb-1">
                              <Link to={`/product/${item.product._id}`} className="hover:text-black">
                                {item.product.name}
                              </Link>
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">{item.product.brand}</p>
                            
                            {(item.selectedColor || item.selectedSize) && (
                              <div className="flex gap-4 text-sm text-gray-500 mb-3">
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
                                disabled={item.quantity <= 1 || updating === item._id}
                                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-12 text-center font-medium">
                                {updating === item._id ? '...' : item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock || updating === item._id}
                                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <button
                              onClick={() => moveToWishlist(item.product._id)}
                              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors text-sm"
                            >
                              <Heart className="h-4 w-4" />
                              Move to Wishlist
                            </button>
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

              <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-black">
                        {feature.icon}
                      </div>
                      <div className="font-medium text-gray-900">{feature.title}</div>
                    </div>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-[100px]">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
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
                    className="w-full bg-black text-white hover:bg-gray-900 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <CreditCard className="h-5 w-5" />
                    Proceed to Checkout
                  </button>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Lock className="h-4 w-4" />
                    Secure checkout
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <Link
                      to="/shop"
                      className="flex items-center justify-center gap-2 text-gray-600 hover:text-black transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Continue Shopping
                    </Link>
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

export default CartPage;