import { MapPin, Phone,  Clock, MessageSquare, Send, Sparkles } from "lucide-react"
import Footer from "../Layouts/Footer"
import NavBar from "../Layouts/Navbar"
import { motion } from "framer-motion"
import { useState } from "react"

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const contactInfo = {
    address: "Nooras Tower, near Supplyco, Chettipadi, Kerala 676319",
    phone: "+91 90612 56500",
    email: "fbbstore1@gmail.com",
    hours: "Mon-Sat: 9:00 AM - 8:00 PM",
    whatsapp: "+91 90612 56500"
  }

  const departments = [
    {
      name: "Customer Support",
      description: "For order inquiries, returns, and general assistance",
      email: "support@fbbstore.com",
      response: "Within 24 hours"
    },
    {
      name: "Sales & Wholesale",
      description: "For bulk orders and partnership inquiries",
      email: "sales@fbbstore.com",
      response: "Within 48 hours"
    },
    {
      name: "Careers",
      description: "Join our team and grow with us",
      email: "careers@fbbstore.com",
      response: "Within 72 hours"
    }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitStatus("success")
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      })
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus("idle"), 5000)
    }
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hello FBB Store, I'd like to get in touch regarding: `)
    window.open(`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}?text=${message}`, "_blank")
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-white mt-16">
        {/* Hero Section */}
        <div className="relative h-[300px] md:h-[400px] overflow-hidden bg-black">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img
              src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&h=400&fit=crop&auto=format&q=80"
              alt="Contact Us"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
          </motion.div>

          <div className="relative h-full flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center w-full"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "80px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="h-0.5 bg-gold-400 mb-6 mx-auto"
              />
              
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                GET IN <span className="text-gold-400">TOUCH</span>
              </h1>

              <p className="text-gray-200 text-base md:text-lg max-w-2xl mx-auto">
                We're here to help. Reach out to us for any inquiries, support, or feedback.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Visit Us</h3>
                <p className="text-gray-600">{contactInfo.address}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 mb-4">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600">{contactInfo.phone}</p>
                <button
                  onClick={handleWhatsApp}
                  className="mt-3 inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat on WhatsApp
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Hours</h3>
                <p className="text-gray-600">{contactInfo.hours}</p>
                <p className="text-gray-500 text-sm mt-2">Sunday: Closed</p>
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2"
              >
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <Send className="w-8 h-8 text-gold-400" />
                    <h2 className="text-2xl font-bold text-gray-900">Send Us a Message</h2>
                  </div>

                  {submitStatus === "success" && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
                      Thank you for your message! We'll get back to you soon.
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                      Something went wrong. Please try again.
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                          placeholder="+91 12345 67890"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject *
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                        >
                          <option value="">Select a subject</option>
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Order Support">Order Support</option>
                          <option value="Product Information">Product Information</option>
                          <option value="Partnership">Partnership</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gold-400 text-white font-semibold py-3 rounded-lg hover:bg-gold-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </div>
              </motion.div>

              {/* Departments & Quick Links */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Departments</h3>
                  <div className="space-y-4">
                    {departments.map((dept, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-gold-400 transition-colors">
                        <h4 className="font-semibold text-gray-900 mb-1">{dept.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{dept.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <a href={`mailto:${dept.email}`} className="text-gold-400 hover:text-gold-500">
                            {dept.email}
                          </a>
                          <span className="text-gray-500">{dept.response}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-900 text-white p-6 rounded-xl">
                  <Sparkles className="w-8 h-8 text-gold-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Need Immediate Help?</h3>
                  <p className="text-gray-300 mb-4">
                    For urgent inquiries, reach out to us directly via WhatsApp for the fastest response.
                  </p>
                  <button
                    onClick={handleWhatsApp}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Chat on WhatsApp
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Our Store</h2>
              <p className="text-gray-600">Visit us at our physical location</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.119256424282!2d76.2076895!3d10.9615486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7b9e5d5a5b5b5%3A0x5b5b5b5b5b5b5b5b!2sNooras%20Tower%2C%20Chettipadi%2C%20Kerala%20676319!5e0!3m2!1sen!2sin!4v1621234567890!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="FBB Store Location"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ContactPage