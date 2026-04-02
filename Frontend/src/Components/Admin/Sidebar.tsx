import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, Tag, Users, LogOut, Package, Grid } from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <Home size={20} /> },
    { name: 'Category', path: '/admin/category', icon: <Tag size={20} /> },
    { name: 'Product', path: '/admin/product', icon: <ShoppingBag size={20} /> },
    { name: 'Sub-Category', path: '/admin/sub-category', icon: <Grid size={20} /> },
    { name: 'Sellers', path: '/admin/sellers', icon: <Users size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <Package size={20} /> }
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:w-64 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <div>
                <h1 className="text-gray-800 text-xl font-bold">FBB STORE</h1>
                <p className="text-gray-500 text-sm">Admin Panel</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map(({ name, path, icon }) => (
                <li key={name}>
                  <NavLink
                    to={path}
                    onClick={onMobileClose}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 py-3 px-4 rounded-lg transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-semibold border-l-4 border-blue-500'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    {icon}
                    <span>{name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center space-x-3 w-full py-3 px-4 rounded-lg text-red-600 hover:bg-red-50 transition-all font-medium"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};