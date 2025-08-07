import React, { useEffect, useState } from 'react'

const Hero = () => {
  const [animatedName, setAnimatedName] = useState('')
  const fullName = 'Kavin Nandha M K'

  useEffect(() => {
    let i = 0
    const typeWriter = () => {
      if (i < fullName.length) {
        setAnimatedName(fullName.slice(0, i + 1))
        i++
        setTimeout(typeWriter, 100)
      }
    }
    
    setTimeout(typeWriter, 1000)
  }, [])

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="min-h-screen flex items-center relative overflow-hidden p-8">
      {/* Animated Background */}
      <div className="absolute inset-0 z-[-1]">
        <div className="absolute inset-0 bg-gradient-radial from-cyan-400/10 via-transparent to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Hero Text */}
          <div className="text-center lg:text-left space-y-6 animate-fade-in-up">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              <span className="block opacity-0 animate-slide-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                Hi, I'm
              </span>
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent min-h-[1.2em]">
                {animatedName}
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 opacity-0 animate-fade-in" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
              Engineering Student & Full Stack Developer
            </p>
            
            <p className="text-gray-400 flex items-center justify-center lg:justify-start gap-2 opacity-0 animate-fade-in" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
              <i className="fas fa-map-marker-alt text-cyan-400"></i>
              Coimbatore, Tamil Nadu, India
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start opacity-0 animate-fade-in" style={{ animationDelay: '1.4s', animationFillMode: 'forwards' }}>
              <button
                onClick={() => scrollToSection('projects')}
                className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-950 rounded-full font-medium hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/30 transition-all duration-300"
              >
                View My Work
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="px-8 py-3 border-2 border-cyan-400 text-cyan-400 rounded-full font-medium hover:bg-cyan-400 hover:text-gray-950 hover:transform hover:-translate-y-1 transition-all duration-300"
              >
                Get In Touch
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex justify-center opacity-0 animate-fade-in-right" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <div className="relative w-72 h-72 lg:w-80 lg:h-80">
              {/* Rotating Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-spin-slow"></div>
              
              {/* Profile Placeholder */}
              <div className="absolute inset-2 bg-gray-800 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-6xl text-cyan-400"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

export default Hero
