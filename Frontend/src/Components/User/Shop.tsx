import { Heart, Filter, Search, ArrowRight, Star, Grid, List, X, Sparkles, Award, Truck, Shield, Package } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "../Layouts/Footer"
import NavBar from "../Layouts/Navbar"
import { baseurl } from "../../Constant/Base"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"

interface Category {
  _id: string;
  name: string;
  image: string;
}

interface Product {
  _id: string;
  name: string;
  brand: string;
  category: Category | string;
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
  discount?: number;
}

export default function ShopLayout() {
  const navigate = useNavigate()
  const api = axios.create({
    baseURL: baseurl,
  });

  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({})
  const [visibleProducts, setVisibleProducts] = useState(12)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [scrolled, setScrolled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFavorite = (productName: string) => {
    setFavorites((prev) => ({
      ...prev,
      [productName]: !prev[productName],
    }))
  }

  const handleShowMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 12, filteredProducts.length))
  }

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`)
  }

  const getCategories = async () => {
    try {
      const response = await api.get("/get-category")
      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const getProducts = async () => {
    setLoading(true)
    try {
      const response = await api.get("/get-product")
      if (response.data && Array.isArray(response.data.products)) {
        const productsWithMockData = response.data.products.map((product: Product) => ({
          ...product,
          description: product.description || "Premium quality product crafted with attention to detail.",
          discount: Math.floor(Math.random() * 40),
          rating: Math.random() * 2 + 3,
          reviews: Math.floor(Math.random() * 200) + 10
        }))
        setAllProducts(productsWithMockData)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProducts()
    getCategories()
  }, [])

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (typeof product.category === 'object' && product.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesPrice = product.priceINR >= priceRange[0] && product.priceINR <= priceRange[1]
    const matchesCategory = selectedCategories.length === 0 || 
      (typeof product.category === 'object' && selectedCategories.includes(product.category._id))
    
    return matchesSearch && matchesPrice && matchesCategory
  })

  const products = filteredProducts.slice(0, visibleProducts)

  const statistics = [
    { value: `${allProducts.length}+`, label: "Premium Products" },
    { value: `${categories.length}+`, label: "Categories" },
    { value: "New Arrivals", label: "Daily" },
    { value: "24/7", label: "Support" }
  ];

  const features = [
    {
      icon: <Award className="w-10 h-10" />,
      title: "Premium Quality",
      description: "Authentic products with manufacturer warranty"
    },
    {
      icon: <Truck className="w-10 h-10" />,
      title: "Free Shipping",
      description: "On orders above ₹5000 across India"
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Secure Shopping",
      description: "100% safe and secure transactions"
    },
    {
      icon: <Package className="w-10 h-10" />,
      title: "Easy Returns",
      description: "30-day return policy"
    }
  ];

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

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      <div className="relative h-[300px] md:h-[400px] overflow-hidden bg-black">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop&auto=format&q=80"
            alt="Premium Collection"
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
              PREMIUM <span className="text-gold-400">SHOP</span>
            </h1>

            <p className="text-gray-200 text-base md:text-lg mb-8 max-w-xl">
              Discover our curated collection of premium products, each selected for exceptional quality and craftsmanship.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}
              className="bg-gold-400 text-black hover:bg-gold-500 px-6 py-3 rounded-sm transition-all text-base font-semibold"
            >
              <span className="flex items-center justify-center">
                EXPLORE COLLECTIONS
                <ArrowRight className="ml-2" size={18} />
              </span>
            </motion.button>
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

      <div className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white/90" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop&auto=format&q=80')] bg-fixed bg-center bg-cover opacity-10" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Why Shop With Us</h2>
            <div className="w-16 h-1 bg-gold-400 mx-auto" />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              We redefine shopping with exceptional service, authentic products, and commitment to excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, brands, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg pl-12 pr-4 py-4 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-gold-400 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-gold-400 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-gold-400 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <AnimatePresence>
              {showFilter && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6 lg:sticky lg:top-24"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    <button
                      onClick={() => {
                        setPriceRange([0, 50000])
                        setSelectedCategories([])
                      }}
                      className="text-sm text-gold-400 hover:text-gold-500 transition-colors"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
                      <div className="space-y-4">
                        <input
                          type="range"
                          min={0}
                          max={50000}
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">₹{priceRange[0].toLocaleString()}</span>
                          <span className="text-gray-600">₹{priceRange[1].toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {categories.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {categories.map((category) => (
                            <label key={category._id} className="flex items-center cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes(category._id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedCategories([...selectedCategories, category._id])
                                  } else {
                                    setSelectedCategories(selectedCategories.filter(id => id !== category._id))
                                  }
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-gold-400 focus:ring-gold-400"
                              />
                              <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                {category.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredProducts.length} Premium Products
              </h2>
              <p className="text-gray-600 mt-1">
                Curated collection for the discerning shopper
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
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
                    onMouseEnter={() => setHoveredProduct(product._id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={hoveredProduct === product._id && product.images.image2 ? product.images.image2 : product.images.image1 || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop&auto=format&q=80"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {product.discount && product.discount > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{product.discount}%
                        </div>
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.name);
                        }}
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
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-gray-900">
                          ₹{product.priceINR.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Free Shipping
                        </div>
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
                            {typeof product.category === 'object' ? product.category.name : 'Unknown Category'}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product.name);
                          }}
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

            {!loading && visibleProducts < filteredProducts.length && (
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

      <div className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&h=800&fit=crop&auto=format&q=80')] bg-fixed bg-center bg-cover opacity-20" />
        
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-12 h-12 text-gold-400 mx-auto mb-6" />
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
          <div className="w-16 h-1 bg-gold-400 mx-auto mb-6" />
          <p className="text-gray-300 mb-8 text-lg">
            Get exclusive access to new collections, special offers, and style tips delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-6 py-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
            />
            <button className="px-8 py-4 bg-gold-400 text-black font-bold rounded-lg hover:bg-gold-500 transition-all hover:scale-105">
              SUBSCRIBE
            </button>
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