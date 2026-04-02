import React, { useEffect, useState } from 'react';
import { PlusCircle, X, Upload, Edit2, Search, Trash2 } from 'lucide-react';
import { baseurl } from '../../Constant/Base';
import axios from "axios";

interface Category {
  _id: string;
  name: string;
  image: string;
}

interface SubCategory {
  _id: string;
  name: string;
  image: string;
  categoryId: Category | null; // Allow null
  createdAt: string;
  updatedAt: string;
}

interface SubCategoryFormData {
  name: string;
  image: File | null;
  categoryId: string;
}

const SubCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<SubCategoryFormData>({
    name: '',
    image: null,
    categoryId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubCategoryId, setCurrentSubCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);

  const api = axios.create({ baseURL: baseurl });

  // Safe filtering with null checks
  const filteredSubCategories = subCategories.filter(subCat => {
    const searchTermLower = searchTerm.toLowerCase();
    const subCatName = subCat.name?.toLowerCase() || '';
    const categoryName = subCat.categoryId?.name?.toLowerCase() || '';
    
    return subCatName.includes(searchTermLower) || 
           categoryName.includes(searchTermLower);
  });

  const totalPages = Math.ceil(filteredSubCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSubCats = filteredSubCategories.slice(startIndex, startIndex + itemsPerPage);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert('Please select a parent category');
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('categoryId', formData.categoryId);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (isEditing && currentSubCategoryId) {
        await api.put(`/admin/edit-subcategory/${currentSubCategoryId}`, formDataToSend);
      } else {
        await api.post("/admin/add-subcategory", formDataToSend);
      }

      await getSubCategories();
      handleCloseModal();
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} subcategory:`, error);
      alert(`Failed to ${isEditing ? 'update' : 'create'} subcategory. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (subCategory: SubCategory) => {
    setIsEditing(true);
    setCurrentSubCategoryId(subCategory._id);
    setFormData({
      name: subCategory.name,
      image: null,
      categoryId: subCategory.categoryId?._id || '',
    });
    setImagePreview(subCategory.image);
    setIsModalOpen(true);
  };

  const handleDelete = async (_subCategoryId: string) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      try {
        // Add delete endpoint in your backend
        // await api.delete(`/admin/delete-subcategory/${subCategoryId}`);
        await getSubCategories();
      } catch (error) {
        console.error('Error deleting subcategory:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentSubCategoryId(null);
    setFormData({ name: '', image: null, categoryId: '' });
    setImagePreview(null);
  };

  const getCategories = async () => {
    try {
      const response = await api.get("/admin/get-category");
      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getSubCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/get-subcategory");
      if (response.data && Array.isArray(response.data)) {
        // Filter out any null categoryIds or add default values
        const processedData = response.data.map((item: any) => ({
          ...item,
          categoryId: item.categoryId || null // Ensure categoryId is null if missing
        }));
        setSubCategories(processedData);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
    getSubCategories();
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
          <h1 className="text-2xl font-bold text-gray-800">Sub-Category Management</h1>
          <p className="text-gray-600 mt-1">Manage product subcategories</p>
        </div>
        <button 
          onClick={() => {
            setIsEditing(false);
            setCurrentSubCategoryId(null);
            setFormData({ name: '', image: null, categoryId: '' });
            setImagePreview(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm"
        >
          <PlusCircle size={20} />
          <span>Add Sub-Category</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="search"
                placeholder="Search subcategories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600">
                {filteredSubCategories.length} subcategories
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sub-Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Parent Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentSubCats.length > 0 ? (
                currentSubCats.map((subCategory) => (
                  <tr key={subCategory._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{subCategory.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {subCategory.categoryId ? (
                          <>
                            <img 
                              src={subCategory.categoryId.image} 
                              alt={subCategory.categoryId.name}
                              className="w-8 h-8 object-cover rounded-full mr-2"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                const parent = (e.target as HTMLImageElement).parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500 mr-2">${subCategory.categoryId?.name?.charAt(0) || 'N'}</div>`;
                                }
                              }}
                            />
                            <span className="text-sm text-gray-700">{subCategory.categoryId.name}</span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500 italic">No category assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <img 
                        src={subCategory.image} 
                        alt={subCategory.name}
                        className="w-16 h-16 object-cover rounded-lg border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNGOEY4RjgiLz48cGF0aCBkPSJNNDIgMjZDMjkuODUxIDI2IDIwIDM1Ljg1MSAyMCA0OEMyMCA2MC4xNDkgMjkuODUxIDcwIDQyIDcwQzU0LjE0OSA3MCA2NCA2MC4xNDkgNjQgNDhDNjQgMzUuODUxIDU0LjE0OSAyNiA0MiAyNlpNNDIgNTkuMzMzQzMzLjQyMiA1OS4zMzMgMjYuNDY3IDUyLjM3OCAyNi40NjcgNDRDMjYuNDY3IDM1LjYyMiAzMy40MjIgMjguNjY3IDQyIDI4LjY2N0M1MC41NzggMjguNjY3IDU3LjUzMyAzNS42MjIgNTcuNTMzIDQ0QzU3LjUzMyA1Mi4zNzggNTAuNTc4IDU5LjMzMyA0MiA1OS4zMzNaTTU1LjA2NyAyMy4zMzNMNTUuNzMxIDI0LjM3MUM1Ni40MjggMjUuNDY4IDU2LjgxNSAyNi43MyA1Ni44MTUgMjhDNjAuMTA5IDI4LjY4MiA2Mi41MzMgMzEuNzU2IDYyLjUzMyAzNS40NzdINUuNDY3QzUuNDY3IDMxLjc1NiA3Ljg5MSAyOC42ODIgMTEuMTg1IDI4QzExLjE4NSAyNi43MyAxMS41NzIgMjUuNDY4IDEyLjI2OSAyNC4zNzFMMTIuOTMzIDIzLjMzM0MxMi45MzMgMTkuNjEyIDE2LjAxIDExLjY2NyAyMiAxMC4xNjZDMjIgOC4wMSAyMy4wNjcgNCAzMiA0QzQwLjkzMyA0IDQyIDguMDEgNDIgMTAuMTY2QzQ3Ljk5IDExLjY2NyA1MS4wNjcgMTkuNjEyIDUxLjA2NyAyMy4zMzNaIiBmaWxsPSIjQ0RDREI4Ii8+PC9zdmc+';
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(subCategory)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(subCategory._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="text-gray-400 mb-4">No subcategories found</div>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Clear search
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {currentSubCats.length > 0 && totalPages > 1 && (
            <div className="px-6 py-4 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
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
                      let pageNum: string | number | bigint | boolean | ((prevState: number) => number) | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined;
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
      </div>

      {/* Add/Edit SubCategory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex justify-between items-center p-6 border-b bg-white z-10">
              <h3 className="text-xl font-semibold text-gray-800">
                {isEditing ? 'Edit Sub-Category' : 'Add New Sub-Category'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Category *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub-Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter subcategory name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub-Category Image
                </label>
                <div className="mt-1">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData({ ...formData, image: null });
                        }}
                        className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                      <div className="space-y-2 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex flex-col items-center">
                          <span className="text-sm text-gray-600">
                            <span className="font-medium text-blue-600">Click to upload</span>
                            {' '}or drag and drop
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </div>
                  ) : (
                    isEditing ? 'Update Sub-Category' : 'Create Sub-Category'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategory;