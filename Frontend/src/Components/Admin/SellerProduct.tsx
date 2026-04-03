import { useEffect, useMemo, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { baseurl } from '../../Constant/Base';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Category {
  _id: string;
  name: string;
}

interface SubCategory {
  _id: string;
  name: string;
  categoryId?: Category;
}

interface Product {
  _id: string;
  name: string;
  brand: string;
  categoryId?: Category;
  subCategoryId?: SubCategory;
  priceINR: number;
  priceAED: number;
  images?: {
    image1?: string;
    image2?: string;
    image3?: string;
    image4?: string;
  };
  trending: boolean;
  stock: number;
  active: boolean;
  soldCount: number;
  createdAt: string;
}

type SortField = 'createdAt' | 'name' | 'brand' | 'priceINR' | 'priceAED' | 'stock' | 'soldCount';

const SellerProducts = () => {
  const { id } = useParams();
  const api = useMemo(() => axios.create({ baseURL: baseurl }), []);

  const [products, setProducts] = useState<Product[]>([]);
  const [sellerName, setSellerName] = useState('Seller');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'trending'>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sellerRes, productsRes] = await Promise.all([
          api.get(`/admin/get-seller/${id}`),
          api.get(`/admin/get-products/${id}`)
        ]);

        const sellerData = sellerRes.data?.data || sellerRes.data;
        if (sellerData?.name) {
          setSellerName(sellerData.name);
        }

        const productsData = productsRes.data?.data || productsRes.data;
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching seller products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api, id]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === 'all' ||
        (filterStatus === 'active' && product.active) ||
        (filterStatus === 'inactive' && !product.active) ||
        (filterStatus === 'trending' && product.trending);

      return matchesSearch && matchesFilter;
    });
  }, [products, searchTerm, filterStatus]);

  const sortedProducts = useMemo(() => {
    const data = [...filteredProducts];
    data.sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      if (sortField === 'name' || sortField === 'brand') {
        aValue = (a[sortField] || '').toString().toLowerCase();
        bValue = (b[sortField] || '').toString().toLowerCase();
      } else if (sortField === 'createdAt') {
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
      } else {
        aValue = Number(a[sortField] || 0);
        bValue = Number(b[sortField] || 0);
      }

      if (aValue === bValue) return 0;
      if (sortDirection === 'asc') return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });
    return data;
  }, [filteredProducts, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedProducts.length);
  const currentItems = sortedProducts.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getMainImage = (images?: Product['images']) => {
    if (!images) return '';
    return images.image1 || images.image2 || images.image3 || images.image4 || '';
  };

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isMobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />

      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8">
        <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white p-4 shadow-md flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Seller Products</h1>
          <div className="w-9" />
        </div>

        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Products By {sellerName}</h1>
          <p className="text-gray-600 mt-1">Manage seller product listings</p>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative w-full md:max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search by product or brand"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value as 'all' | 'active' | 'inactive' | 'trending');
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="trending">Trending</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('name')}>Name <SortIndicator field="name" /></th>
                  <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('brand')}>Brand <SortIndicator field="brand" /></th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('priceINR')}>INR <SortIndicator field="priceINR" /></th>
                  <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('stock')}>Stock <SortIndicator field="stock" /></th>
                  <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('soldCount')}>Sold <SortIndicator field="soldCount" /></th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {!loading && currentItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 px-4 text-center text-gray-500">No products found</td>
                  </tr>
                )}

                {currentItems.map((product) => (
                  <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {getMainImage(product.images) ? (
                          <img src={getMainImage(product.images)} alt={product.name} className="w-10 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-100" />
                        )}
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{product.brand || 'N/A'}</td>
                    <td className="py-3 px-4">{product.categoryId?.name || 'N/A'}</td>
                    <td className="py-3 px-4">₹{Number(product.priceINR || 0).toLocaleString()}</td>
                    <td className="py-3 px-4">{product.stock || 0}</td>
                    <td className="py-3 px-4">{product.soldCount || 0}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${product.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 md:px-6 py-4 border-t border-gray-100 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="text-sm text-gray-600">
              Showing {sortedProducts.length === 0 ? 0 : startIndex + 1} to {endIndex} of {sortedProducts.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded border disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded border disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellerProducts;
