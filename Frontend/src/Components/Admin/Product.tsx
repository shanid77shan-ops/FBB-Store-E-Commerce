import { useEffect, useState } from 'react';
import { Search, Filter, Eye, Edit2, Trash2, TrendingUp } from 'lucide-react';
import { baseurl } from '../../Constant/Base';
import axios from "axios";

interface Category {
  _id: string;
  name: string;
}

interface SubCategory extends Category {
  categoryId: Category;
}

interface Seller {
  name: string;
  _id: string;
}

interface Product {
  _id: string;
  name: string;
  brand: string;
  categoryId: Category;
  subCategoryId: SubCategory;
  priceINR: number;
  priceAED: number;
  images: {
    image1?: string;
    image2?: string;
    image3?: string;
    image4?: string;
  };
  createdAt: string;
  updatedAt: string;
  trending: boolean;
  seller: Seller;
  stock: number;
  active: boolean;
}

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField] = useState<string>('createdAt');
  const [sortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [categories, setCategories] = useState<Category[]>([]);

  const api = axios.create({ baseURL: baseurl });

  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/get-products");
      if (response.data && Array.isArray(response.data)) {
        setProducts(response.data);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Map(
            response.data
              .filter(product => product.categoryId)
              .map(product => [product.categoryId._id, product.categoryId])
          ).values()
        );
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrendingToggle = async (productId: string, currentValue: boolean) => {
    try {
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product._id === productId
            ? { ...product, trending: !currentValue }
            : product
        )
      );
      
      await api.put(`/admin/update-trending/${productId}`);
    } catch (error) {
      console.error('Error updating trending status:', error);
      setProducts(products); // Revert on error
    }
  };

  const handleStatusToggle = async (productId: string, currentValue: boolean) => {
    try {
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product._id === productId
            ? { ...product, active: !currentValue }
            : product
        )
      );
      
      // Add your status update endpoint here
      // await api.put(`/admin/update-status/${productId}`, { active: !currentValue });
    } catch (error) {
      console.error('Error updating status:', error);
      setProducts(products); // Revert on error
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || 
      product.categoryId?._id === filterCategory;
    
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && product.active) ||
      (filterStatus === 'inactive' && !product.active);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue: any;
    let bValue: any;
    
    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'seller':
        aValue = a.seller?.name?.toLowerCase() || '';
        bValue = b.seller?.name?.toLowerCase() || '';
        break;
      case 'brand':
        aValue = a.brand.toLowerCase();
        bValue = b.brand.toLowerCase();
        break;
      case 'category':
        aValue = a.categoryId?.name?.toLowerCase() || '';
        bValue = b.categoryId?.name?.toLowerCase() || '';
        break;
      case 'priceINR':
        aValue = a.priceINR;
        bValue = b.priceINR;
        break;
      case 'stock':
        aValue = a.stock;
        bValue = b.stock;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortDirection === 'asc'
        ? (aValue > bValue ? 1 : -1)
        : (aValue < bValue ? 1 : -1);
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const getMainImage = (images: Product['images']) => {
    return images?.image1 || Object.values(images || {}).find(img => img) || '';
  };


  useEffect(() => {
    getProducts();
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
          <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
          <p className="text-gray-600 mt-1">Manage all products in your store</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm">
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="search"
                placeholder="Search products by name, brand, or seller..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Seller</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trending</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.length > 0 ? (
                currentItems.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          src={getMainImage(product.images)} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg mr-3"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9IiNGOEY4RjgiLz48cGF0aCBkPSJNMzEgMTlDMjIuMzgzIDE5IDE1LjUgMjUuODgzIDE1LjUgMzQuNUMxNS41IDQzLjExNyAyMi4zODMgNTAgMzEgNTBDMzkuNjE3IDUwIDQ2LjUgNDMuMTE3IDQ2LjUgMzQuNUM0Ni41IDI1Ljg4MyAzOS42MTcgMTkgMzEgMTlaTTMxIDQ0LjVDMjQuMDE3IDQ0LjUgMTguNSAzOC45ODMgMTguNSAzM0MxOC41IDI3LjAxNyAyNC4wMTcgMjEuNSAzMSAyMS41QzM3Ljk4MyAyMS41IDQzLjUgMjcuMDE3IDQzLjUgMzNDNDMuNSAzOC45ODMgMzcuOTgzIDQ0LjUgMzEgNDQuNVpNNDEuMjUgMTcuNUM0Mi41MzMgMTcuNTUgNDMuNSAxNi42MTcgNDMuNSAxNS4zMzNINDMuNEM0My40IDEyLjI1IDQxLjIgOCA0MS4yIDhDMzkuOTY3IDggMzguOSA4LjYgMzguMyA5LjY2N0MzNy43IDguNiAzNi42MzMgOCAzNS40IDhDMzUuNCA4IDMzLjIgMTIuMjUgMzMuMiAxNS4zMzNIMzMuNUMzMy41IDE2LjYxNyAzNC40NjcgMTcuNTUgMzUuNzUgMTcuNUMzNS43NSAxNy41IDM4LjUgMTMgMzguNSAxN0M0MC4xIDIxLjYgNDEuMjUgMTcuNSA0MS4yNSAxNy41WiIgZmlsbD0iI0NEQ0RCOCIvPjwvc3ZnPg==';
                          }}
                        />
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{product.seller?.name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="text-sm text-gray-700">
                        <div>{product.categoryId?.name || 'N/A'}</div>
                        {product.subCategoryId && (
                          <div className="text-xs text-gray-500">{product.subCategoryId.name}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">₹{product.priceINR.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">AED {product.priceAED.toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        product.stock > 10 
                          ? 'bg-green-100 text-green-700'
                          : product.stock > 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock} units
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleStatusToggle(product._id, product.active)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          product.active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {product.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTrendingToggle(product._id, product.trending)}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          product.trending
                            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <TrendingUp size={14} />
                        {product.trending ? 'Trending' : 'Normal'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="text-gray-400 mb-4">No products found</div>
                    {(searchTerm || filterCategory !== 'all' || filterStatus !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setFilterCategory('all');
                          setFilterStatus('all');
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {currentItems.length > 0 && (
          <div className="px-6 py-4 border-t">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedProducts.length)} of {sortedProducts.length} products
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
          <div className="text-2xl font-bold text-gray-800">
            {products.filter(p => p.trending).length}
          </div>
          <div className="text-sm text-gray-600 mt-1">Trending Products</div>
          <div className="text-xs text-blue-600 mt-2">
            {((products.filter(p => p.trending).length / products.length) * 100 || 0).toFixed(1)}% of total
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl">
          <div className="text-2xl font-bold text-gray-800">
            {products.filter(p => p.active).length}
          </div>
          <div className="text-sm text-gray-600 mt-1">Active Products</div>
          <div className="text-xs text-green-600 mt-2">
            {((products.filter(p => p.active).length / products.length) * 100 || 0).toFixed(1)}% of total
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl">
          <div className="text-2xl font-bold text-gray-800">
            {categories.length}
          </div>
          <div className="text-sm text-gray-600 mt-1">Categories</div>
          <div className="text-xs text-purple-600 mt-2">Active categories</div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;