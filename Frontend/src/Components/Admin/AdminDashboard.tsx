import  { useEffect, useState } from 'react';
import { TrendingUp, Users, Package, DollarSign, Activity } from 'lucide-react';
import axios from 'axios';
import { baseurl } from '../../Constant/Base';

interface DashboardStats {
  totalSellers: number;
  activeSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSellers: 0,
    activeSellers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  const api = axios.create({ baseURL: baseurl });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [sellersRes, productsRes] = await Promise.all([
        api.get('/admin/get-sellers'),
        api.get('/admin/get-products')
      ]);

      const sellers = sellersRes.data || [];
      const products = productsRes.data || [];

      const activeSellers = sellers.filter((seller: any) => seller.status).length;
      
      setStats({
        totalSellers: sellers.length,
        activeSellers,
        totalProducts: products.length,
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Sellers',
      value: stats.totalSellers,
      change: '+12%',
      icon: <Users className="text-blue-500" size={24} />,
      color: 'bg-blue-50',
      trend: 'up'
    },
    {
      title: 'Active Sellers',
      value: stats.activeSellers,
      change: '+8%',
      icon: <Activity className="text-green-500" size={24} />,
      color: 'bg-green-50',
      trend: 'up'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      change: '+24%',
      icon: <Package className="text-purple-500" size={24} />,
      color: 'bg-purple-50',
      trend: 'up'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      change: '+18%',
      icon: <DollarSign className="text-yellow-500" size={24} />,
      color: 'bg-yellow-50',
      trend: 'up'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className={`${card.color} rounded-2xl p-6 shadow-sm border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{card.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp size={16} className={`mr-1 ${card.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-sm ${card.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {card.change}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">from last month</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-white">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              View All
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">New Seller Registered</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">5 New Products Added</p>
                  <p className="text-sm text-gray-500">4 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Quick Stats</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Pending Orders</span>
              <span className="font-bold text-gray-800">12</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Low Stock Products</span>
              <span className="font-bold text-gray-800">8</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Active Categories</span>
              <span className="font-bold text-gray-800">24</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;