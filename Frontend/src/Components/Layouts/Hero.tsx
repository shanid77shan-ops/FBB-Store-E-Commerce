import { useState, useEffect } from "react";
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiCheck } from "react-icons/fi";
import { RiStarFill } from "react-icons/ri";
import Hero2 from "../Layouts/Img/Hero2.jpg";
import fbbslide from "../Layouts/Img/fbbslide.jpeg";
import banner1 from "../Layouts/Img/banner1.jpg";
import slider1 from "../Layouts/Img/slider1.jpg";
import slider12 from "../Layouts/Img/slider1 2.jpeg";
import TrendingCarousel from "./Carousel";
import axios from "axios";
import { baseurl } from "../../Constant/Base";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Shield, Truck, Award, Sparkles, Zap, Heart, Users, Quote } from "lucide-react";

const Hero = ({ onShopNowClick = () => {} }) => {
  interface Seller {
    _id: string;
    name: string;
    Image:string;
  }
  
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const [loadingSellers, setLoadingSellers] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    return !sessionStorage.getItem('hasShownWelcome');
  });
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  
  const api = axios.create({
    baseURL: baseurl,
    timeout: 5000,
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
        sessionStorage.setItem('hasShownWelcome', 'true');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const heroSlides = [
    {
      image: fbbslide,
      heading: "Style Redefined",
      subheading: "Experience premium fashion crafted for the modern individual"
    },
    {
      image: isMobile ? slider12 : slider1,
      heading: "Timeless Collections",
      subheading: "Where heritage meets contemporary design"
    },
    {
      image: Hero2,
      heading: "Exclusive Creations",
      subheading: "Curated pieces for the discerning individual"
    }
  ];

  const [text] = useTypewriter({
    words: ["Elevate Your Style", "Discover Premium Fashion", "Curated Collections", "Timeless Design", "Exclusive Creations", "Redefine Your Wardrobe"],
    loop: true,
    delaySpeed: 2000,
    typeSpeed: 70,
    deleteSpeed: 50
  });

  useEffect(() => {
    if (isHovering) return;
    
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [isHovering, heroSlides.length]);

  const fetchSellers = async () => {
    setLoadingSellers(true);
    try {
      const cachedSellers = localStorage.getItem('cachedSellers');
      const cachedTimestamp = localStorage.getItem('cachedSellersTimestamp');
      const now = Date.now();
      
      if (
        cachedSellers &&
        cachedTimestamp &&
        (now - parseInt(cachedTimestamp)) < 300000
      ) {
        const parsedSellers = JSON.parse(cachedSellers);
      
        if (Array.isArray(parsedSellers) && parsedSellers.length > 0) {
          setSellers(parsedSellers);
          setLoadingSellers(false);
          return;
        }
      }
      
      
      const response = await api.get("/sellers");
      console.log(response)
      if(response.data && response.data.success && response.data.sellers) {
        const activeSellers = response.data.sellers
      
        setSellers(activeSellers);
        if (activeSellers.length > 0) {
          localStorage.setItem('cachedSellers', JSON.stringify(activeSellers));
          localStorage.setItem('cachedSellersTimestamp', now.toString());
        }
        
      }
    } catch (error) {
      console.error("Error fetching sellers:", error);
      const cachedSellers = localStorage.getItem('cachedSellers');
      if (cachedSellers) {
        try {
          const parsedSellers = JSON.parse(cachedSellers);
          setSellers(parsedSellers);
        } catch (e) {
          localStorage.removeItem('cachedSellers');
          localStorage.removeItem('cachedSellersTimestamp');
        }
      }
    } finally {
      setLoadingSellers(false);
    }
  };

  const fetchTrendingProducts = async () => {
    setLoadingTrending(true);
    try {
      const cachedTrending = localStorage.getItem('cachedTrending');
      const cachedTimestamp = localStorage.getItem('cachedTrendingTimestamp');
      const now = Date.now();
      
      if (cachedTrending && cachedTimestamp && (now - parseInt(cachedTimestamp)) < 300000) {
        setTrendingProducts(JSON.parse(cachedTrending));
        setLoadingTrending(false);
        return;
      }
      
      const response = await api.get("/products?trending=true&limit=8");
      
      if(response.data && response.data.success) {
        setTrendingProducts(response.data.products);
        localStorage.setItem('cachedTrending', JSON.stringify(response.data.products));
        localStorage.setItem('cachedTrendingTimestamp', now.toString());
      }
    } catch (error) {
      console.error("Error fetching trending products:", error);
      const cachedTrending = localStorage.getItem('cachedTrending');
      if (cachedTrending) {
        setTrendingProducts(JSON.parse(cachedTrending));
      }
    } finally {
      setLoadingTrending(false);
    }
  };

  useEffect(() => {
    fetchSellers();
    fetchTrendingProducts();
  }, []);

  const bannerSlides = [
    {
      image: banner1,
      title: "PREMIUM TIMEPIECES",
      description: "Discover our collection of premium watches from leading brands. Each piece combines precision engineering with elegant design.",
      accent: "#D4AF37"
    },
    {
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop",
      title: "DESIGNER EYEWEAR",
      description: "Protect your eyes in style with our selection of designer sunglasses.",
      accent: "#2C3E50"
    },
    {
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=600&fit=crop",
      title: "PREMIUM ACCESSORIES",
      description: "Complete your look with our premium accessories collection.",
      accent: "#1a1a1a"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  const nextSlide = () => setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  const nextBannerSlide = () => setCurrentBannerIndex((prev) => (prev + 1) % bannerSlides.length);
  const prevBannerSlide = () => setCurrentBannerIndex((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);

  const handleSellerClick = (sellerId: string) => navigate(`/seller-list/${sellerId}`);
  const handleClick = () => navigate("/seller-list");

  const displaySellers = sellers.slice(0, 4);

  const features = [
    {
      icon: <Truck className="w-10 h-10" />,
      title: "Worldwide Shipping",
      description: "Enjoy shipping on orders above $500 across 100+ countries"
    },
    {
      icon: <Clock className="w-10 h-10" />,
      title: "24/7 Support",
      description: "Access our dedicated consultants anytime for personalized assistance"
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Authenticity Guaranteed",
      description: "100% genuine products with comprehensive verification"
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: "Quality Craftsmanship",
      description: "Each piece is crafted using fine materials and traditional techniques"
    }
  ];



  const statistics = [
    { value: "150K+", label: "Happy Customers" },
    { value: "50+", label: "Premium Brands" },
    { value: "100+", label: "Countries" },
    { value: "12+", label: "Years" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fashion Influencer",
      content: "The quality and craftsmanship are exceptional. Every piece tells a story of attention to detail.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Style Collector",
      content: "I'm impressed by FBB's commitment to quality and authentic brands. Their curation is impeccable.",
      rating: 5
    },
    {
      name: "Emma Williams",
      role: "Style Editor",
      content: "FBB has redefined my shopping experience. Their curated collections and exceptional service are unmatched.",
      rating: 5
    }
  ];

  const styleQuotes = [
    {
      quote: "Style is a way to say who you are without having to speak.",
      author: "Rachel Zoe"
    },
    {
      quote: "Fashion is the armor to survive the reality of everyday life.",
      author: "Bill Cunningham"
    },
    {
      quote: "The joy of dressing is an art.",
      author: "John Galliano"
    }
  ];

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-white text-4xl md:text-7xl font-light tracking-widest mb-4">
                WELCOME TO <span className="font-bold text-gold-400">FBB</span>
              </h1>
              <p className="text-gray-300 text-lg md:text-xl">Redefining Style Excellence</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[900px] overflow-hidden group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
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
              src={heroSlides[currentSlideIndex].image}
              alt={heroSlides[currentSlideIndex].heading}
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <button 
          className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 bg-black/40 backdrop-blur-sm text-white p-3 rounded-full transition-all hover:bg-black/60 z-10"
          onClick={prevSlide}
        >
          <FiChevronLeft size={20} />
        </button>
        
        <button 
          className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 bg-black/40 backdrop-blur-sm text-white p-3 rounded-full transition-all hover:bg-black/60 z-10"
          onClick={nextSlide}
        >
          <FiChevronRight size={20} />
        </button>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlideIndex(index)}
              className={`h-2 rounded-full transition-all ${
                currentSlideIndex === index ? "w-8 bg-gold-400" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>

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
            
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              <span>{text}</span>
              <Cursor cursorColor='#D4AF37' />
            </h1>

            <p className="text-gray-200 text-base md:text-lg mb-8 max-w-xl">
              Discover curated collections that blend timeless elegance with contemporary design. Each piece tells a story of craftsmanship and attention to detail.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onShopNowClick}
                className="bg-gold-400 text-black hover:bg-gold-500 px-6 py-3 rounded-sm transition-all text-base font-semibold"
              >
                <Link to="/shop">
                  <span className="flex items-center justify-center">
                    SHOP NOW
                    <FiArrowRight className="ml-2" size={18} />
                  </span>
                </Link>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/about')}
                className="bg-transparent border border-white text-white hover:bg-white hover:text-black px-6 py-3 rounded-sm transition-all text-base font-semibold"
              >
                OUR STORY
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-black py-12 md:py-20">
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
                <div className="text-3xl md:text-5xl font-bold text-gold-400 mb-2">{stat.value}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white/90" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop&auto=format&q=80')] bg-fixed bg-center bg-cover opacity-10" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Why Choose FBB</h2>
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

      <div className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gold-400 mr-3" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Partners</h2>
            </div>
            <div className="w-16 h-1 bg-gold-400 mx-auto" />
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Collaborating with artisans and brands to bring you exceptional quality
            </p>
          </div>

          {loadingSellers ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden h-64 animate-pulse shadow-sm">
                  <div className="h-3/4 w-full bg-gray-200" />
                  <div className="h-1/4 p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : sellers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displaySellers.map((seller, index) => (
                <motion.div
                  key={seller._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => handleSellerClick(seller._id)}
                >
                  <div className="relative h-48">
                  <img
                src={
                  seller.Image ||
                  "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&h=300&fit=crop&auto=format&q=80"
                }
                alt={seller.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.src =
                    "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&h=300&fit=crop&auto=format&q=80";
                }}
/>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white font-bold text-lg">{seller.name}</h3>
                      <p className="text-gray-200 text-sm">View Collection</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Partners Available</h3>
              <p className="text-gray-500">We're working on bringing you the best partners. Check back soon!</p>
            </div>
          )}

          <div className="text-center mt-12">
            <button
              onClick={handleClick}
              className="inline-flex items-center px-6 py-3 bg-gold-400 text-black font-medium rounded-lg hover:bg-gold-500 transition-colors"
            >
              View All Partners
              <FiArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-900 z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop&auto=format&q=80')] bg-fixed bg-center bg-cover opacity-30" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden group shadow-2xl">
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentBannerIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <img
                    src={bannerSlides[currentBannerIndex].image}
                    alt={bannerSlides[currentBannerIndex].title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <button
                  onClick={prevBannerSlide}
                  className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={nextBannerSlide}
                  className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentBannerIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="p-6 lg:p-8 bg-white/10 backdrop-blur-sm rounded-xl"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {bannerSlides[currentBannerIndex].title}
                </h2>
                <p className="text-gray-200 mb-6 text-lg">
                  {bannerSlides[currentBannerIndex].description}
                </p>
                <button className="text-white hover:text-gold-400 font-medium flex items-center group">
                  Explore Collection
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="bg-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Quote className="w-10 h-10 text-gold-400 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Style & Inspiration</h2>
            <div className="w-16 h-1 bg-gold-400 mx-auto mt-4" />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {styleQuotes.map((item, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-gold-400 text-4xl mb-4">"</div>
                <p className="text-gray-700 italic text-lg mb-4">"{item.quote}"</p>
                <p className="text-gray-500 font-medium">— {item.author}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Curated Excellence</h3>
              <p className="text-gray-600 mb-4 text-lg">
                At FBB, we believe that true style transcends trends. Our collections are carefully curated to offer timeless pieces that tell a story of craftsmanship and authenticity.
              </p>
              <div className="space-y-3">
                {['Authenticity Verification', 'Quality Assurance', 'Sustainable Practices', 'Personalized Service'].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <FiCheck className="text-gold-400" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop&auto=format&q=80",
                "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=500&fit=crop&auto=format&q=80",
                "https://images.unsplash.com/photo-1544441893-675973e31985?w=400&h=500&fit=crop&auto=format&q=80",
                "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=500&fit=crop&auto=format&q=80"
              ].map((src, index) => (
                <div key={index} className="relative h-48 rounded-lg overflow-hidden shadow-md">
                  <img
                    src={src}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center">
                <Zap className="w-8 h-8 text-gold-400 mr-3" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Trending Now</h2>
              </div>
              <div className="w-16 h-1 bg-gold-400 mt-2" />
            </div>
            <div className="flex items-center space-x-2 text-gold-400 bg-gold-400/10 px-4 py-2 rounded-full">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium">HOT & TRENDING</span>
            </div>
          </div>

          {loadingTrending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-lg overflow-hidden h-80 animate-pulse">
                  <div className="h-3/4 bg-gray-200" />
                  <div className="h-1/4 p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : trendingProducts.length > 0 ? (
            <TrendingCarousel products={trendingProducts} />
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Zap className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Trending Products</h3>
              <p className="text-gray-500">Stay tuned for our latest trending collections.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heart className="w-10 h-10 text-gold-400 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Customer Stories</h2>
            <div className="w-16 h-1 bg-gold-400 mx-auto mt-4" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <RiStarFill key={i} className="text-gold-400 w-5 h-5" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6 text-lg leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 font-bold text-xl mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&h=800&fit=crop&auto=format&q=80')] bg-fixed bg-center bg-cover opacity-20" />
        
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-12 h-12 text-gold-400 mx-auto mb-6" />
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Join Our Community</h2>
          <div className="w-16 h-1 bg-gold-400 mx-auto mb-6" />
          <p className="text-gray-300 mb-8 text-lg">
            Subscribe for exclusive previews, styling tips, early access to new collections, and special offers delivered to your inbox.
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
        <RiStarFill className="text-gold-400 text-xl" />
      </motion.button>
    </div>
  );
};

export default Hero;