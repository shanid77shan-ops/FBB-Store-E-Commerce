<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { PlusCircle, X, Upload, Edit2, Search, ChevronLeft, ChevronRight, Trash2, Menu, LogOut, Film, Image, Package, Tag, Scale, Ruler, Palette, Diamond, Shield, Hash, BarChart3, ShoppingBag, TrendingUp, DollarSign, Phone } from 'lucide-react';
=======
// pages/SellerProducts.tsx
import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, X, Upload, Edit2, Search, ChevronLeft, ChevronRight, 
  Trash2, Film, Image, Package, Tag, Scale, Ruler, Palette, 
  Diamond, Shield, Hash
} from 'lucide-react';
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
import { baseurl } from '../../Constant/Base';
import axios from "axios";
import ExtractToken from '../../Token/Extract';
import { useGetToken } from '../../Token/getToken';
import { toast } from 'react-hot-toast'; 
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
=======
import { SellerLayout } from '../Layouts/SellerLayout';
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae

interface Category {
  _id: string;
  name: string;
}

interface SubCategory extends Category {
  categoryId: Category;
}

interface Product {
  _id: string;
  name: string;
  brand: string;
  categoryId: Category;
  subCategoryId: SubCategory;
  priceINR: number;
  priceAED: number;
  stock: number;
  lowStockThreshold: number;
  sku: string;
  shortDescription: string;
  specifications: Map<string, string>;
  weight: {
    value: number;
    unit: string;
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  colors: string[];
  sizes: string[];
  material: string;
  warranty: {
    period: number;
    unit: string;
    description: string;
  };
  tags: string[];
  images: string[];
  videos: string[];
  description: string;
  trending: boolean;
  featured: boolean;
  discount: {
    percentage: number;
    amount: number;
    startDate: string;
    endDate: string;
  };
  shippingInfo: {
    weightBased: boolean;
    freeShipping: boolean;
    shippingCost: number;
  };
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

interface Seller {
  name: string;
  status: boolean;
}

interface MediaFile {
  file: File | null;
  type: 'image' | 'video';
  preview: string;
}

interface ProductFormData {
  name: string;
  brand: string;
  sku: string;
  categoryId: string;
  subCategoryId: string;
  priceINR: string;
  priceAED: string;
  stock: string;
  lowStockThreshold: string;
  shortDescription: string;
  specifications: { key: string; value: string }[];
  weightValue: string;
  weightUnit: string;
  length: string;
  width: string;
  height: string;
  dimensionUnit: string;
  colors: string;
  sizes: string;
  material: string;
  warrantyPeriod: string;
  warrantyUnit: string;
  warrantyDescription: string;
  tags: string;
  mediaFiles: MediaFile[];
  existingImages: string[];
  existingVideos: string[];
  description: string;
  isTrending: boolean;
  isFeatured: boolean;
  discountPercentage: string;
  discountAmount: string;
  discountStartDate: string;
  discountEndDate: string;
  weightBasedShipping: boolean;
  freeShipping: boolean;
  shippingCost: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

const SellerProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>(['', '', '', '']);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
<<<<<<< HEAD
  const [sidebarOpen, setSidebarOpen] = useState(false);
=======
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae

  const api = axios.create({
    baseURL: baseurl,
  });
<<<<<<< HEAD
  
  const [seller, setSeller] = useState<Seller>({ name: "", status: false });
  const navigate = useNavigate();

  const token = useGetToken("sellerToken");
  const sellerId = ExtractToken(token);
=======

  
  const [seller, setSeller] = useState<Seller>({ name: "", status: false });

  const token = useGetToken("sellerToken");
  const sellerId = ExtractToken(token);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    brand: '',
    sku: '',
    categoryId: '',
    subCategoryId: '',
    priceINR: '',
    priceAED: '',
    stock: '',
    lowStockThreshold: '10',
    shortDescription: '',
    specifications: [],
    weightValue: '',
    weightUnit: 'g',
    length: '',
    width: '',
    height: '',
    dimensionUnit: 'cm',
    colors: '',
    sizes: '',
    material: '',
    warrantyPeriod: '',
    warrantyUnit: 'months',
    warrantyDescription: '',
    tags: '',
    mediaFiles: [
      { file: null, type: 'image', preview: '' },
      { file: null, type: 'image', preview: '' },
      { file: null, type: 'image', preview: '' },
      { file: null, type: 'image', preview: '' }
    ],
    existingImages: [],
    existingVideos: [],
    description: '',
    isTrending: false,
    isFeatured: false,
    discountPercentage: '',
    discountAmount: '',
    discountStartDate: '',
    discountEndDate: '',
    weightBasedShipping: false,
    freeShipping: false,
    shippingCost: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  });

>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    brand: '',
    sku: '',
    categoryId: '',
    subCategoryId: '',
    priceINR: '',
    priceAED: '',
    stock: '',
    lowStockThreshold: '10',
    shortDescription: '',
    specifications: [],
    weightValue: '',
    weightUnit: 'g',
    length: '',
    width: '',
    height: '',
    dimensionUnit: 'cm',
    colors: '',
    sizes: '',
    material: '',
    warrantyPeriod: '',
    warrantyUnit: 'months',
    warrantyDescription: '',
    tags: '',
    mediaFiles: [
      { file: null, type: 'image', preview: '' },
      { file: null, type: 'image', preview: '' },
      { file: null, type: 'image', preview: '' },
      { file: null, type: 'image', preview: '' }
    ],
    existingImages: [],
    existingVideos: [],
    description: '',
    isTrending: false,
    isFeatured: false,
    discountPercentage: '',
    discountAmount: '',
    discountStartDate: '',
    discountEndDate: '',
    weightBasedShipping: false,
    freeShipping: false,
    shippingCost: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  });

  const getSeller = async () => {
    try {
<<<<<<< HEAD
      const response = await api.get(`/seller/profile/${sellerId.userId}`);
      console.log(response)
=======
      const response = await api.get(`/seller/profile/${sellerId.userId}`,{
        headers: { Authorization: `Bearer ${token}` }

      });
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
      setSeller({
        name: response.data.data.name,
        status: response.data.data.status 
      });
    } catch (error) {
      console.error('Error fetching seller:', error);
      toast.error('Failed to fetch seller information');
    }
  };

  const handleDeleteClick = (productId: string) => {
    if (!seller.status) {
      toast.error('Your account is pending approval. Please contact admin for more information.');
      return;
    }
    setProductToDelete(productId);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
  
    try {
      await api.delete(`/seller/delete-product/${productToDelete}`,{
        headers: { Authorization: `Bearer ${token}` }

      });
      toast.success('Product deleted successfully');
      
      setProducts(prevProducts => prevProducts.filter(product => product._id !== productToDelete));
      
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleAddNewClick = () => {
    if (!seller.status) {
      toast.error('Your account is pending approval. Please contact admin for more information.');
      return;
    }
    setIsModalOpen(true);
  };

  const getCategories = async () => {
    try {
      const response = await api.get("/admin/get-category",{
        headers: { Authorization: `Bearer ${token}` }

      });
      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getSubCategories = async () => {
    try {
      const response = await api.get("/admin/get-subcategory",{
        headers: { Authorization: `Bearer ${token}` }

      });
      if (response.data && Array.isArray(response.data)) {
        setSubCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const getProducts = async () => {
    try {
      const response = await api.get(`/seller/get-products/${sellerId.userId}`,{
        headers: { Authorization: `Bearer ${token}` }

      });
      if (response.data.products && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setFormData({
      ...formData,
      categoryId,
      subCategoryId: '',
    });
    
    const filtered = subCategories.filter(subCat => {
      if (typeof subCat.categoryId === 'object' && subCat.categoryId !== null) {
        return subCat.categoryId._id === categoryId;
      }
      return subCat.categoryId === categoryId;
    });
    
    setFilteredSubCategories(filtered);
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, mediaType: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      
      const newMediaFiles = [...formData.mediaFiles];
      newMediaFiles[index] = {
        file,
        type: mediaType,
        preview: previewUrl
      };
      
      if (mediaType === 'image') {
        const newExistingImages = [...formData.existingImages];
        newExistingImages[index] = '';
        
        setFormData(prev => ({
          ...prev,
          mediaFiles: newMediaFiles,
          existingImages: newExistingImages
        }));
      } else {
        const newExistingVideos = [...formData.existingVideos];
        newExistingVideos[index - formData.existingImages.length] = '';
        
        setFormData(prev => ({
          ...prev,
          mediaFiles: newMediaFiles,
          existingVideos: newExistingVideos
        }));
      }
      
      const newPreviews = [...mediaPreviews];
      newPreviews[index] = previewUrl;
      setMediaPreviews(newPreviews);
    }
  };

  const removeMedia = (index: number) => {
    const newMediaFiles = [...formData.mediaFiles];
    newMediaFiles[index] = { file: null, type: 'image', preview: '' };

    const isImage = index < formData.existingImages.length;
    
    if (isImage) {
      const newExistingImages = [...formData.existingImages];
      newExistingImages[index] = '';
      
      setFormData(prev => ({
        ...prev,
        mediaFiles: newMediaFiles,
        existingImages: newExistingImages
      }));
    } else {
      const videoIndex = index - formData.existingImages.length;
      const newExistingVideos = [...formData.existingVideos];
      newExistingVideos[videoIndex] = '';
      
      setFormData(prev => ({
        ...prev,
        mediaFiles: newMediaFiles,
        existingVideos: newExistingVideos
      }));
    }
    
    const newPreviews = [...mediaPreviews];
    newPreviews[index] = '';
    setMediaPreviews(newPreviews);
  };

  const toggleMediaType = (index: number) => {
    const newMediaFiles = [...formData.mediaFiles];
    const currentType = newMediaFiles[index].type;
    newMediaFiles[index] = { 
      ...newMediaFiles[index], 
      type: currentType === 'image' ? 'video' : 'image'
    };
    
    setFormData(prev => ({
      ...prev,
      mediaFiles: newMediaFiles
    }));
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const removeSpecification = (index: number) => {
    const newSpecs = [...specifications];
    newSpecs.splice(index, 1);
    setSpecifications(newSpecs);
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const handleEdit = (product: Product) => {
    if (!seller.status) {
      toast.error('Your account is pending approval. Please contact admin for more information.');
      return;
    }
    
    setEditingProduct(product._id);
    
    const imageArray = Array.isArray(product.images) 
      ? product.images 
      : Object.values(product.images || {});
      
    const videoArray = Array.isArray(product.videos) 
      ? product.videos 
      : Object.values(product.videos || {});
    
    const initialMediaFiles: MediaFile[] = [
      { file: null, type: 'image', preview: '' },
      { file: null, type: 'image', preview: '' },
      { file: null, type: 'image', preview: '' },
      { file: null, type: 'image', preview: '' }
    ];
    
    const previews = Array(4).fill('');
    
    imageArray.forEach((url, index) => {
      if (index < 4) {
        initialMediaFiles[index].type = 'image';
        previews[index] = url;
      }
    });
    
    videoArray.forEach((url, index) => {
      const mediaIndex = imageArray.length + index;
      if (mediaIndex < 4) {
        initialMediaFiles[mediaIndex].type = 'video';
        previews[mediaIndex] = url;
      }
    });
    
    setMediaPreviews(previews);
    
    const specArray = [];
    if (product.specifications) {
      for (const [key, value] of Object.entries(product.specifications)) {
        specArray.push({ key, value });
      }
    }
    setSpecifications(specArray);
  
    setFormData({
      name: product.name,
      brand: product.brand,
      sku: product.sku || '',
      categoryId: product.categoryId._id,
      subCategoryId: product.subCategoryId._id,
      priceINR: product.priceINR.toString(),
      priceAED: product.priceAED.toString(),
      stock: product.stock.toString(),
      lowStockThreshold: product.lowStockThreshold?.toString() || '10',
      shortDescription: product.shortDescription || '',
      specifications: specArray,
      weightValue: product.weight?.value?.toString() || '',
      weightUnit: product.weight?.unit || 'g',
      length: product.dimensions?.length?.toString() || '',
      width: product.dimensions?.width?.toString() || '',
      height: product.dimensions?.height?.toString() || '',
      dimensionUnit: product.dimensions?.unit || 'cm',
      colors: product.colors?.join(', ') || '',
      sizes: product.sizes?.join(', ') || '',
      material: product.material || '',
      warrantyPeriod: product.warranty?.period?.toString() || '',
      warrantyUnit: product.warranty?.unit || 'months',
      warrantyDescription: product.warranty?.description || '',
      tags: product.tags?.join(', ') || '',
      mediaFiles: initialMediaFiles,
      existingImages: imageArray as string[],
      existingVideos: videoArray as string[],
      description: product.description || '',
      isTrending: product.trending || false,
      isFeatured: product.featured || false,
      discountPercentage: product.discount?.percentage?.toString() || '',
      discountAmount: product.discount?.amount?.toString() || '',
      discountStartDate: product.discount?.startDate || '',
      discountEndDate: product.discount?.endDate || '',
      weightBasedShipping: product.shippingInfo?.weightBased || false,
      freeShipping: product.shippingInfo?.freeShipping || false,
      shippingCost: product.shippingInfo?.shippingCost?.toString() || '',
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || '',
      metaKeywords: product.metaKeywords?.join(', ') || ''
    });
  
    const filtered = subCategories.filter(subCat => {
      if (typeof subCat.categoryId === 'object' && subCat.categoryId !== null) {
        return subCat.categoryId._id === product.categoryId._id;
      }
      return subCat.categoryId === product.categoryId._id;
    });
    
    setFilteredSubCategories(filtered);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seller.status) {
      toast.error('Your account is pending approval. Please contact admin for more information.');
      return;
    }
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('sku', formData.sku);
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('subCategoryId', formData.subCategoryId);
      formDataToSend.append('priceINR', formData.priceINR);
      formDataToSend.append('priceAED', formData.priceAED);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('lowStockThreshold', formData.lowStockThreshold);
      formDataToSend.append('shortDescription', formData.shortDescription);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('isTrending', formData.isTrending.toString());
      formDataToSend.append('isFeatured', formData.isFeatured.toString());
      formDataToSend.append('specifications', JSON.stringify(specifications));
      formDataToSend.append('weightValue', formData.weightValue);
      formDataToSend.append('weightUnit', formData.weightUnit);
      formDataToSend.append('length', formData.length);
      formDataToSend.append('width', formData.width);
      formDataToSend.append('height', formData.height);
      formDataToSend.append('dimensionUnit', formData.dimensionUnit);
      formDataToSend.append('colors', formData.colors);
      formDataToSend.append('sizes', formData.sizes);
      formDataToSend.append('material', formData.material);
      formDataToSend.append('warrantyPeriod', formData.warrantyPeriod);
      formDataToSend.append('warrantyUnit', formData.warrantyUnit);
      formDataToSend.append('warrantyDescription', formData.warrantyDescription);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('discountPercentage', formData.discountPercentage);
      formDataToSend.append('discountAmount', formData.discountAmount);
      formDataToSend.append('discountStartDate', formData.discountStartDate);
      formDataToSend.append('discountEndDate', formData.discountEndDate);
      formDataToSend.append('weightBasedShipping', formData.weightBasedShipping.toString());
      formDataToSend.append('freeShipping', formData.freeShipping.toString());
      formDataToSend.append('shippingCost', formData.shippingCost);
      formDataToSend.append('metaTitle', formData.metaTitle);
      formDataToSend.append('metaDescription', formData.metaDescription);
      formDataToSend.append('metaKeywords', formData.metaKeywords);
      formDataToSend.append("sellerId", sellerId.userId);
      
      const nonEmptyExistingImages = formData.existingImages.filter(url => url !== '');
      formDataToSend.append('existingImages', JSON.stringify(nonEmptyExistingImages));
      
      const nonEmptyExistingVideos = formData.existingVideos.filter(url => url !== '');
      formDataToSend.append('existingVideos', JSON.stringify(nonEmptyExistingVideos));
      
      let imageCount = 0;
      let videoCount = 0;
      
      formData.mediaFiles.forEach((media) => {
        if (media.file) {
          if (media.type === 'image') {
            formDataToSend.append(`image${imageCount + 1}`, media.file);
            imageCount++;
          } else {
            formDataToSend.append(`video${videoCount + 1}`, media.file);
            videoCount++;
          }
        }
      });
      
      if (editingProduct) {
        await api.put(`/seller/edit-product/${editingProduct}`, formDataToSend,{
          headers: { Authorization: `Bearer ${token}` }

        });
      } else {
<<<<<<< HEAD
        await api.post("/seller/add-product", formDataToSend);
=======
        await api.post("/seller/add-product", formDataToSend,{
                  headers: { Authorization: `Bearer ${token}` }

        });
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
      }
      
      await getProducts();
      handleCloseModal();
      toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setActiveTab('basic');
    setSpecifications([]);
    setFormData({
      name: '',
      brand: '',
      sku: '',
      categoryId: '',
      subCategoryId: '',
      priceINR: '',
      priceAED: '',
      stock: '',
      lowStockThreshold: '10',
      shortDescription: '',
      specifications: [],
      weightValue: '',
      weightUnit: 'g',
      length: '',
      width: '',
      height: '',
      dimensionUnit: 'cm',
      colors: '',
      sizes: '',
      material: '',
      warrantyPeriod: '',
      warrantyUnit: 'months',
      warrantyDescription: '',
      tags: '',
      mediaFiles: [
        { file: null, type: 'image', preview: '' },
        { file: null, type: 'image', preview: '' },
        { file: null, type: 'image', preview: '' },
        { file: null, type: 'image', preview: '' }
      ],
      existingImages: [],
      existingVideos: [],
      description: '',
      isTrending: false,
      isFeatured: false,
      discountPercentage: '',
      discountAmount: '',
      discountStartDate: '',
      discountEndDate: '',
      weightBasedShipping: false,
      freeShipping: false,
      shippingCost: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: ''
    });
    setMediaPreviews(['', '', '', '']);
    setFilteredSubCategories([]);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'brand':
        aValue = a.brand;
        bValue = b.brand;
        break;
      case 'sku':
        aValue = a.sku;
        bValue = b.sku;
        break;
      case 'stock':
        aValue = a.stock;
        bValue = b.stock;
        break;
      case 'category':
        aValue = a.categoryId.name;
        bValue = b.categoryId.name;
        break;
      case 'priceINR':
        aValue = a.priceINR;
        bValue = b.priceINR;
        break;
      case 'priceAED':
        aValue = a.priceAED;
        bValue = b.priceAED;
        break;
      default:
        aValue = a.name;
        bValue = b.name;
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  const SortIndicator = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };
<<<<<<< HEAD

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("sellerToken");
    navigate('/seller/login');
  };
=======
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
  
  useEffect(() => {
    getSeller();
    getProducts();
    getCategories();
    getSubCategories();
  }, []);

<<<<<<< HEAD
  const Sidebar = () => (
    <aside className="w-full bg-white h-full flex flex-col">
      <div className="p-6 flex-1">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">FBB STORE</h1>
          <p className="text-sm text-gray-500 mt-1">Seller Dashboard</p>
        </div>
        
        <nav className="space-y-1">
          <button 
            onClick={() => navigate('/seller/dashboard')}
            className="w-full text-left py-3 px-4 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center space-x-3"
          >
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => navigate('/seller/products')}
            className="w-full text-left py-3 px-4 rounded-lg bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition-all flex items-center space-x-3"
          >
            <Package size={20} />
            <span>Products</span>
          </button>
          <button 
            onClick={() => navigate('/seller/orders')}
            className="w-full text-left py-3 px-4 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center space-x-3"
          >
            <ShoppingBag size={20} />
            <span>Orders</span>
          </button>
          <button 
            onClick={() => navigate('/seller/sales-report')}
            className="w-full text-left py-3 px-4 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center space-x-3"
          >
            <TrendingUp size={20} />
            <span>Sales Report</span>
          </button>
        </nav>
      </div>
      
      <div className="p-6 border-t border-gray-200 space-y-3">
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
    </aside>
  );
  console.log(seller)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className={`fixed lg:relative inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex justify-between items-center p-4 lg:hidden">
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
            <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100">
              <X size={24} />
            </button>
          </div>
          <Sidebar />
        </div>
          
        <main className="flex-1 p-4 lg:p-8">
          <div className="mb-6 flex items-center justify-between lg:justify-end">
            <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 lg:hidden">Products</h1>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 hidden lg:block">Manage Products</h1>
            <p className="text-gray-600 mt-2 hidden lg:block">Welcome, <span className="text-blue-600">{seller.name}</span></p>
          </div>
          
          {!seller.status && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
              Your account is pending approval from admin. You can view your products but cannot add or edit them.
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 flex flex-col md:flex-row justify-between items-center border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">Products</h2>
              
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <div className="relative flex-grow md:max-w-md">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                
                <button 
                  onClick={handleAddNewClick}
                  className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    seller.status 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!seller.status}
                >
                  <PlusCircle size={20} />
                  <span>Add Product</span>
                </button>
              </div>
            </div>
  
            <div className="overflow-x-auto p-6">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    <th 
                      className="pb-4 px-4 text-gray-600 font-semibold cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      Product Name <SortIndicator field="name" />
                    </th>
                    <th 
                      className="pb-4 px-4 text-gray-600 font-semibold cursor-pointer"
                      onClick={() => handleSort('brand')}
                    >
                      Brand <SortIndicator field="brand" />
                    </th>
                    <th 
                      className="pb-4 px-4 text-gray-600 font-semibold cursor-pointer"
                      onClick={() => handleSort('sku')}
                    >
                      SKU <SortIndicator field="sku" />
                    </th>
                    <th 
                      className="pb-4 px-4 text-gray-600 font-semibold cursor-pointer"
                      onClick={() => handleSort('category')}
                    >
                      Category <SortIndicator field="category" />
                    </th>
                    <th 
                      className="pb-4 px-4 text-gray-600 font-semibold cursor-pointer"
                      onClick={() => handleSort('stock')}
                    >
                      Stock <SortIndicator field="stock" />
                    </th>
                    <th 
                      className="pb-4 px-4 text-gray-600 font-semibold cursor-pointer"
                      onClick={() => handleSort('priceINR')}
                    >
                      Price (INR) <SortIndicator field="priceINR" />
                    </th>
                    <th 
                      className="pb-4 px-4 text-gray-600 font-semibold cursor-pointer"
                      onClick={() => handleSort('priceAED')}
                    >
                      Price (AED) <SortIndicator field="priceAED" />
                    </th>
                    <th className="pb-4 px-4 text-gray-600 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((product) => (
                      <tr
                        key={product._id}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4 text-gray-800">{product.name}</td>
                        <td className="py-4 px-4 text-gray-800">{product.brand}</td>
                        <td className="py-4 px-4 text-gray-800 font-mono">{product.sku}</td>
                        <td className="py-4 px-4 text-gray-800">{product.categoryId.name}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock <= 0 ? 'bg-red-100 text-red-800' :
                            product.stock <= product.lowStockThreshold ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {product.stock} units
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-800">₹{product.priceINR}</td>
                        <td className="py-4 px-4 text-gray-800">AED {product.priceAED}</td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-3">
                            <button 
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit2 size={20} />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleDeleteClick(product._id)}
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-4 px-4 text-center text-gray-500">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {deleteModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-md w-full p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Confirm Delete
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this product? This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => {
                        setDeleteModalOpen(false);
                        setProductToDelete(null);
                      }}
                      className="px-4 py-2 text-gray-700 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {sortedProducts.length > 0 && totalPages > 1 && (
              <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-t border-gray-100 gap-4">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedProducts.length)} of {sortedProducts.length} entries
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-10 h-10 rounded-lg ${
                        currentPage === number
                          ? 'bg-blue-500 text-white'
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
  
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
  
                <div className="flex border-b border-gray-100">
                  <button
                    className={`px-6 py-3 font-medium ${activeTab === 'basic' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('basic')}
                  >
                    Basic Info
                  </button>
                  <button
                    className={`px-6 py-3 font-medium ${activeTab === 'specifications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('specifications')}
                  >
                    Specifications
                  </button>
                  <button
                    className={`px-6 py-3 font-medium ${activeTab === 'media' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('media')}
                  >
                    Media
                  </button>
                  <button
                    className={`px-6 py-3 font-medium ${activeTab === 'seo' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('seo')}
                  >
                    SEO & Shipping
                  </button>
                </div>
  
                <div className="overflow-y-auto flex-1">
                  <form onSubmit={handleSubmit} className="p-6">
                    {activeTab === 'basic' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Product Name
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
                              Brand
                            </label>
                            <input
                              type="text"
                              value={formData.brand}
                              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              SKU <Hash size={12} className="inline" />
                            </label>
                            <input
                              type="text"
                              value={formData.sku}
                              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Stock <Package size={12} className="inline" />
                            </label>
                            <input
                              type="number"
                              value={formData.stock}
                              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                              min="0"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Low Stock Threshold
                            </label>
                            <input
                              type="number"
                              value={formData.lowStockThreshold}
                              onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              min="0"
                            />
                          </div>

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
                              <option value="">Select Category</option>
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
                              <option value="">Select Sub Category</option>
                              {filteredSubCategories.map((subCategory) => (
                                <option key={subCategory._id} value={subCategory._id}>
                                  {subCategory.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Price (INR)
                            </label>
                            <input
                              type="number"
                              value={formData.priceINR}
                              onChange={(e) => setFormData({ ...formData, priceINR: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                              min="0"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Price (AED)
                            </label>
                            <input
                              type="number"
                              value={formData.priceAED}
                              onChange={(e) => setFormData({ ...formData, priceAED: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                              min="0"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Short Description
                          </label>
                          <textarea
                            value={formData.shortDescription}
                            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Brief description (max 200 characters)"
                            maxLength={200}
                          ></textarea>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Description
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Detailed product description..."
                          ></textarea>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formData.isTrending}
                                onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                              <span className="ml-3 text-sm font-medium text-gray-700">Trending</span>
                            </label>
                          </div>

                          <div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formData.isFeatured}
                                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                              <span className="ml-3 text-sm font-medium text-gray-700">Featured</span>
                            </label>
                          </div>

                          <div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formData.freeShipping}
                                onChange={(e) => setFormData({ ...formData, freeShipping: e.target.checked })}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                              <span className="ml-3 text-sm font-medium text-gray-700">Free Shipping</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'specifications' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Material <Diamond size={12} className="inline" />
                            </label>
                            <input
                              type="text"
                              value={formData.material}
                              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Colors <Palette size={12} className="inline" />
                            </label>
                            <input
                              type="text"
                              value={formData.colors}
                              onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Red, Blue, Green (comma separated)"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Sizes <div className="inline" />
                            </label>
                            <input
                              type="text"
                              value={formData.sizes}
                              onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="S, M, L, XL (comma separated)"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tags <Tag size={12} className="inline" />
                            </label>
                            <input
                              type="text"
                              value={formData.tags}
                              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="tag1, tag2, tag3 (comma separated)"
                            />
                          </div>
                        </div>

                        <div className="border-t pt-6">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-medium text-gray-800">Specifications</h4>
                            <button
                              type="button"
                              onClick={addSpecification}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              + Add Specification
                            </button>
                          </div>
                          <div className="space-y-3">
                            {specifications.map((spec, index) => (
                              <div key={index} className="flex gap-3">
                                <input
                                  type="text"
                                  value={spec.key}
                                  onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                                  placeholder="Key (e.g., Processor)"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                />
                                <input
                                  type="text"
                                  value={spec.value}
                                  onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                                  placeholder="Value (e.g., Intel i7)"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeSpecification(index)}
                                  className="px-3 py-2 text-red-600 hover:text-red-800"
                                >
                                  <X size={18} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-4">
                            <h4 className="font-medium text-gray-800">Weight <Scale size={12} className="inline" /></h4>
                            <div className="flex gap-3">
                              <input
                                type="number"
                                value={formData.weightValue}
                                onChange={(e) => setFormData({ ...formData, weightValue: e.target.value })}
                                placeholder="Weight"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                              />
                              <select
                                value={formData.weightUnit}
                                onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-lg"
                              >
                                <option value="g">g</option>
                                <option value="kg">kg</option>
                                <option value="lb">lb</option>
                                <option value="oz">oz</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="font-medium text-gray-800">Dimensions <Ruler size={12} className="inline" /></h4>
                            <div className="grid grid-cols-3 gap-2">
                              <input
                                type="number"
                                value={formData.length}
                                onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                                placeholder="L"
                                className="px-3 py-2 border border-gray-300 rounded-lg"
                              />
                              <input
                                type="number"
                                value={formData.width}
                                onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                                placeholder="W"
                                className="px-3 py-2 border border-gray-300 rounded-lg"
                              />
                              <input
                                type="number"
                                value={formData.height}
                                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                placeholder="H"
                                className="px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                            <select
                              value={formData.dimensionUnit}
                              onChange={(e) => setFormData({ ...formData, dimensionUnit: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="cm">cm</option>
                              <option value="inch">inch</option>
                              <option value="mm">mm</option>
                            </select>
                          </div>
                        </div>

                        <div className="border-t pt-6">
                          <h4 className="font-medium text-gray-800 mb-4">Warranty <Shield size={12} className="inline" /></h4>
                          <div className="grid grid-cols-3 gap-4">
                            <input
                              type="number"
                              value={formData.warrantyPeriod}
                              onChange={(e) => setFormData({ ...formData, warrantyPeriod: e.target.value })}
                              placeholder="Warranty Period"
                              className="px-3 py-2 border border-gray-300 rounded-lg"
                            />
                            <select
                              value={formData.warrantyUnit}
                              onChange={(e) => setFormData({ ...formData, warrantyUnit: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="days">Days</option>
                              <option value="months">Months</option>
                              <option value="years">Years</option>
                            </select>
                            <input
                              type="text"
                              value={formData.warrantyDescription}
                              onChange={(e) => setFormData({ ...formData, warrantyDescription: e.target.value })}
                              placeholder="Warranty Details"
                              className="px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'media' && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-4">
                            Product Media
                          </label>
                          <div className="grid grid-cols-2 gap-4">
                            {[0, 1, 2, 3].map((index) => (
                              <div key={index} className="mt-1 flex flex-col items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                {mediaPreviews[index] || 
                                  (formData.mediaFiles[index].type === 'image' && formData.existingImages[index]) || 
                                  (formData.mediaFiles[index].type === 'video' && formData.existingVideos[index - formData.existingImages.length]) ? (
                                  <div className="relative w-full h-48">
                                    {formData.mediaFiles[index].type === 'image' ? (
                                      <img
                                        src={mediaPreviews[index] || formData.existingImages[index]}
                                        alt={`Preview ${index + 1}`}
                                        className="h-full w-full object-cover rounded-lg"
                                      />
                                    ) : (
                                      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
                                        <Film size={48} className="text-gray-400" />
                                        <span className="ml-2 text-gray-600">Video</span>
                                      </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex space-x-2">
                                      <button
                                        type="button"
                                        onClick={() => toggleMediaType(index)}
                                        className="bg-blue-500 text-white rounded-full p-1"
                                      >
                                        {formData.mediaFiles[index].type === 'image' ? <Film size={16} /> : <Image size={16} />}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => removeMedia(index)}
                                        className="bg-red-500 text-white rounded-full p-1"
                                      >
                                        <X size={16} />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-2 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                      <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                                        <span>Upload {formData.mediaFiles[index].type === 'image' ? 'Image' : 'Video'} {index + 1}</span>
                                        <input
                                          type="file"
                                          className="sr-only"
                                          accept={formData.mediaFiles[index].type === 'image' ? "image/*" : "video/*"}
                                          onChange={(e) => handleMediaChange(e, index, formData.mediaFiles[index].type)}
                                        />
                                      </label>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => toggleMediaType(index)}
                                      className="mt-2 text-xs text-blue-600 hover:text-blue-500"
                                    >
                                      Switch to {formData.mediaFiles[index].type === 'image' ? 'Video' : 'Image'}
                                    </button>
                                    <p className="text-xs text-gray-500">
                                      {formData.mediaFiles[index].type === 'image' ? 'PNG, JPG up to 10MB' : 'MP4, MOV up to 20MB'}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'seo' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Discount Percentage
                            </label>
                            <input
                              type="number"
                              value={formData.discountPercentage}
                              onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              min="0"
                              max="100"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Discount Amount
                            </label>
                            <input
                              type="number"
                              value={formData.discountAmount}
                              onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              min="0"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Discount Start Date
                            </label>
                            <input
                              type="date"
                              value={formData.discountStartDate}
                              onChange={(e) => setFormData({ ...formData, discountStartDate: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Discount End Date
                            </label>
                            <input
                              type="date"
                              value={formData.discountEndDate}
                              onChange={(e) => setFormData({ ...formData, discountEndDate: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="relative inline-flex items-center cursor-pointer mb-4">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formData.weightBasedShipping}
                                onChange={(e) => setFormData({ ...formData, weightBasedShipping: e.target.checked })}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                              <span className="ml-3 text-sm font-medium text-gray-700">Weight Based Shipping</span>
                            </label>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Shipping Cost
                            </label>
                            <input
                              type="number"
                              value={formData.shippingCost}
                              onChange={(e) => setFormData({ ...formData, shippingCost: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              min="0"
                              disabled={formData.freeShipping}
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-800">SEO Information</h4>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Meta Title
                            </label>
                            <input
                              type="text"
                              value={formData.metaTitle}
                              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Meta Description
                            </label>
                            <textarea
                              value={formData.metaDescription}
                              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                              rows={2}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Meta Keywords
                            </label>
                            <input
                              type="text"
                              value={formData.metaKeywords}
                              onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="keyword1, keyword2, keyword3"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="sticky bottom-0 bg-white pt-4 pb-4 border-t border-gray-100">
                      <div className="flex justify-between">
                        <div className="flex space-x-4">
                          <button
                            type="button"
                            onClick={() => {
                              if (activeTab === 'basic') handleCloseModal();
                              else if (activeTab === 'specifications') setActiveTab('basic');
                              else if (activeTab === 'media') setActiveTab('specifications');
                              else if (activeTab === 'seo') setActiveTab('media');
                            }}
                            className="px-4 py-2 text-gray-700 hover:text-gray-900"
                          >
                            {activeTab === 'basic' ? 'Cancel' : 'Back'}
                          </button>
                          {activeTab !== 'seo' && (
                            <button
                              type="button"
                              onClick={() => {
                                if (activeTab === 'basic') setActiveTab('specifications');
                                else if (activeTab === 'specifications') setActiveTab('media');
                                else if (activeTab === 'media') setActiveTab('seo');
                              }}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              Next
                            </button>
                          )}
                        </div>
                        
                        {activeTab === 'seo' && (
                          <div className="flex space-x-4">
                            <button
                              type="button"
                              onClick={() => setActiveTab('media')}
                              className="px-4 py-2 text-gray-700 hover:text-gray-900"
                            >
                              Back
                            </button>
                            <button
                              type="submit"
                              disabled={isLoading}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                            >
                              {isLoading ? (editingProduct ? 'Updating...' : 'Creating...') : (editingProduct ? 'Update Product' : 'Create Product')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
=======
  return (
    <SellerLayout 
      activePage="products"
      title="Manage Products"
      subtitle={`Welcome, ${seller.name}`}
    >
      {!seller.status && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          Your account is pending approval from admin. You can view your products but cannot add or edit them.
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 flex flex-col md:flex-row justify-between items-center border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">Products</h2>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <button 
              onClick={handleAddNewClick}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                seller.status 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!seller.status}
            >
              <PlusCircle size={20} />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-100">
                <th 
                  className="pb-4 px-4 text-gray-600 font-semibold cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Product Name <SortIndicator field="name" />
                </th>
                <th 
                  className="pb-4 px-4 text-gray-600 font-semibold cursor-pointer"
                  onClick={() => handleSort('brand')}
                >
                  Brand <SortIndicator field="brand" />
                </th>
                <th 
                  className="pb-4 px-4 text-gray-600 font-semibold cursor-pointer"
                  onClick={() => handleSort('sku')}
                >
                  SKU <SortIndicator field="sku" />
                </th>
                <th 
                  className="pb-4 px-4 text-gray-600 font-semibold cursor-pointer"
                  onClick={() => handleSort('category')}
                >
                  Category <SortIndicator field="category" />
                </th>
                <th 
                  className="pb-4 px-4 text-gray-600 font-semibold cursor-pointer"
                  onClick={() => handleSort('stock')}
                >
                  Stock <SortIndicator field="stock" />
                </th>
                <th 
                  className="pb-4 px-4 text-gray-600 font-semibold cursor-pointer"
                  onClick={() => handleSort('priceINR')}
                >
                  Price (INR) <SortIndicator field="priceINR" />
                </th>
                <th 
                  className="pb-4 px-4 text-gray-600 font-semibold cursor-pointer"
                  onClick={() => handleSort('priceAED')}
                >
                  Price (AED) <SortIndicator field="priceAED" />
                </th>
                <th className="pb-4 px-4 text-gray-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 text-gray-800">{product.name}</td>
                    <td className="py-4 px-4 text-gray-800">{product.brand}</td>
                    <td className="py-4 px-4 text-gray-800 font-mono">{product.sku}</td>
                    <td className="py-4 px-4 text-gray-800">{product.categoryId.name}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock <= 0 ? 'bg-red-100 text-red-800' :
                        product.stock <= product.lowStockThreshold ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-800">₹{product.priceINR}</td>
                    <td className="py-4 px-4 text-gray-800">AED {product.priceAED}</td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-3">
                        <button 
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit2 size={20} />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteClick(product._id)}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-4 px-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {deleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setProductToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        
        {sortedProducts.length > 0 && totalPages > 1 && (
          <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-t border-gray-100 gap-4">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedProducts.length)} of {sortedProducts.length} entries
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`w-10 h-10 rounded-lg ${
                    currentPage === number
                      ? 'bg-blue-500 text-white'
                      : 'border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex border-b border-gray-100">
              <button
                className={`px-6 py-3 font-medium ${activeTab === 'basic' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('basic')}
              >
                Basic Info
              </button>
              <button
                className={`px-6 py-3 font-medium ${activeTab === 'specifications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('specifications')}
              >
                Specifications
              </button>
              <button
                className={`px-6 py-3 font-medium ${activeTab === 'media' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('media')}
              >
                Media
              </button>
              <button
                className={`px-6 py-3 font-medium ${activeTab === 'seo' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('seo')}
              >
                SEO & Shipping
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              <form onSubmit={handleSubmit} className="p-6">
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Name
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
                          Brand
                        </label>
                        <input
                          type="text"
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SKU <Hash size={12} className="inline" />
                        </label>
                        <input
                          type="text"
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock <Package size={12} className="inline" />
                        </label>
                        <input
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Low Stock Threshold
                        </label>
                        <input
                          type="number"
                          value={formData.lowStockThreshold}
                          onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                        />
                      </div>

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
                          <option value="">Select Category</option>
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
                          <option value="">Select Sub Category</option>
                          {filteredSubCategories.map((subCategory) => (
                            <option key={subCategory._id} value={subCategory._id}>
                              {subCategory.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price (INR)
                        </label>
                        <input
                          type="number"
                          value={formData.priceINR}
                          onChange={(e) => setFormData({ ...formData, priceINR: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price (AED)
                        </label>
                        <input
                          type="number"
                          value={formData.priceAED}
                          onChange={(e) => setFormData({ ...formData, priceAED: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          min="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Short Description
                      </label>
                      <textarea
                        value={formData.shortDescription}
                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief description (max 200 characters)"
                        maxLength={200}
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Detailed product description..."
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={formData.isTrending}
                            onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                          <span className="ml-3 text-sm font-medium text-gray-700">Trending</span>
                        </label>
                      </div>

                      <div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={formData.isFeatured}
                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                          <span className="ml-3 text-sm font-medium text-gray-700">Featured</span>
                        </label>
                      </div>

                      <div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={formData.freeShipping}
                            onChange={(e) => setFormData({ ...formData, freeShipping: e.target.checked })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                          <span className="ml-3 text-sm font-medium text-gray-700">Free Shipping</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Material <Diamond size={12} className="inline" />
                        </label>
                        <input
                          type="text"
                          value={formData.material}
                          onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Colors <Palette size={12} className="inline" />
                        </label>
                        <input
                          type="text"
                          value={formData.colors}
                          onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Red, Blue, Green (comma separated)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sizes <div className="inline" />
                        </label>
                        <input
                          type="text"
                          value={formData.sizes}
                          onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="S, M, L, XL (comma separated)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags <Tag size={12} className="inline" />
                        </label>
                        <input
                          type="text"
                          value={formData.tags}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="tag1, tag2, tag3 (comma separated)"
                        />
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-medium text-gray-800">Specifications</h4>
                        <button
                          type="button"
                          onClick={addSpecification}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          + Add Specification
                        </button>
                      </div>
                      <div className="space-y-3">
                        {specifications.map((spec, index) => (
                          <div key={index} className="flex gap-3">
                            <input
                              type="text"
                              value={spec.key}
                              onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                              placeholder="Key (e.g., Processor)"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            />
                            <input
                              type="text"
                              value={spec.value}
                              onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                              placeholder="Value (e.g., Intel i7)"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeSpecification(index)}
                              className="px-3 py-2 text-red-600 hover:text-red-800"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-800">Weight <Scale size={12} className="inline" /></h4>
                        <div className="flex gap-3">
                          <input
                            type="number"
                            value={formData.weightValue}
                            onChange={(e) => setFormData({ ...formData, weightValue: e.target.value })}
                            placeholder="Weight"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <select
                            value={formData.weightUnit}
                            onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          >
                            <option value="g">g</option>
                            <option value="kg">kg</option>
                            <option value="lb">lb</option>
                            <option value="oz">oz</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-800">Dimensions <Ruler size={12} className="inline" /></h4>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="number"
                            value={formData.length}
                            onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                            placeholder="L"
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="number"
                            value={formData.width}
                            onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                            placeholder="W"
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="number"
                            value={formData.height}
                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                            placeholder="H"
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <select
                          value={formData.dimensionUnit}
                          onChange={(e) => setFormData({ ...formData, dimensionUnit: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="cm">cm</option>
                          <option value="inch">inch</option>
                          <option value="mm">mm</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-medium text-gray-800 mb-4">Warranty <Shield size={12} className="inline" /></h4>
                      <div className="grid grid-cols-3 gap-4">
                        <input
                          type="number"
                          value={formData.warrantyPeriod}
                          onChange={(e) => setFormData({ ...formData, warrantyPeriod: e.target.value })}
                          placeholder="Warranty Period"
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <select
                          value={formData.warrantyUnit}
                          onChange={(e) => setFormData({ ...formData, warrantyUnit: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="days">Days</option>
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                        </select>
                        <input
                          type="text"
                          value={formData.warrantyDescription}
                          onChange={(e) => setFormData({ ...formData, warrantyDescription: e.target.value })}
                          placeholder="Warranty Details"
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'media' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Product Media
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {[0, 1, 2, 3].map((index) => (
                          <div key={index} className="mt-1 flex flex-col items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                            {mediaPreviews[index] || 
                              (formData.mediaFiles[index].type === 'image' && formData.existingImages[index]) || 
                              (formData.mediaFiles[index].type === 'video' && formData.existingVideos[index - formData.existingImages.length]) ? (
                              <div className="relative w-full h-48">
                                {formData.mediaFiles[index].type === 'image' ? (
                                  <img
                                    src={mediaPreviews[index] || formData.existingImages[index]}
                                    alt={`Preview ${index + 1}`}
                                    className="h-full w-full object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
                                    <Film size={48} className="text-gray-400" />
                                    <span className="ml-2 text-gray-600">Video</span>
                                  </div>
                                )}
                                <div className="absolute top-2 right-2 flex space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => toggleMediaType(index)}
                                    className="bg-blue-500 text-white rounded-full p-1"
                                  >
                                    {formData.mediaFiles[index].type === 'image' ? <Film size={16} /> : <Image size={16} />}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeMedia(index)}
                                    className="bg-red-500 text-white rounded-full p-1"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                  <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                                    <span>Upload {formData.mediaFiles[index].type === 'image' ? 'Image' : 'Video'} {index + 1}</span>
                                    <input
                                      type="file"
                                      className="sr-only"
                                      accept={formData.mediaFiles[index].type === 'image' ? "image/*" : "video/*"}
                                      onChange={(e) => handleMediaChange(e, index, formData.mediaFiles[index].type)}
                                    />
                                  </label>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => toggleMediaType(index)}
                                  className="mt-2 text-xs text-blue-600 hover:text-blue-500"
                                >
                                  Switch to {formData.mediaFiles[index].type === 'image' ? 'Video' : 'Image'}
                                </button>
                                <p className="text-xs text-gray-500">
                                  {formData.mediaFiles[index].type === 'image' ? 'PNG, JPG up to 10MB' : 'MP4, MOV up to 20MB'}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount Percentage
                        </label>
                        <input
                          type="number"
                          value={formData.discountPercentage}
                          onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                          max="100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount Amount
                        </label>
                        <input
                          type="number"
                          value={formData.discountAmount}
                          onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount Start Date
                        </label>
                        <input
                          type="date"
                          value={formData.discountStartDate}
                          onChange={(e) => setFormData({ ...formData, discountStartDate: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount End Date
                        </label>
                        <input
                          type="date"
                          value={formData.discountEndDate}
                          onChange={(e) => setFormData({ ...formData, discountEndDate: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="relative inline-flex items-center cursor-pointer mb-4">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={formData.weightBasedShipping}
                            onChange={(e) => setFormData({ ...formData, weightBasedShipping: e.target.checked })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                          <span className="ml-3 text-sm font-medium text-gray-700">Weight Based Shipping</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Shipping Cost
                        </label>
                        <input
                          type="number"
                          value={formData.shippingCost}
                          onChange={(e) => setFormData({ ...formData, shippingCost: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                          disabled={formData.freeShipping}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-800">SEO Information</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Title
                        </label>
                        <input
                          type="text"
                          value={formData.metaTitle}
                          onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Description
                        </label>
                        <textarea
                          value={formData.metaDescription}
                          onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Keywords
                        </label>
                        <input
                          type="text"
                          value={formData.metaKeywords}
                          onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="keyword1, keyword2, keyword3"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="sticky bottom-0 bg-white pt-4 pb-4 border-t border-gray-100">
                  <div className="flex justify-between">
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          if (activeTab === 'basic') handleCloseModal();
                          else if (activeTab === 'specifications') setActiveTab('basic');
                          else if (activeTab === 'media') setActiveTab('specifications');
                          else if (activeTab === 'seo') setActiveTab('media');
                        }}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900"
                      >
                        {activeTab === 'basic' ? 'Cancel' : 'Back'}
                      </button>
                      {activeTab !== 'seo' && (
                        <button
                          type="button"
                          onClick={() => {
                            if (activeTab === 'basic') setActiveTab('specifications');
                            else if (activeTab === 'specifications') setActiveTab('media');
                            else if (activeTab === 'media') setActiveTab('seo');
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Next
                        </button>
                      )}
                    </div>
                    
                    {activeTab === 'seo' && (
                      <div className="flex space-x-4">
                        <button
                          type="button"
                          onClick={() => setActiveTab('media')}
                          className="px-4 py-2 text-gray-700 hover:text-gray-900"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                        >
                          {isLoading ? (editingProduct ? 'Updating...' : 'Creating...') : (editingProduct ? 'Update Product' : 'Create Product')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </SellerLayout>
>>>>>>> 6f4220bdf6e446d714f6ce8799392dc31ec929ae
  );
};

export default SellerProductPage;