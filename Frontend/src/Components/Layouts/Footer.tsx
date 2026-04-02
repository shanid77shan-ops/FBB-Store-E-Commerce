import { Link } from "react-router-dom"
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Truck,
  Headphones,
  Shield,
  CreditCard,
  Gift,
} from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const shopCategories = [
    { name: "Men's Fashion", href: "/shop" },
    { name: "Women's Fashion", href: "/shop" },
    { name: "Accessories", href: "/shop" },
    { name: "Footwear", href: "/shop" },
    { name: "Watches", href: "/shop" },
    { name: "Sunglasses", href: "/shop" },
    { name: "Bags & Luggage", href: "/shop" },
    { name: "Jewelry", href: "/shop" }
  ];

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Our Story", href: "/about" },
    // { name: "Privacy Policy", href: "/privacy" },
    // { name: "Terms of Service", href: "/terms" },
    // { name: "Cookie Policy", href: "/cookies" }
  ];

  const customerService = [
    { name: "Contact Us", href: "/contact" },
    // { name: "Shipping Information", href: "/shipping" },
    // { name: "Returns & Exchanges", href: "/returns" },
    // { name: "Size Guide", href: "/size-guide" },
    // { name: "FAQs", href: "/faq" },
    // { name: "Store Locator", href: "/stores" },
    // { name: "Gift Cards", href: "/gift-cards" },
    // { name: "Order Tracking", href: "/track-order" }
  ];

  const features = [
    {
      icon: <Truck className="w-10 h-10" />,
      title: "Free Worldwide Shipping",
      description: "On orders over $500"
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Authenticity Guaranteed",
      description: "100% genuine luxury products"
    },
    {
      icon: <CreditCard className="w-10 h-10" />,
      title: "Secure Payment",
      description: "256-bit SSL encryption"
    },
    {
      icon: <Headphones className="w-10 h-10" />,
      title: "24/7 Support",
      description: "Personal luxury consultants"
    },
    {
      icon: <Gift className="w-10 h-10" />,
      title: "Gift Services",
      description: "Personalized packaging"
    }
  ];

  return (
    <footer className="bg-black text-white">
      {/* Features Banner */}
      <div className="border-t border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="text-gold-400 mb-3">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-gray-400 text-xs">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="text-3xl font-bold tracking-wider">FBB LUXURY</div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Redefining luxury fashion since 2010. We curate the finest collections from world-renowned designers, bringing exceptional quality and timeless elegance to discerning individuals worldwide.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gold-400" />
                <span className="text-sm">Calicut Road, Malappuram, Kerala 676552</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gold-400" />
                <span className="text-sm">fbbstore1@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gold-400" />
                <span className="text-sm">+91 7012551507</span>
              </div>
            </div>
            <div className="flex space-x-4 pt-4">
              <a href="https://www.instagram.com/fbb_store_?igsh=NWU0c2RpbW95a3Ro" 
                 className="text-gray-400 hover:text-gold-400 transition-colors duration-300"
                 target="_blank"
                 rel="noopener noreferrer">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors duration-300">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h3 className="text-lg font-bold mb-6 pb-3 border-b border-gray-800">SHOP</h3>
            <ul className="space-y-3">
              {shopCategories.map((category) => (
                <li key={category.name}>
                  <Link 
                    to={category.href}
                    className="text-gray-400 hover:text-gold-400 transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span className="w-1 h-1 bg-gold-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 pb-3 border-b border-gray-800">COMPANY</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-400 hover:text-gold-400 transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span className="w-1 h-1 bg-gold-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-6 pb-3 border-b border-gray-800">CUSTOMER SERVICE</h3>
            <ul className="space-y-3">
              {customerService.map((service) => (
                <li key={service.name}>
                  <Link 
                    to={service.href}
                    className="text-gray-400 hover:text-gold-400 transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span className="w-1 h-1 bg-gold-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-4">JOIN OUR LUXURY COMMUNITY</h3>
            <p className="text-gray-400 mb-6 text-sm">
              Be the first to discover new collections, exclusive offers, and luxury fashion insights
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-grow px-4 py-3 bg-gray-900 border border-gray-800 rounded-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
              />
              <button className="px-6 py-3 bg-gold-400 text-black font-semibold rounded-sm hover:bg-gold-500 transition-colors duration-300 whitespace-nowrap">
                SUBSCRIBE
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-3">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from FBB Luxury
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} FBB Store. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <span>Language:</span>
                <select className="bg-transparent border-none focus:outline-none text-white">
                  <option>English</option>
                 
                </select>
              </div>
             
              <div className="flex items-center space-x-2">
                <span>Country:</span>
                <select className="bg-transparent border-none focus:outline-none text-white">
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>United Arab Emirates</option>
                  <option>India</option>
                  <option>Singapore</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-xs">
              FBB Store is a registered trademark. All products are authentic and sourced directly from authorized distributors.
              Prices are inclusive of all taxes where applicable.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}