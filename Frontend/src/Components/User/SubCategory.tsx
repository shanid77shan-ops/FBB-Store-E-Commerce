import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { baseurl } from "../../Constant/Base";
import Footer from "../Layouts/Footer";
import { 
  Search, 
  Grid, 
  Rows, 
  ArrowRight,
  Filter,
  Tag,
  Package,
  Award,
  Shield,
  Star,
  ChevronRight,
  ChevronLeft,
  Layers,
  Grid3x3,
  CheckCircle
} from "lucide-react";
import { FiArrowRight } from "react-icons/fi";

interface Category {
  name: string;
  image: string;
  _id: string;
  description?: string;
  itemCount?: number;
}

const Subcategory: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewStyle, setViewStyle] = useState<"grid" | "rows">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { category, seller } = useParams();

  const api = axios.create({
    baseURL: baseurl
  });

  const bannerSlides = [
    {
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=600&fit=crop&auto=format&q=80",
      title: "CURATED COLLECTIONS",
      description: "Explore premium subcategories within our exclusive collections.",
      accent: "#D4AF37"
    },
    {
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&h=600&fit=crop&auto=format&q=80",
      title: "SPECIALIZED RANGES",
      description: "Discover specialized ranges crafted with attention to detail.",
      accent: "#2C3E50"
    },
    {
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=1200&h=600&fit=crop&auto=format&q=80",
      title: "EXPERTLY CATEGORIZED",
      description: "Every subcategory is carefully organized for easy discovery.",
      accent: "#1a1a1a"
    }
  ];


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  const nextSlide = () => setCurrentSlideIndex((prev) => (prev + 1) % bannerSlides.length);
  const prevSlide = () => setCurrentSlideIndex((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);

  const getCategory = async () => {
    if (!category || !seller) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/get-subcategory/${seller}/${category}`);
      const enhancedData = response.data.subcategories.map((cat: Category) => ({
        ...cat,
        description: cat.description || `Explore our curated selection of premium ${cat.name.toLowerCase()}`,
        itemCount: Math.floor(Math.random() * 50) + 20
      }));
      setCategories(enhancedData);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategory();
  }, [category, seller]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setTimeout(() => {
      navigate(`/products/${seller}/${category}/${categoryId}`);
    }, 300);
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statistics = [
    { value: `${categories.length}+`, label: "Subcategories", icon: <Layers className="w-6 h-6" /> },
    { value: "2000+", label: "Products", icon: <Package className="w-6 h-6" /> },
    { value: "Premium", label: "Quality", icon: <Award className="w-6 h-6" /> },
    { value: "Expert", label: "Curation", icon: <Shield className="w-6 h-6" /> }
  ];

  const features = [
    {
      icon: <CheckCircle className="w-10 h-10" />,
      title: "Specialized Collections",
      description: "Each subcategory represents a specialized collection curated by experts"
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: "Premium Selection",
      description: "Only the finest products that meet our strict quality standards"
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Verified Quality",
      description: "All products undergo rigorous quality verification"
    },
    {
      icon: <Grid3x3 className="w-10 h-10" />,
      title: "Easy Navigation",
      description: "Organized subcategories for effortless discovery"
    }
  ];

 

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-white">
      
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={bannerSlides[currentSlideIndex].image}
              alt={bannerSlides[currentSlideIndex].title}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <button 
          className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 bg-black/40 backdrop-blur-sm text-white p-3 rounded-full transition-all hover:bg-black/60 z-10"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button 
          className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 bg-black/40 backdrop-blur-sm text-white p-3 rounded-full transition-all hover:bg-black/60 z-10"
          onClick={nextSlide}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

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
              SPECIALIZED <span className="text-gold-400">COLLECTIONS</span>
            </h1>

            <p className="text-gray-200 text-base md:text-lg mb-8 max-w-xl">
              Discover our curated subcategories, each representing a specialized collection of premium products from our verified sellers.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}
                className="bg-gold-400 text-black hover:bg-gold-500 px-6 py-3 rounded-sm transition-all text-base font-semibold"
              >
                <span className="flex items-center justify-center">
                  BROWSE COLLECTIONS
                  <FiArrowRight className="ml-2" size={18} />
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="bg-black py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="text-gold-400">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gold-400 mb-2">{stat.value}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Why Our Subcategories Stand Out</h2>
            <div className="w-16 h-1 bg-gold-400 mx-auto" />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Each subcategory represents a specialized collection curated with expert attention to detail and quality.
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

      <div className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Layers className="w-8 h-8 text-gold-400 mr-3" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Browse Subcollections</h2>
            </div>
            <div className="w-16 h-1 bg-gold-400 mx-auto" />
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Explore our specialized subcategories, each curated for a specific style and purpose.
            </p>
          </div>

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
                  placeholder="Search subcategories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg pl-12 pr-4 py-4 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button 
                    onClick={() => setViewStyle("grid")}
                    className={`p-2 rounded-md transition-all ${viewStyle === "grid" ? "bg-white text-gold-400 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setViewStyle("rows")}
                    className={`p-2 rounded-md transition-all ${viewStyle === "rows" ? "bg-white text-gold-400 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                  >
                    <Rows className="w-5 h-5" />
                  </button>
                </div>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-gold-400 transition-colors">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filter</span>
                </button>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden h-80 animate-pulse shadow-sm">
                    <div className="h-3/4 w-full bg-gray-200" />
                    <div className="h-1/4 p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {!isLoading && filteredCategories.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={viewStyle === "grid" ? 
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : 
                "space-y-4"
              }
            >
              {filteredCategories.map((cat) => (
                <motion.div
                  key={cat._id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className={`bg-white rounded-lg overflow-hidden shadow-lg ${
                    selectedCategory === cat._id ? 'scale-95 opacity-50' : ''
                  }`}
                  onClick={() => handleCategoryClick(cat._id)}
                >
                  <div className="relative group cursor-pointer">
                    <div className="relative h-64">
                      <img
                        src={cat.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop&auto=format&q=80"}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop&auto=format&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      
                      <div className="absolute top-4 right-4 bg-gold-400 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        Premium
                      </div>
                      
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-white font-bold text-xl mb-1">{cat.name}</h3>
                        <div className="flex items-center">
                          <Tag className="w-4 h-4 text-gold-400 mr-1" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-white">
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {cat.description}
                      </p>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="flex items-center text-gold-400">
                          <Layers className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">Subcollection</span>
                        </div>
                        <div className="flex items-center text-gold-400 group-hover:text-gold-500 transition-colors">
                          <span className="text-sm font-medium mr-2">Explore</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            !isLoading && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Layers className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Subcategories Found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )
          )}
        </div>
      </div>





      <Footer />
    </div>
  );
};

export default Subcategory;