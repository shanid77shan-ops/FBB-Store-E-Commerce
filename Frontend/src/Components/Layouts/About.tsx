import { MapPin, Phone, Mail, Clock, Instagram, Users, Award, Globe, Shield,Star, Quote } from "lucide-react"
import Footer from "./Footer"
import { motion } from "framer-motion"
import { RiStarFill } from "react-icons/ri"

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

interface CEOInfo {
  name: string;
  title: string;
  instagram: string;
  bio: string;
}

const AboutPage = () => {
  const contactInfo: ContactInfo = {
    address: "Nooras Tower, near Supplyco, Chettipadi, Kerala 676319",
    phone: "+91 90612 56500",
    email: "fbbstore1@gmail.com",
    hours: "Mon-Sat: 9:00 AM - 8:00 PM"
  };

  const ceoInfo: CEOInfo = {
    name: "Murshid Ul Haq",
    title: "Founder & CEO",
    instagram: "@murshid__nooras",
    bio: "With over 5 years of experience in the retail industry, Murshid founded FBB Store with a passion for making premium fashion accessible to everyone while maintaining uncompromising quality standards."
  };

  const statistics = [
    { value: "150K+", label: "Happy Customers" },
    { value: "50+", label: "Premium Brands" },
    { value: "100+", label: "Categories" },
    { value: "12+", label: "Years" }
  ];

  const values = [
    {
      icon: <Award className="w-10 h-10" />,
      title: "Excellence",
      description: "Commitment to providing only the finest quality products"
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Integrity",
      description: "Transparent and honest business practices"
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "Community",
      description: "Building lasting relationships with our customers"
    },
    {
      icon: <Globe className="w-10 h-10" />,
      title: "Innovation",
      description: "Constantly evolving to meet customer needs"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fashion Influencer",
      content: "FBB Store has completely transformed my shopping experience. Their curation is exceptional.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Style Collector",
      content: "The quality and attention to detail in every product is truly remarkable.",
      rating: 5
    },
    {
      name: "Emma Williams",
      role: "Style Editor",
      content: "A trusted destination for premium fashion that never disappoints.",
      rating: 5
    }
  ];

  return (
    <>
 
      <div className="min-h-screen bg-white mt-16">
        {/* Hero Section */}
        <div className="relative h-[400px] md:h-[500px] overflow-hidden bg-black">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=600&fit=crop&auto=format&q=80"
              alt="FBB Store"
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
                ABOUT <span className="text-gold-400">FBB STORE</span>
              </h1>

              <p className="text-gray-200 text-base md:text-lg mb-8 max-w-xl">
                Redefining fashion retail with premium quality, exceptional service, and curated collections since 2010.
              </p>
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
                  <div className="text-3xl md:text-4xl font-bold text-gold-400 mb-2">{stat.value}</div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Founded in 2010 by Murshid Ul Haq, FBB Store emerged from a vision to blend traditional craftsmanship 
                    with contemporary style. What started as a small boutique has grown into a premier destination for 
                    premium fashion and lifestyle products.
                  </p>
                  <p>
                    We believe in the power of quality and authenticity. Every product in our collection is carefully 
                    selected by our team of experts, ensuring it meets our high standards of craftsmanship and design.
                  </p>
                  <p>
                    Our mission is to provide our customers with more than just products - we offer an experience that 
                    celebrates quality, style, and individuality.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&auto=format&q=80"
                    alt="FBB Store Interior"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gray-50 py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Award className="w-12 h-12 text-gold-400 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <div className="w-16 h-1 bg-gold-400 mx-auto" />
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                The principles that guide everything we do at FBB Store
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 mx-auto mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CEO Section */}
        <div className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-gray-900 p-8 flex flex-col items-center justify-center">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gold-400 mb-6">
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&auto=format&q=80"
                      alt={ceoInfo.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{ceoInfo.name}</h3>
                  <p className="text-gold-400 font-medium mb-4">{ceoInfo.title}</p>
                  <a
                    href={`https://instagram.com/${ceoInfo.instagram.replace('@', '')}`}
                    className="inline-flex items-center gap-2 text-white hover:text-gold-400 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                    <span>{ceoInfo.instagram}</span>
                  </a>
                </div>
                <div className="md:col-span-2 p-8">
                  <Quote className="w-12 h-12 text-gold-400 mb-6" />
                  <p className="text-xl text-gray-700 italic mb-6 leading-relaxed">
                    "Our mission is to create more than just a shopping experience. We're building a community around 
                    quality, authenticity, and exceptional service. Every product tells a story, and we're here to 
                    share those stories with you."
                  </p>
                  <p className="text-gray-600">{ceoInfo.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-gray-50 py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Star className="w-12 h-12 text-gold-400 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
              <div className="w-16 h-1 bg-gold-400 mx-auto" />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
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

        {/* Contact Section */}
        <div className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Get In Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                      <p className="text-gray-600">{contactInfo.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 flex-shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <p className="text-gray-600">{contactInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 flex-shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">{contactInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 flex-shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                      <p className="text-gray-600">{contactInfo.hours}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gold-400 text-white font-semibold py-3 rounded-lg hover:bg-gold-500 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;