import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseurl } from "../../Constant/Base";
import NavBar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import { 
  Search, 
  ChevronRight, 
  ArrowRight, 
  Store, 
 
  Tag,
  Award,
  Shield,
  Globe,
  Star,
  Clock,
  MapPin,
  CheckCircle
} from "lucide-react";
import { FiArrowRight } from "react-icons/fi";

interface Seller {
  _id: string;
  name: string;
  email: string;
  phone: string;
  Image: string;
  categories: string[];
  DXB?: string;
  INR?: string;
  status: boolean;
  createdAt: string;
  description?: string;
  address?: string;
}

const SellerPages: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  const [loadingSellers, setLoadingSellers] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [, setScrolled] = useState(false);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: baseurl
  });

  const bannerSlides = [
    {
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop&auto=format&q=80",
      title: "PREMIUM PARTNERS",
      description: "Discover our network of verified sellers offering exceptional quality and service.",
      accent: "#D4AF37"
    },
    {
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop&auto=format&q=80",
      title: "CURATED EXCELLENCE",
      description: "Each seller is carefully selected for their commitment to craftsmanship and authenticity.",
      accent: "#2C3E50"
    },
    {
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=600&fit=crop&auto=format&q=80",
      title: "TRUSTED NETWORK",
      description: "Shop with confidence from our verified network of premium sellers.",
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

  const getSellers = async () => {
    setLoadingSellers(true);
    try {
      const response = await api.get("/get-sellers");
      console.log(response,"is heree")
      if(response && response.data) {
        const verifiedSellers = response.data.sellers;
        setSellers(verifiedSellers);
      }
    } catch (error) {
      console.error("Error fetching sellers:", error);
    } finally {
      setLoadingSellers(false);
    }
  };

  useEffect(() => {
    getSellers();
  }, []);

  const filteredSellers = sellers.filter(seller =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.categories?.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const displayedSellers = showAll ? filteredSellers : filteredSellers.slice(0, 8);

  const handleSellerClick = (sellerId: string) => {
    setSelectedSeller(sellerId);
    setTimeout(() => {
      navigate(`/seller-list/${sellerId}`);
    }, 300);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long'
    });
  };

  const statistics = [
    { value: `${sellers.length}+`, label: "Verified Sellers", icon: <Shield className="w-6 h-6" /> },
    { value: "50+", label: "Brands", icon: <Award className="w-6 h-6" /> },
    { value: "100+", label: "Categories", icon: <Tag className="w-6 h-6" /> },
    { value: "12+", label: "Years", icon: <Clock className="w-6 h-6" /> }
  ];

  const features = [
    {
      icon: <CheckCircle className="w-10 h-10" />,
      title: "Verified Sellers",
      description: "Each seller undergoes a rigorous verification process for quality assurance"
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Quality Guarantee",
      description: "All products are backed by our comprehensive quality guarantee"
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: "Premium Selection",
      description: "Curated collection of premium brands and artisans"
    },
    {
      icon: <Globe className="w-10 h-10" />,
      title: "Global Network",
      description: "Access sellers from around the world with diverse offerings"
    }
  ];




  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
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
          <ChevronRight className="w-5 h-5 rotate-180" />
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
              MEET OUR <span className="text-gold-400">VERIFIED</span> SELLERS
            </h1>

            <p className="text-gray-200 text-base md:text-lg mb-8 max-w-xl">
              Discover trusted partners offering premium products and exceptional service. Each seller is carefully vetted for quality and authenticity.
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
                  EXPLORE SELLERS
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Why Our Sellers Stand Out</h2>
            <div className="w-16 h-1 bg-gold-400 mx-auto" />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              We partner only with the best - sellers who share our commitment to quality, authenticity, and excellence.
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
              <Store className="w-8 h-8 text-gold-400 mr-3" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Our Premium Partners</h2>
            </div>
            <div className="w-16 h-1 bg-gold-400 mx-auto" />
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Meet our carefully selected network of verified sellers and brands
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search sellers by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg pl-12 pr-4 py-4 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
              />
            </div>
          </motion.div>

          {loadingSellers ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden h-96 animate-pulse shadow-sm">
                  <div className="h-3/4 w-full bg-gray-200" />
                  <div className="h-1/4 p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayedSellers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedSellers.map((seller, index) => (
                <motion.div
                  key={seller._id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className={`bg-white rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 ${
                    selectedSeller === seller._id ? 'scale-95 opacity-50' : ''
                  }`}
                >
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => handleSellerClick(seller._id)}
                  >
                    <div className="relative h-64">
                      <img
                        src={seller.Image || "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&h=300&fit=crop&auto=format&q=80"}
                        alt={seller.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&h=300&fit=crop&auto=format&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      
                      <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </div>
                      
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-white font-bold text-xl mb-1">{seller.name}</h3>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-gold-400 mr-1" />
                          <span className="text-gray-200 text-sm">Premium Partner</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-white">
                      <div className="flex items-center mb-3">
                        {seller.address && (
                          <div className="flex items-center text-gray-600 text-sm mr-4">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="truncate">{seller.address.split(',')[0]}</span>
                          </div>
                        )}
                        <div className="flex items-center text-gray-600 text-sm">
                          <Tag className="w-4 h-4 mr-1" />
                          <span>{seller.categories?.length || 0} categories</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {seller.description || "Premium seller offering curated collections and exceptional service."}
                      </p>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div>
                          <div className="text-sm text-gray-500">Member since</div>
                          <div className="text-sm font-medium text-gray-900">{formatDate(seller.createdAt)}</div>
                        </div>
                        <div className="flex items-center text-gold-400 group-hover:text-gold-500 transition-colors">
                          <span className="text-sm font-medium mr-2">View Profile</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Store className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Sellers Found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}

          {sellers.length > 8 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center mt-12"
            >
              <button
                onClick={() => setShowAll(!showAll)}
                className="group relative overflow-hidden rounded-full px-8 py-3 bg-black text-white hover:bg-gray-900 transition-colors duration-300"
              >
                <span className="relative z-10 flex items-center">
                  {showAll ? 'Show Less' : 'View All Sellers'}
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SellerPages;