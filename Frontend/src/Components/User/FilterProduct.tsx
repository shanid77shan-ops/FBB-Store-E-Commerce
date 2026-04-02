import { Heart, ChevronRight, Star, Grid, List, X } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import Footer from "../Layouts/Footer"
// import { Button } from "../Layouts/button"
import { baseurl } from "../../Constant/Base"
import axios from "axios"
import { motion } from "framer-motion"

interface CategoryId {
  _id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface SubCategoryId {
  _id: string;
  name: string;
  categoryId: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  name: string;
  image: string;
}

interface Product {
  _id: string;
  name: string;
  brand: string;
  categoryId: CategoryId;
  subCategoryId: SubCategoryId;
  priceINR: number;
  priceAED: number;
  images: {
    image1: string;
    image2: string;
    image3: string;
    image4: string;
  };
  createdAt: string;
  updatedAt: string;
  status?: 'LISTED' | 'UNLISTED';
  rating?: number;
  reviews?: number;
  originalPrice?: number;
  active: boolean;
  __v: number;
  description?: string;
  sizes?: string[];
  colors?: string[];
  discount?: number;
}

interface FilterState {
  priceRange: [number, number];
  brands: string[];
  sortBy: string;
}

export default function FilterProduct() {
  const navigate = useNavigate()
  const api = axios.create({
    baseURL: baseurl,
  });

  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({})
  const [visibleProducts, setVisibleProducts] = useState(12)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState<{ [key: string]: number }>({})
  const [currentCategory, setCurrentCategory] = useState<string>("")
  const [currentSubCategory, setCurrentSubCategory] = useState<string>("")
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 50000],
    brands: [],
    sortBy: 'newest'
  })
  const { category, id, seller } = useParams()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    if (filteredProducts.length > 0) {
      const product = filteredProducts[0]
      if (product.categoryId && typeof product.categoryId === 'object') {
        setCurrentCategory(product.categoryId.name)
      }
      if (product.subCategoryId && typeof product.subCategoryId === 'object') {
        setCurrentSubCategory(product.subCategoryId.name)
      }
    }
  }, [filteredProducts])

  const toggleFavorite = (productName: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setFavorites((prev) => ({
      ...prev,
      [productName]: !prev[productName],
    }))
  }

  const handleShowMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 12, filteredProducts.length))
  }

  const handleViewChange = (view: "grid" | "list") => {
    setViewMode(view)
  }

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`)
  }

  const handleMouseEnter = (productId: string) => {
    setActiveImageIndex(prev => ({...prev, [productId]: 1}))
  }

  const handleMouseLeave = (productId: string) => {
    setActiveImageIndex(prev => ({...prev, [productId]: 0}))
  }

  const getCategories = async () => {
    try {
      const response = await api.get(`/get-category/${category}`)
      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const getProducts = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`/get-related/${seller}/${id}`)
      if (response.data && Array.isArray(response.data.products)) {
        const productsWithMockData = response.data.products.map((product: Product) => ({
          ...product,
          description: product.description || "Premium quality product crafted with attention to detail and exceptional materials.",
          sizes: ["S", "M", "L", "XL"],
          colors: ["Black", "White", "Navy", "Gray"],
          discount: Math.floor(Math.random() * 40),
          rating: Math.random() * 2 + 3,
          reviews: Math.floor(Math.random() * 200) + 10
        }))
        setAllProducts(productsWithMockData)
        setFilteredProducts(productsWithMockData)
        const initialActiveImages: { [key: string]: number } = {}
        productsWithMockData.forEach((product: { _id: string | number }) => {
          initialActiveImages[product._id] = 0
        })
        setActiveImageIndex(initialActiveImages)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = useCallback(() => {
    let filtered = [...allProducts]
    
    filtered = filtered.filter(product => 
      product.priceINR >= filters.priceRange[0] && 
      product.priceINR <= filters.priceRange[1]
    )
    
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => 
        filters.brands.includes(product.brand)
      )
    }
    
    switch (filters.sortBy) {
      case 'price-low-high':
        filtered.sort((a, b) => a.priceINR - b.priceINR)
        break
      case 'price-high-low':
        filtered.sort((a, b) => b.priceINR - a.priceINR)
        break
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      default:
        break
    }
    
    setFilteredProducts(filtered)
  }, [allProducts, filters])

  useEffect(() => {
    if (allProducts.length > 0) {
      applyFilters()
    }
  }, [allProducts, filters, applyFilters])

  useEffect(() => {
    getProducts()
    getCategories()
  }, [])

  const uniqueBrands = [...new Set(allProducts.map(p => p.brand))]
  const minPrice = allProducts.length > 0 ? Math.min(...allProducts.map(p => p.priceINR)) : 0
  const maxPrice = allProducts.length > 0 ? Math.max(...allProducts.map(p => p.priceINR)) : 50000
  const products = filteredProducts.slice(0, visibleProducts)

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const toggleFilterValue = (filterType: 'brands', value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType]
      return {
        ...prev,
        [filterType]: currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value]
      }
    })
  }

  const renderRatingStars = (rating: number = 0) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < Math.floor(rating)
                ? "fill-gold-400 text-gold-400"
                : i < rating
                ? "fill-gold-400 text-gold-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    )
  }

  const statistics = [
    { value: `${allProducts.length}+`, label: "Premium Products" },
    { value: `${uniqueBrands.length}+`, label: "Brands" },
    { value: "New Arrivals", label: "Daily" },
    { value: "Premium", label: "Quality" }
  ];

  const features = [
    {
      icon: "✓",
      title: "Authentic Products",
      description: "100% genuine items verified by our experts"
    },
    {
      icon: "✓",
      title: "Free Shipping",
      description: "On orders above ₹5000 across India"
    },
    {
      icon: "✓",
      title: "Easy Returns",
      description: "30-day return policy for your peace of mind"
    },
    {
      icon: "✓",
      title: "Premium Support",
      description: "Dedicated customer service team"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
  
      
      <div className="relative h-[300px] md:h-[400px] overflow-hidden bg-black">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop&auto=format&q=80"
            alt="Premium Products"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        </motion.div>

        <div className="relative h-full flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "80px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-0.5 bg-gold-400 mb-6"
            />
            
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              PREMIUM <span className="text-gold-400">COLLECTION</span>
            </h1>

            <p className="text-gray-200 text-base md:text-lg mb-8 max-w-xl">
              Discover our curated selection of premium products, each crafted with exceptional quality and attention to detail.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="bg-black py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-gold-400 mb-1">{stat.value}</div>
                <div className="text-gray-300 text-xs md:text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-gold-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/shop" className="hover:text-gold-400 transition-colors">
            Shop
          </Link>
          {currentCategory && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900 font-medium">{currentCategory}</span>
            </>
          )}
          {currentSubCategory && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900 font-medium">{currentSubCategory}</span>
            </>
          )}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setFilters({
                      priceRange: [minPrice, maxPrice],
                      brands: [],
                      sortBy: 'newest'
                    })}
                    className="text-sm text-gold-400 hover:text-gold-500 transition-colors"
                  >
                    Reset all
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        value={filters.priceRange[1]}
                        onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">₹{filters.priceRange[0].toLocaleString()}</span>
                        <span className="text-gray-600">₹{filters.priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {uniqueBrands.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Brands</h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {uniqueBrands.map((brand) => (
                          <label key={brand} className="flex items-center cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={filters.brands.includes(brand)}
                              onChange={() => toggleFilterValue('brands', brand)}
                              className="h-4 w-4 rounded border-gray-300 text-gold-400 focus:ring-gold-400"
                            />
                            <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                              {brand}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Sort By</h4>
                    <select
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                      <option value="newest">Newest Arrivals</option>
                      <option value="price-low-high">Price: Low to High</option>
                      <option value="price-high-low">Price: High to Low</option>
                      <option value="rating">Customer Rating</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="w-8 h-8 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 mx-auto mb-2">
                      {feature.icon}
                    </div>
                    <div className="text-xs font-medium text-gray-900">{feature.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{feature.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {filteredProducts.length} Premium Products
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Curated collection for the discerning shopper
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleViewChange("grid")}
                      className={`p-2 ${viewMode === "grid" ? "bg-gold-400 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleViewChange("list")}
                      className={`p-2 ${viewMode === "list" ? "bg-gold-400 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="hidden md:block text-sm text-gray-600">
                    Showing {Math.min(visibleProducts, filteredProducts.length)} of {filteredProducts.length} products
                  </div>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                    <div className="h-64 bg-gray-200" />
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <X className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
                <p className="text-gray-500">Try adjusting your filters or check back later</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleProductClick(product._id)}
                  >
                    <div 
                      className="relative h-64 overflow-hidden"
                      onMouseEnter={() => handleMouseEnter(product._id)}
                      onMouseLeave={() => handleMouseLeave(product._id)}
                    >
                      <img
                        src={product.images.image1 || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop&auto=format&q=80"}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                        style={{ opacity: activeImageIndex[product._id] ? 0 : 1 }}
                      />
                      {product.images.image2 && (
                        <img
                          src={product.images.image2}
                          alt={`${product.name} - alternate view`}
                          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                          style={{ opacity: activeImageIndex[product._id] ? 1 : 0 }}
                        />
                      )}
                      
                      {product.discount && product.discount > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{product.discount}%
                        </div>
                      )}
                      
                      <button
                        onClick={(e) => toggleFavorite(product.name, e)}
                        className="absolute top-3 right-3 z-10"
                        aria-label={favorites[product.name] ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart
                          className={`h-5 w-5 ${favorites[product.name] ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"}`}
                        />
                      </button>
                      
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="text-white text-sm font-medium">{product.brand}</div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-2">
                        {product.rating && (
                          <div className="flex items-center gap-1">
                            {renderRatingStars(product.rating)}
                            <span className="ml-1 text-xs text-gray-500">
                              ({product.reviews || 0})
                            </span>
                          </div>
                        )}
                        {product.originalPrice && (
                          <span className="text-xs text-gray-500 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-gray-900">
                          ₹{product.priceINR.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Free Shipping
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center gap-2">
                        {product.colors && product.colors.slice(0, 3).map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: color.toLowerCase() }}
                            title={color}
                          />
                        ))}
                        {product.colors && product.colors.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{product.colors.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer flex"
                    onClick={() => handleProductClick(product._id)}
                  >
                    <div className="w-64 flex-shrink-0 relative">
                      <img
                        src={product.images.image1 || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop&auto=format&q=80"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.discount && product.discount > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{product.discount}%
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-1">
                            {product.brand}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                        
                        <button
                          onClick={(e) => toggleFavorite(product.name, e)}
                          className="flex-shrink-0"
                          aria-label={favorites[product.name] ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Heart
                            className={`h-5 w-5 ${favorites[product.name] ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"}`}
                          />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div>
                            <div className="text-2xl font-bold text-gray-900">
                              ₹{product.priceINR.toLocaleString()}
                            </div>
                            {product.originalPrice && (
                              <div className="text-sm text-gray-500 line-through">
                                ₹{product.originalPrice}
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <div className="mb-1">
                              {renderRatingStars(product.rating)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {product.reviews || 0} reviews
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-gray-500 mb-2">
                            Available in {product.sizes?.length || 4} sizes
                          </div>
                          <button className="px-6 py-2 bg-gold-400 text-white rounded-lg hover:bg-gold-500 transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!isLoading && visibleProducts < filteredProducts.length && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleShowMore}
                  className="px-8 py-3 bg-gold-400 text-white font-semibold rounded-lg hover:bg-gold-500 transition-all hover:scale-105"
                >
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Recently Viewed
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.slice(0, 5).map((product) => (
              <div
                key={`recent-${product._id}`}
                className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                onClick={() => handleProductClick(product._id)}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={product.images.image1 || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop&auto=format&q=80"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold text-gray-900">₹{product.priceINR}</span>
                    {product.rating && (
                      <div className="flex items-center">
                        {renderRatingStars(product.rating)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 1 : 0 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-xl hover:bg-gray-900 transition-all z-40 hover:scale-110"
      >
        <Star className="text-gold-400 h-6 w-6" />
      </motion.button>

      <Footer />
    </div>
  )
}