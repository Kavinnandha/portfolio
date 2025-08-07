import React, { useEffect, useRef, useState } from 'react'

const About = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="min-h-screen flex items-center py-16 bg-gray-900" ref={sectionRef}>
      <div className="container mx-auto max-w-6xl px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            About Me
          </h2>
          <p className="text-gray-400 text-lg">Get to know me better</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* About Text */}
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <h3 className="text-2xl lg:text-3xl font-semibold mb-6 text-cyan-400">
              Hello! I'm Kavin Nandha M K
            </h3>
            
            <div className="space-y-6 text-gray-400 leading-relaxed">
              <p>
                I'm a passionate engineering student specializing in full-stack development and UI/UX design.
                With expertise in modern web technologies and a keen eye for design, I create seamless digital
                experiences that combine functionality with aesthetics.
              </p>
              
              <p>
                My journey in technology spans across frontend frameworks like React and Vite, backend
                development with Node.js, MongoDB and Redis, and mobile app development for Android. I'm
                constantly learning and adapting to new technologies to stay at the forefront of innovation.
              </p>
            </div>
          </div>

          {/* About Image */}
          <div className={`flex justify-center transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative w-64 h-64 lg:w-72 lg:h-72">
              {/* Rotating Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-3xl transform rotate-45 animate-spin-reverse-slow"></div>
              
              {/* Code Icon Container */}
              <div className="absolute inset-5 bg-gray-950 rounded-2xl flex items-center justify-center">
                <i className="fas fa-code text-5xl lg:text-6xl text-cyan-400"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
