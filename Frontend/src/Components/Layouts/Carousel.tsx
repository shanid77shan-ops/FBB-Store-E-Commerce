import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  brand: string;
  priceINR: number;
  priceAED: number;
  description: string;
  images: {
    image1: string;
    image2?: string;
    image3?: string;
    image4?: string;
  };
  categoryId: {
    _id: string;
    name: string;
  };
  seller: {
    _id: string;
    name: string;
    image?: string;
  };
}

interface TrendingCarouselProps {
  products?: Product[];
}

const TrendingCarousel = ({ products = [] }: TrendingCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState(4);

  // Update visible items based on screen size
  useEffect(() => {
    const updateVisibleItems = () => {
      if (window.innerWidth < 640) {
        setVisibleItems(1);
      } else if (window.innerWidth < 1024) {
        setVisibleItems(2);
      } else if (window.innerWidth < 1280) {
        setVisibleItems(3);
      } else {
        setVisibleItems(4);
      }
    };

    updateVisibleItems();
    window.addEventListener('resize', updateVisibleItems);
    
    return () => window.removeEventListener('resize', updateVisibleItems);
  }, []);

  // Auto slide
  useEffect(() => {
    if (!isHovering && products.length > visibleItems) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => 
          prev + visibleItems >= products.length ? 0 : prev + 1
        );
      }, 4000);
      
      return () => clearInterval(interval);
    }
  }, [isHovering, products.length, visibleItems]);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + visibleItems >= products.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, products.length - visibleItems) : prev - 1
    );
  };

  const getVisibleProducts = () => {
    const start = currentIndex;
    const end = Math.min(start + visibleItems, products.length);
    return products.slice(start, end);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products available</p>
      </div>
    );
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div 
        ref={carouselRef}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {getVisibleProducts().map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group"
            >
              <Link to={`/product/${product._id}`}>
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={product.images.image1}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      Trending
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="text-sm font-semibold text-gold-400">
                        ₹{product.priceINR.toLocaleString()}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-2">
                      {product.brand}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {product.categoryId?.name || 'Category'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {product.seller?.name || 'Seller'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {products.length > visibleItems && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous"
          >
            <FiChevronLeft className="text-gray-600" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Next"
          >
            <FiChevronRight className="text-gray-600" />
          </button>
        </>
      )}

      {/* Indicators */}
      <div className="flex justify-center space-x-2 mt-6">
        {Array.from({ length: Math.ceil(products.length / visibleItems) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index * visibleItems)}
            className={`w-2 h-2 rounded-full transition-colors ${
              Math.floor(currentIndex / visibleItems) === index 
                ? 'bg-gold-400' 
                : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TrendingCarousel;