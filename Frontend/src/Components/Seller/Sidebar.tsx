// components/SellerSidebar.tsx
import React from 'react';
import { 
  BarChart3, Package, ShoppingBag, TrendingUp, 
  LogOut, Phone, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SellerSidebarProps {
  activePage: 'dashboard' | 'products' | 'orders' | 'sales-report';
  onClose?: () => void;
}

export const SellerSidebar: React.FC<SellerSidebarProps> = ({ activePage, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = (): void => {
    localStorage.removeItem('sellerToken');
    navigate('/seller/');
  };

  const isActive = (page: string): boolean => activePage === page;

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">FBB STORE</h1>
            <p className="text-sm text-gray-500 mt-1">Seller Dashboard</p>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <nav className="space-y-1">
          <button 
            onClick={() => navigate('/seller/dashboard')}
            className={`w-full text-left py-3 px-4 rounded-lg transition-all flex items-center space-x-3 ${
              isActive('dashboard') 
                ? 'bg-blue-50 text-blue-600 font-semibold' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </button>
          
          <button 
            onClick={() => navigate('/seller/product')}
            className={`w-full text-left py-3 px-4 rounded-lg transition-all flex items-center space-x-3 ${
              isActive('products') 
                ? 'bg-blue-50 text-blue-600 font-semibold' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Package size={20} />
            <span>Products</span>
          </button>
          
          <button 
            onClick={() => navigate('/seller/orders')}
            className={`w-full text-left py-3 px-4 rounded-lg transition-all flex items-center space-x-3 ${
              isActive('orders') 
                ? 'bg-blue-50 text-blue-600 font-semibold' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <ShoppingBag size={20} />
            <span>Orders</span>
          </button>
          
          <button 
            onClick={() => navigate('/seller/sales-report')}
            className={`w-full text-left py-3 px-4 rounded-lg transition-all flex items-center space-x-3 ${
              isActive('sales-report') 
                ? 'bg-blue-50 text-blue-600 font-semibold' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <TrendingUp size={20} />
            <span>Sales Report</span>
          </button>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200 space-y-3">
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
    </div>
  );
};