import { useState, useEffect, useRef } from "react"
import { Button } from "../Layouts/button"
import { ChevronLeft, ChevronRight, Heart, Share2, ShoppingBag, Truck, Shield, Play, Star, Package, Globe, CheckCircle, ArrowRight, Sparkles, Tag, Scale, Ruler, Palette, Diamond, Hash, Percent, MapPin, Users } from "lucide-react"
import { cn } from "../../lib/util"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import { baseurl } from "../../Constant/Base"
import NavBar from "../Layouts/Navbar"
import Footer from "../Layouts/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-hot-toast"
import { Eye, Phone, Mail } from "lucide-react"

interface ProductImages {
  image1: string
  image2: string
  image3: string
  image4: string
}

interface ProductVideos {
  video1?: string
  video2?: string
}

interface ProductSpecifications {
  [key: string]: string
}

interface ProductData {
  _id: string
  name: string
  brand: string
  priceINR: number
  priceAED: number
  subCategoryId: Category
  categoryId: Category
  active: boolean
  images: ProductImages
  videos?: ProductVideos
  description: string
  shortDescription: string
  specifications: ProductSpecifications
  sku: string
  stock: number
  lowStockThreshold: number
  weight: {
    value: number
    unit: string
  }
  dimensions: {
    length: number
    width: number
    height: number
    unit: string
  }
  colors: string[]
  sizes: string[]
  material: string
  warranty: {
    period: number
    unit: string
    description: string
  }
  tags: string[]
  trending: boolean
  featured: boolean
  discount: {
    percentage: number
    amount: number
    startDate: string
    endDate: string
  }
  rating: {
    average: number
    count: number
  }
  soldCount: number
  viewCount: number
  type: string
  shippingInfo: {
    weightBased: boolean
    freeShipping: boolean
    shippingCost: number
  }
  metaTitle: string
  metaDescription: string
  metaKeywords: string[]
  createdAt: string
  updatedAt: string
  seller: Seller
}

interface Seller {
  name: string,
  DXB: string,
  INR: string,
  Image: string,
  address?: string,
  email?: string,
  phone?: string,
  companyName?: string,
  city?: string,
  state?: string,
  country?: string,
  pincode?: string
}

interface Category {
  name: string,
  _id: string,
}

interface RelatedProduct {
  _id: string
  name: string
  brand: string
  priceINR: number
  priceAED: number
  images: ProductImages
  category: string
  stock: number
  rating: {
    average: number
    count: number
  }
}

interface MediaItem {
  type: 'image' | 'video'
  url: string
}

interface ImageMagnifierProps {
  media: MediaItem[]
  currentIndex: number
  productName: string
}

const ImageMagnifier = ({ media, currentIndex, productName }: ImageMagnifierProps) => {
  const [showZoom, setShowZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const currentItem = media[currentIndex];

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }

    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || currentItem.type !== 'image') return;

    const { left, top } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / dimensions.width) * 100;
    const y = ((e.clientY - top) / dimensions.height) * 100;

    setPosition({ x, y });
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-900 shadow-2xl group"
      onMouseEnter={() => currentItem.type === 'image' && setShowZoom(true)}
      onMouseLeave={() => setShowZoom(false)}
      onMouseMove={handleMouseMove}
    >
      {currentItem.type === 'image' ? (
        <>
          <img
            src={currentItem.url || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=800&fit=crop&auto=format&q=80"}
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {showZoom && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div
                className="absolute w-40 h-40 border-2 border-white rounded-full overflow-hidden shadow-2xl transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${Math.min(Math.max(position.x, 16), 84)}%`,
                  top: `${Math.min(Math.max(position.y, 16), 84)}%`,
                }}
              >
                <div
                  className="absolute w-full h-full"
                  style={{
                    transform: `translate(-${position.x * 16}%, -${position.y * 16}%)`,
                    transformOrigin: 'top left',
                    width: '1600%',
                    height: '1600%'
                  }}
                >
                  <img
                    src={currentItem.url || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=800&fit=crop&auto=format&q=80"}
                    alt={productName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <video 
          src={currentItem.url}
          controls
          autoPlay={false}
          className="w-full h-full object-contain"
        />
      )}
    </div>
  );
};

const RatingStars = ({ rating = 0 }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating)
              ? "fill-gold-400 text-gold-400"
              : i < rating
              ? "fill-gold-400 text-gold-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      <span className="text-sm text-gray-500">({Math.floor(Math.random() * 500) + 100} reviews)</span>
    </div>
  );
};

const SpecificationItem = ({ title, value }: { title: string; value: string }) => (
  <div className="flex justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-gray-600 font-medium">{title}</span>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);

export default function ProductPage() {
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0)
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [region, setRegion] = useState<'IN' | 'AE'>('IN')
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [scrolled, setScrolled] = useState(false)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'seller' | 'reviews'>('description')
  const { id } = useParams<{ id: string }>()

  const PHONE_NUMBERS = {
    IN: productData?.seller.INR,
    AE: productData?.seller.DXB
  }

  const api = axios.create({
    baseURL: baseurl,
  })
  const token = localStorage.getItem('token');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timezone.includes('Asia/Dubai') || timezone.includes('Asia/Muscat')) {
      setRegion('AE')
    }
  }, [])

  const getDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/get-product/${id}`)
      setProductData(response.data.product)
      
      const images = response.data.product.images ? Object.values(response.data.product.images).filter(Boolean) as string[] : []
      const videos = response.data.product.videos ? Object.values(response.data.product.videos).filter(Boolean) as string[] : []
      
      const mediaArray: MediaItem[] = [
        ...images.map((url) => ({ type: 'image' as const, url })),
        ...videos.map((url) => ({ type: 'video' as const, url }))
      ]
      
      setMediaItems(mediaArray)
      
      // Set default color and size if available
      if (response.data.product.colors?.length > 0) {
        setSelectedColor(response.data.product.colors[0])
      }
      if (response.data.product.sizes?.length > 0) {
        setSelectedSize(response.data.product.sizes[0])
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      toast.error("Failed to load product details")
    } finally {
      setLoading(false)
    }
  }

  const getRelated = async () => {
    try {
      const category = productData?.subCategoryId?._id
      const seller = productData?.seller?.name
      const response = await api.get(`/get-related/${seller}/${category}`)
      setRelatedProducts(response.data.products || [])
    } catch (error) {
      console.error("Error fetching related products:", error)
    }
  }

  useEffect(() => {
    if (id) {
      getDetails()
    }
  }, [id])

  useEffect(() => {
    if (productData?.subCategoryId?._id) {
      getRelated()
    }
  }, [productData])

  const handleEnquiry = () => {
    if (productData) {
      const phoneNumber = PHONE_NUMBERS[region]
      const productUrl = window.location.href
      
      const priceDisplay = region === 'AE' 
        ? `AED ${productData.priceAED.toLocaleString()}`
        : `₹${productData.priceINR.toLocaleString()}`

      const message = encodeURIComponent(`
🛍️ *Check out this premium product!*

*${productData.brand} - ${productData.name}*

💰 *Price:* ${priceDisplay}
🏷️ *Brand:* ${productData.brand}
📦 *Category:* ${productData.subCategoryId.name}
📝 *Seller:* ${productData.seller.name}

🔍 *View Product:*
${productUrl}

I'm interested in this product. Could you please provide more information?`)

      window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
    }
  }

  const handleShare = async () => {
    if (productData) {
      try {
        const shareData = {
          title: `${productData.brand} ${productData.name}`,
          text: `Check out ${productData.brand} ${productData.name} - ₹${productData.priceINR.toLocaleString()}`,
          url: window.location.href
        }
        await navigator.share(shareData)
      } catch (err) {
        console.error('Error sharing:', err)
        navigator.clipboard.writeText(window.location.href)
        showToastMessage("Link copied to clipboard!")
      }
    }
  }

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      
      if (!productData) return;
  
      // Validate stock
      if (quantity > productData.stock) {
        toast.error(`Only ${productData.stock} items available in stock`);
        return;
      }
  
      // Validate variant selection if product has variants
      if (productData.colors && productData.colors.length > 0 && !selectedColor) {
        toast.error('Please select a color');
        return;
      }
  
      if (productData.sizes && productData.sizes.length > 0 && !selectedSize) {
        toast.error('Please select a size');
        return;
      }
  
      const response = await api.post('/cart/add', {
        productId: productData._id,
        quantity,
        color: selectedColor,
        size: selectedSize
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.data.success) {
        toast.success('Product added to cart!');
      } else {
        toast.error(response.data.message || 'Failed to add to cart');
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      if (error.response?.data?.message === 'Insufficient stock available') {
        toast.error('Insufficient stock available');
      } else {
        toast.error('Failed to add to cart');
      }
    } finally {
      setAddingToCart(false);
    }
  };
  const handleAddToWishlist = async () => {
    try {
      if (!productData) return;

      const response = await api.post('/wishlist/add', {
        productId: productData._id
      });

      if (response.data.success) {
        toast.success('Added to wishlist!');
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  const toggleWishlist = () => {
    if (isWishlisted) {
      // Remove from wishlist
      api.delete(`/wishlist/remove/${productData?._id}`)
        .then(() => {
          setIsWishlisted(false);
          toast.success('Removed from wishlist');
        })
        .catch(() => toast.error('Failed to remove from wishlist'));
    } else {
      handleAddToWishlist();
    }
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const calculateDiscountPrice = () => {
    if (!productData?.discount) return null;
    
    const discount = productData.discount;
    let discountedPrice = 0;
    
    if (discount.percentage > 0) {
      discountedPrice = region === 'AE' 
        ? productData.priceAED * (1 - discount.percentage / 100)
        : productData.priceINR * (1 - discount.percentage / 100);
    } else if (discount.amount > 0) {
      discountedPrice = region === 'AE' 
        ? productData.priceAED - discount.amount
        : productData.priceINR - discount.amount;
    }
    
    return discountedPrice;
  };

  const statistics = [
    { value: "150K+", label: "Happy Customers", icon: <Users className="w-4 h-4" /> },
    { value: `${productData?.soldCount || 0}+`, label: "Sold", icon: <ShoppingBag className="w-4 h-4" /> },
    { value: `${productData?.viewCount || 0}+`, label: "Views", icon: <Eye className="w-4 h-4" /> },
    { value: "30 Day", label: "Returns", icon: <Package className="w-4 h-4" /> }
  ];

  const features = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Authentic Product",
      description: "100% genuine with manufacturer warranty"
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: productData?.shippingInfo?.freeShipping ? "Free Shipping" : "Fast Shipping",
      description: productData?.shippingInfo?.freeShipping 
        ? "Free delivery on all orders" 
        : `Shipping: ₹${productData?.shippingInfo?.shippingCost || 0}`
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Quality Guarantee",
      description: "Premium quality certified products"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Standards",
      description: "Meeting international quality standards"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gold-400 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 animate-pulse">Loading product details...</p>
      </div>
    )
  }

  if (!productData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
          <Button
            variant="outline"
            className="mt-4 border-black text-black hover:bg-black hover:text-white"
            onClick={() => window.location.href = '/shop'}
          >
            Return to Shop
          </Button>
        </div>
      </div>
    )
  }

  const discountedPrice = calculateDiscountPrice();
  const isDiscounted = discountedPrice !== null;
  const currentPrice = region === 'AE' ? productData.priceAED : productData.priceINR;
  const displayPrice = isDiscounted ? discountedPrice : currentPrice;



  const PriceDisplay = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="space-y-2"
    >
      {isDiscounted && (
        <div className="flex items-center gap-3">
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 line-through">
            {region === 'AE' ? `AED ${productData.priceAED.toLocaleString()}` : `₹${productData.priceINR.toLocaleString()}`}
          </div>
          <div className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-bold">
            {productData.discount.percentage > 0 
              ? `${productData.discount.percentage}% OFF` 
              : `SAVE ${region === 'AE' ? 'AED' : '₹'}${productData.discount.amount}`}
          </div>
        </div>
      )}
      <div className="text-3xl sm:text-4xl font-bold text-gold-400">
        {region === 'AE' ? `AED ${displayPrice.toFixed(2)}` : `₹${displayPrice.toFixed(2)}`}
      </div>
      {region === 'AE' ? (
        <div className="text-lg text-gray-600">
          ₹{productData.priceINR.toLocaleString()}
        </div>
      ) : (
        <div className="text-lg text-gray-600">
          AED {productData.priceAED.toLocaleString()}
        </div>
      )}
    </motion.div>
  )

  const QuantityControls = () => (
    <div className="flex items-center gap-4 mb-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Quantity:</span>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(productData?.stock || 1, quantity + 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
            disabled={quantity >= (productData?.stock || 1)}
          >
            +
          </button>
        </div>
      </div>
      <div className="text-sm text-gray-600">
        {productData?.stock} available
        {productData?.lowStockThreshold && productData.stock <= productData.lowStockThreshold && (
          <span className="ml-2 text-yellow-600">(Low stock)</span>
        )}
      </div>
    </div>
  )

  const VariantSelectors = () => {
    if (!productData) return null;

    return (
      <div className="space-y-4 mb-6">
        {productData.colors && productData.colors.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Color <Palette size={12} className="inline ml-1" /></div>
            <div className="flex gap-2">
              {productData.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border rounded-lg text-sm transition-all ${
                    selectedColor === color
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {productData.sizes && productData.sizes.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Size</div>
            <div className="flex gap-2">
              {productData.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-lg text-sm transition-all ${
                    selectedSize === size
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const AddToCartButton = () => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleAddToCart}
      disabled={addingToCart || (productData?.stock || 0) === 0}
      className={`w-full bg-black text-white hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-3 text-base font-semibold h-14 rounded-lg ${
        addingToCart || (productData?.stock || 0) === 0 ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {addingToCart ? (
        <>
          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Adding...
        </>
      ) : (productData?.stock || 0) === 0 ? (
        'Out of Stock'
      ) : (
        <>
          <ShoppingBag className="h-5 w-5" />
          ADD TO CART
        </>
      )}
    </motion.button>
  )

  const renderSpecifications = () => {
    if (!productData) return null;

    const specs = [
      { title: "Material", value: productData.material, icon: <Diamond className="w-4 h-4" /> },
      { title: "SKU", value: productData.sku, icon: <Hash className="w-4 h-4" /> },
      { title: "Weight", value: productData.weight?.value ? `${productData.weight.value} ${productData.weight.unit}` : "N/A", icon: <Scale className="w-4 h-4" /> },
      { title: "Dimensions", value: productData.dimensions?.length ? `${productData.dimensions.length} × ${productData.dimensions.width} × ${productData.dimensions.height} ${productData.dimensions.unit}` : "N/A", icon: <Ruler className="w-4 h-4" /> },
      { title: "Warranty", value: productData.warranty?.period ? `${productData.warranty.period} ${productData.warranty.unit}` : "No warranty", icon: <Shield className="w-4 h-4" /> },
      { title: "Type", value: productData.type || "Standard", icon: <Tag className="w-4 h-4" /> },
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {specs.map((spec, index) => (
            spec.value && spec.value !== "N/A" && (
              <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="text-gray-600">{spec.icon}</div>
                <div>
                  <div className="text-sm text-gray-500">{spec.title}</div>
                  <div className="font-medium">{spec.value}</div>
                </div>
              </div>
            )
          ))}
        </div>

        {Object.keys(productData.specifications || {}).length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-4">Detailed Specifications</h4>
            <div className="space-y-2">
              {Object.entries(productData.specifications).map(([key, value]) => (
                <SpecificationItem key={key} title={key} value={value} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSellerInfo = () => {
    if (!productData?.seller) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl">
          <div className="relative w-20 h-20 overflow-hidden rounded-full border-2 border-white shadow-lg flex-shrink-0">
            <img 
              src={productData.seller.Image || "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=100&h=100&fit=crop&auto=format&q=80"} 
              alt={productData.seller.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=100&h=100&fit=crop&auto=format&q=80";
              }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-xl font-bold text-gray-900">{productData.seller.name}</h4>
              {productData.seller.companyName && (
                <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                  {productData.seller.companyName}
                </span>
              )}
              <span className="bg-green-50 text-green-600 text-xs font-medium px-2 py-1 rounded-full">Verified Seller</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {productData.seller.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{productData.seller.phone}</span>
                </div>
              )}
              {productData.seller.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{productData.seller.email}</span>
                </div>
              )}
              {productData.seller.address && (
                <div className="flex items-center gap-2 md:col-span-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{productData.seller.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gold-400">{productData.rating.count}</div>
            <div className="text-sm text-gray-600">Products Rated</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gold-400">{productData.soldCount}</div>
            <div className="text-sm text-gray-600">Items Sold</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gold-400">{productData.viewCount}</div>
            <div className="text-sm text-gray-600">Product Views</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gold-400">{productData.trending ? "Yes" : "No"}</div>
            <div className="text-sm text-gray-600">Trending</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />
      
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-black text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
          >
            <CheckCircle className="h-5 w-5" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className="flex-grow">
        <div className="relative bg-black py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statistics.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-gold-400">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gold-400">{stat.value}</div>
                  </div>
                  <div className="text-gray-300 text-sm mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row gap-8 lg:gap-12"
          >
            <div className="w-full lg:w-1/2">
              <div className="relative group mb-6">
                {mediaItems.length > 0 && (
                  <ImageMagnifier 
                    media={mediaItems}
                    currentIndex={currentMediaIndex}
                    productName={`${productData.brand} ${productData.name}`}
                  />
                )}
                
                {mediaItems.length > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCurrentMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/80 p-3 rounded-full text-white shadow-xl hover:bg-black transition-colors z-10"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCurrentMediaIndex((prev) => (prev + 1) % mediaItems.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/80 p-3 rounded-full text-white shadow-xl hover:bg-black transition-colors z-10"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </motion.button>
                  </>
                )}
              </div>

              <div className="grid grid-cols-4 gap-3">
                {mediaItems.map((item, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentMediaIndex(index)}
                    className={cn(
                      "w-full transition-all rounded-lg overflow-hidden hover:shadow-md",
                      currentMediaIndex === index 
                        ? "ring-2 ring-gold-400 ring-offset-2" 
                        : "ring-1 ring-gray-200"
                    )}
                  >
                    <div className="w-full aspect-square relative">
                      {item.type === 'image' ? (
                        <img
                          src={item.url || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop&auto=format&q=80"}
                          alt={`View ${index + 1}`}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <div className="absolute inset-0">
                            <div 
                              className="w-full h-full bg-center bg-cover bg-no-repeat"
                              style={{ backgroundImage: `url(${mediaItems.find(i => i.type === 'image')?.url})`, filter: 'blur(1px)' }}
                            />
                          </div>
                          <div className="relative z-10 bg-black/60 rounded-full p-2">
                            <Play className="h-4 w-4 text-white" fill="white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="space-y-3"
              >
                <nav className="flex items-center text-sm text-gray-500 space-x-2">
                  <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
                  <ChevronRight className="h-3 w-3" />
                  <Link to="/shop" className="hover:text-gold-400 transition-colors">Shop</Link>
                  <ChevronRight className="h-3 w-3" />
                  <Link 
                    to={`/category/${productData.categoryId._id}`} 
                    className="hover:text-gold-400 transition-colors"
                  >
                    {productData.categoryId.name}
                  </Link>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-gray-700">{productData.subCategoryId.name}</span>
                </nav>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-gold-400/10 text-gold-400 text-xs font-medium px-3 py-1 rounded-full">
                    {productData.brand}
                  </span>
                  {productData.trending && (
                    <span className="bg-red-100 text-red-600 text-xs font-medium px-3 py-1 rounded-full">
                      Trending
                    </span>
                  )}
                  {productData.featured && (
                    <span className="bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                  {productData.tags && productData.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {productData.name}
                </h1>
                
                {productData.shortDescription && (
                  <p className="text-gray-600 text-lg">
                    {productData.shortDescription}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <RatingStars rating={productData.rating.average} />
                <div className="text-sm text-gray-500">
                  • SKU: {productData.sku || "N/A"}
                </div>
              </motion.div>

              <PriceDisplay />

              <VariantSelectors />
              <QuantityControls />

              <div className="space-y-4">
                <AddToCartButton />
                
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEnquiry}
                    className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 text-sm font-semibold h-12 rounded-lg"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    ENQUIRE NOW
                  </motion.button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleShare}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 flex justify-center items-center gap-2 text-sm font-medium h-12 rounded-lg transition-all"
                    >
                      <Share2 className="h-4 w-4" />
                      SHARE
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={toggleWishlist}
                      className={cn(
                        "w-full flex justify-center items-center gap-2 text-sm font-medium h-12 rounded-lg transition-all",
                        isWishlisted
                          ? "bg-red-50 text-red-500 border border-red-200 hover:bg-red-100"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      )}
                    >
                      <Heart className={cn("h-4 w-4", isWishlisted ? "fill-red-500" : "")} />
                      {isWishlisted ? "SAVED" : "WISHLIST"}
                    </motion.button>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="pt-6 border-t border-gray-100"
              >
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{feature.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{feature.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="space-y-6 pt-6 border-t border-gray-100"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="relative w-14 h-14 overflow-hidden rounded-full border-2 border-white shadow-md flex-shrink-0">
                      <img 
                        src={productData.seller.Image || "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=100&h=100&fit=crop&auto=format&q=80"} 
                        alt={productData.seller.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=100&h=100&fit=crop&auto=format&q=80";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-gray-900">{productData.seller.name}</h4>
                        <span className="bg-green-50 text-green-600 text-xs font-medium px-2 py-1 rounded-full">Verified Seller</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Premium authorized retailer</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-500">CATEGORY</div>
                      <div className="text-gray-900">{productData.subCategoryId.name}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-500">BRAND</div>
                      <div className="text-gray-900">{productData.brand}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-500">PRODUCT ID</div>
                      <div className="text-gray-900">{productData._id.substring(0, 8).toUpperCase()}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-500">AVAILABILITY</div>
                      <div className={`font-medium ${productData.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {productData.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Product Details Tabs */}
          <div className="mt-12">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {[
                  { key: 'description', label: 'Description' },
                  { key: 'specifications', label: 'Specifications' },
                  { key: 'seller', label: 'Seller Info' },
                  { key: 'reviews', label: 'Reviews' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={cn(
                      "py-4 px-1 text-sm font-medium border-b-2 transition-colors",
                      activeTab === tab.key
                        ? "border-black text-black"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="py-8">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <h3 className="text-2xl font-bold mb-6">Product Description</h3>
                  <div className="text-gray-700 space-y-4">
                    <p className="text-lg leading-relaxed">{productData.description}</p>
                    
                    {productData.discount && productData.discount.endDate && (
                      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Percent className="h-5 w-5 text-yellow-600" />
                          <span className="font-semibold text-yellow-800">Special Offer!</span>
                        </div>
                        <p className="text-yellow-700 mt-2">
                          This offer ends on {new Date(productData.discount.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && renderSpecifications()}

              {activeTab === 'seller' && renderSellerInfo()}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="text-center p-6 bg-gray-50 rounded-xl">
                      <div className="text-4xl font-bold mb-2">{productData.rating.average.toFixed(1)}</div>
                      <RatingStars rating={productData.rating.average} />
                      <div className="text-sm text-gray-600 mt-2">{productData.rating.count} reviews</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold mb-4">Customer Reviews</h4>
                      <p className="text-gray-600">
                        Customers love this product for its quality and design. Be the first to share your experience!
                      </p>
                    </div>
                  </div>
                  
                  <button className="px-6 py-3 border border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors">
                    Write a Review
                  </button>
                </div>
              )}
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-16 pt-16 border-t border-gray-200">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <Sparkles className="h-10 w-10 text-gold-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">You Might Also Like</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Discover more premium products from our curated collection
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {relatedProducts.slice(0, 4).map((product) => (
                    <motion.div
                      key={product._id}
                      whileHover={{ y: -8 }}
                      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => window.location.href = `/product/${product._id}`}
                    >
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={product.images.image1 || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop&auto=format&q=80"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <div className="text-white font-semibold">{product.brand}</div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1 mb-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <RatingStars rating={product.rating?.average || 0} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-gray-900">
                            ₹{product.priceINR.toLocaleString()}
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gold-400 transition-colors" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="text-center pt-4">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 text-gold-400 font-medium hover:text-gold-500 transition-colors"
                  >
                    View All Products
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 1 : 0 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-xl hover:bg-gray-900 transition-all z-40 hover:scale-110"
      >
        <ChevronRight className="text-white h-6 w-6 rotate-270" />
      </motion.button>

      <Footer />
    </div>
  )
}

// Missing icons import
