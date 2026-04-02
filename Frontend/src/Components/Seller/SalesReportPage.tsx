<<<<<<< HEAD
import React from 'react';

const SalesReportPage: React.FC = () => {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Sales Report Page</h1>
      <p>The code is now fixed and working!</p>
    </div>
  );
=======
import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { 
  DollarSign, ShoppingBag, Package, Users, Calendar,
  Download, RefreshCw, ArrowUpRight, ArrowDownRight,
  TrendingUp, TrendingDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { SellerLayout } from '../Layouts/SellerLayout';
import { baseurl } from '../../Constant/Base';
import { useGetToken } from '../../Token/getToken';
import {
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface SalesDataPoint {
  date: string;
  sales: number;
  orders: number;
}

interface CategoryDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface TopProduct {
  name: string;
  brand: string;
  category: string;
  image: string;
  unitsSold: number;
  revenue: number;
  growth: number;
}

interface MonthlyTrendPoint {
  month: string;
  current: number;
  previous: number;
}

interface SummaryData {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  avgOrderValue: number;
  growthRate: number;
}

interface ReportData {
  summary: SummaryData;
  salesData: SalesDataPoint[];
  topProducts: TopProduct[];
  categoryData: CategoryDataPoint[];
  monthlyTrends: MonthlyTrendPoint[];
}

const SalesReportPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('month');
  const [loading, setLoading] = useState<boolean>(true);
  const [reportData, setReportData] = useState<ReportData>({
    summary: {
      totalSales: 0,
      totalOrders: 0,
      totalProducts: 0,
      avgOrderValue: 0,
      growthRate: 0
    },
    salesData: [],
    topProducts: [],
    categoryData: [],
    monthlyTrends: []
  });

  const api = axios.create({ baseURL: baseurl });
  const token = useGetToken("sellerToken");

  const fetchReportData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get<ReportData>(`/seller/sales-report?range=${timeRange}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Failed to load sales report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReportData();
    } else {
      toast.error('Authentication required');
    }
  }, [timeRange, token]);

  const handleTimeRangeChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setTimeRange(e.target.value);
  };

  const COLORS: string[] = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-2">
            {title.includes('Sales') || title.includes('Order Value') 
              ? `₹${value.toLocaleString()}` 
              : value.toLocaleString()}
          </h3>
          {title === 'Total Sales' && reportData.summary.growthRate !== 0 && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${reportData.summary.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {reportData.summary.growthRate >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              <span>{Math.abs(reportData.summary.growthRate)}% from last period</span>
            </div>
          )}
        </div>
        <div className={`p-3 ${color} text-white rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <SellerLayout 
        activePage="sales-report"
        title="Sales Analytics"
        subtitle="Track your sales performance and insights"
      >
        <div className="flex items-center justify-center h-96">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout 
      activePage="sales-report"
      title="Sales Analytics"
      subtitle="Track your sales performance and insights"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <select 
            value={timeRange} 
            onChange={handleTimeRangeChange} 
            className="px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
            <option value="quarter">Last 3 Months</option>
            <option value="year">This Year</option>
          </select>
          <button onClick={fetchReportData} className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <RefreshCw size={20} />
          </button>
          <button 
            onClick={() => {
              toast.success('Export feature coming soon!');
            }}
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
          >
            <Download size={20} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Sales" 
          value={reportData.summary.totalSales} 
          icon={<DollarSign size={24} />}
          color="bg-blue-500"
        />
        <StatCard 
          title="Total Orders" 
          value={reportData.summary.totalOrders} 
          icon={<ShoppingBag size={24} />}
          color="bg-green-500"
        />
        <StatCard 
          title="Products Sold" 
          value={reportData.summary.totalProducts} 
          icon={<Package size={24} />}
          color="bg-purple-500"
        />
        <StatCard 
          title="Avg Order Value" 
          value={reportData.summary.avgOrderValue} 
          icon={<Users size={24} />}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Sales Trend</h3>
            <div className="p-2 bg-blue-100 text-blue-500 rounded-lg">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={reportData.salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                    formatter={(value?: number) => [
                        `₹${(value ?? 0).toLocaleString()}`,
                        'Sales',
                    ]}
                    />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Sales (₹)"
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Orders"
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Category Distribution</h3>
            <div className="p-2 bg-green-100 text-green-500 rounded-lg">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={reportData.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ₹${entry.value.toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                 {reportData.categoryData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}

                </Pie>
                <Tooltip
                formatter={(value: number | undefined) => [
                    `₹${(value ?? 0).toLocaleString()}`,
                    'Revenue',
                    ]}
                    />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Top Selling Products</h3>
          <div className="p-2 bg-purple-100 text-purple-500 rounded-lg">
            <TrendingUp size={24} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Units Sold</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Revenue</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Growth</th>
              </tr>
            </thead>
            <tbody>
              {reportData.topProducts.length > 0 ? (
                reportData.topProducts.map((product, index) => (
                  <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image || 'https://via.placeholder.com/40?text=No+Image'} 
                          alt={product.name} 
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/40?text=No+Image';
                          }}
                        />
                        <div>
                          <p className="font-medium text-gray-800">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{product.unitsSold}</span>
                        <span className="text-sm text-gray-500">units</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-bold text-gray-800">₹{product.revenue.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className={`flex items-center gap-1 ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.growth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span className="font-medium">{Math.abs(product.growth)}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No products data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Monthly Performance</h3>
          <div className="p-2 bg-blue-100 text-blue-500 rounded-lg">
            <Calendar size={24} />
          </div>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                    formatter={(value?: number) => [
                        `₹${(value ?? 0).toLocaleString()}`,
                        'Revenue',
                    ]}
                    />
              <Legend />
              <Bar dataKey="current" fill="#8884d8" name="Current Month" radius={[4, 4, 0, 0]} />
              <Bar dataKey="previous" fill="#82ca9d" name="Previous Month" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SellerLayout>
  );
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
};

export default SalesReportPage;