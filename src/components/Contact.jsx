import React, { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const sectionRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    // Initialize EmailJS
    emailjs.init("WV1zsD8aIemkwGRuy")

    return () => observer.disconnect()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all fields')
      return
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      await emailjs.send('service_5u0tz67', 'template_tx3vwlo', formData)
      alert("Message sent successfully!")
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error(error)
      alert("Failed to send message. Try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactItems = [
    {
      icon: "fas fa-envelope",
      title: "Email",
      value: "kavinnandhakavin@gmail.com"
    },
    {
      icon: "fas fa-phone",
      title: "Phone",
      value: "+91 9345569707"
    }
  ]

  const socialLinks = [
    {
      platform: "GitHub",
      url: "https://github.com/kavinnandha",
      icon: "fab fa-github"
    },
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/kavinnandha/",
      icon: "fab fa-linkedin"
    },
    {
      platform: "Twitter",
      url: "https://twitter.com/kavinnandha",
      icon: "fab fa-twitter"
    }
  ]

  return (
    <section id="contact" className="min-h-screen flex items-center py-16 bg-gray-950" ref={sectionRef}>
      <div className="container mx-auto max-w-6xl px-8 w-full">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p className="text-gray-400 text-lg">Let's work together</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <h3 className="text-2xl lg:text-3xl font-semibold mb-4 text-cyan-400">
              Let's Connect
            </h3>
            
            <p className="text-gray-400 mb-8 leading-relaxed">
              I'm always open to discussing new opportunities and interesting projects. Feel free to reach out!
            </p>

            {/* Contact Items */}
            <div className="space-y-6 mb-8">
              {contactItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-cyan-400">
                    <i className={item.icon}></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{item.title}</h4>
                    <p className="text-gray-400">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex gap-4 flex-wrap">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-cyan-400 hover:bg-cyan-400 hover:text-gray-950 hover:transform hover:-translate-y-2 transition-all duration-300"
                  aria-label={social.platform}
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-800 border-2 border-transparent rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 transition-all duration-300"
                  required
                />
              </div>
              
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-800 border-2 border-transparent rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 transition-all duration-300"
                  required
                />
              </div>
              
              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-800 border-2 border-transparent rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 transition-all duration-300"
                  required
                />
              </div>
              
              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows="6"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-800 border-2 border-transparent rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 transition-all duration-300 resize-vertical"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-950 rounded-xl font-medium hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-700">
          <p className="text-gray-400">&copy; 2025 Kavin Nandha M K. All rights reserved.</p>
        </div>
      </div>
    </section>
  )
}

export default Contact
