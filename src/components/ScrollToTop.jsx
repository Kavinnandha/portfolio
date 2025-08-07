import React, { useEffect, useState } from 'react'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const sections = ['home', 'about', 'projects', 'skills', 'contact']

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768) // Mobile if width < 768px
    }

    const updateCurrentSection = () => {
      const scrollPos = window.pageYOffset
      const viewportHeight = window.innerHeight

      for (let i = 0; i < sections.length; i++) {
        const section = document.getElementById(sections[i])
        if (section) {
          const sectionTop = section.offsetTop
          const sectionHeight = section.offsetHeight

          if (scrollPos >= sectionTop - viewportHeight / 2 && 
              scrollPos < sectionTop + sectionHeight - viewportHeight / 2) {
            setCurrentSection(i)
            break
          }
        }
      }
    }

    const toggleVisibility = () => {
      const scrolled = window.pageYOffset > 500

      if (isMobile) {
        // On mobile, only show in last section (contact)
        setIsVisible(scrolled && currentSection === sections.length - 1)
      } else {
        // On desktop, show after scrolling 500px
        setIsVisible(scrolled)
      }
    }

    checkScreenSize()
    updateCurrentSection()
    toggleVisibility()

    window.addEventListener('scroll', () => {
      updateCurrentSection()
      toggleVisibility()
    })
    window.addEventListener('resize', () => {
      checkScreenSize()
      toggleVisibility()
    })

    return () => {
      window.removeEventListener('scroll', () => {
        updateCurrentSection()
        toggleVisibility()
      })
      window.removeEventListener('resize', () => {
        checkScreenSize()
        toggleVisibility()
      })
    }
  }, [currentSection, isMobile])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 w-12 h-12 bg-cyan-400 text-gray-950 rounded-full flex items-center justify-center font-bold text-lg hover:bg-blue-500 hover:transform hover:-translate-y-1 transition-all duration-300 z-50 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <i className="fas fa-chevron-up"></i>
    </button>
  )
}

export default ScrollToTop
