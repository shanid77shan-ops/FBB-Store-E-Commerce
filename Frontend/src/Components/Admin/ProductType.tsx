import React, { useEffect, useState } from 'react';
import { PlusCircle, X, Upload } from 'lucide-react';
import { baseurl } from '../../Constant/Base';
import axios from "axios";

// Types
interface Category {
  _id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  status?: 'LISTED' | 'UNLISTED';
}

interface SubCategory extends Category {
  categoryId: Category;
  parentCategory?: Category;
}

interface ProductType extends Category {
  categoryId: Category;
  subCategoryId: SubCategory;
}

interface ProductTypeFormData {
  name: string;
  image: File | null;
  categoryId: string;
  subCategoryId: string;
}

const ProductType = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProductTypeFormData>({
    name: '',
    image: null,
    categoryId: '',
    subCategoryId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const api = axios.create({
    baseURL: baseurl,
  });

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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setFormData({
      ...formData,
      categoryId,
      subCategoryId: '', // Reset subcategory when category changes
    });
    
    // Filter subcategories based on selected category
    const filtered = subCategories.filter(
      (subCat) => subCat.categoryId._id === categoryId
    );
    setFilteredSubCategories(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('subCategoryId', formData.subCategoryId);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await api.post("/admin/add-type", formDataToSend);

      if (!response) {
        throw new Error('Failed to create product type');
      }

      await getProductTypes(); // Refresh product types after adding new one
      handleCloseModal();
    } catch (error) {
      console.error('Error creating product type:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', image: null, categoryId: '', subCategoryId: '' });
    setImagePreview(null);
    setFilteredSubCategories([]);
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
      const response = await api.get("/admin/get-subcategory");
      if (response.data && Array.isArray(response.data)) {
        setSubCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const getProductTypes = async () => {
    try {
      const response = await api.get("/admin/get-type");
      if (response.data && Array.isArray(response.data)) {
        setProductTypes(response.data);
      }
    } catch (error) {
      console.error('Error fetching product types:', error);
    }
  };

  useEffect(() => {
    getCategories();
    getSubCategories();
    getProductTypes();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, <span className="text-blue-600">Admin</span>
          </h1>
          <p className="text-gray-600 mt-2">Manage your product types</p>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 flex justify-between items-center border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Product Types</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <PlusCircle size={20} />
              <span>Add Product Type</span>
            </button>
          </div>

          <div className="overflow-x-auto p-6">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="pb-4 px-4 text-gray-600 font-semibold">Product Type Name</th>
                  <th className="pb-4 px-4 text-gray-600 font-semibold">Category</th>
                  <th className="pb-4 px-4 text-gray-600 font-semibold">Sub Category</th>
                  <th className="pb-4 px-4 text-gray-600 font-semibold">Image</th>
                  <th className="pb-4 px-4 text-gray-600 font-semibold">Created At</th>
                  <th className="pb-4 px-4 text-gray-600 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {productTypes.map((productType) => (
                  <tr
                    key={productType._id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 text-gray-800">{productType.name}</td>
                    <td className="py-4 px-4 text-gray-800">
                      {productType.categoryId?.name || 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-gray-800">
                      {productType.subCategoryId?.name || 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      <img 
                        src={productType.image} 
                        alt={productType.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {new Date(productType.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                          productType.status === 'LISTED'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {productType.status || 'UNLISTED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Product Type Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800">Add New Product Type</h3>
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
                    Category
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={handleCategoryChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    Sub Category
                  </label>
                  <select
                    value={formData.subCategoryId}
                    onChange={(e) => setFormData({ ...formData, subCategoryId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={!formData.categoryId}
                  >
                    <option value="">Select a sub category</option>
                    {filteredSubCategories.map((subCategory) => (
                      <option key={subCategory._id} value={subCategory._id}>
                        {subCategory.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Type Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Type Image
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-2 text-center">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="mx-auto h-32 w-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData({ ...formData, image: null });
                            }}
                            className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                              <span>Upload a file</span>
                              <input
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Creating...' : 'Create Product Type'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductType;