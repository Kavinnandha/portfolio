import React, { useEffect, useState } from 'react'

const FloatingNext = ({ isModalOpen }) => {
  const [currentSection, setCurrentSection] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
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

      // Hide on last section (contact) or when modal is open on mobile
      const shouldHide = currentSection >= sections.length - 1 || (isMobile && isModalOpen)
      setIsVisible(!shouldHide)
    }

    checkScreenSize()
    updateCurrentSection()

    window.addEventListener('scroll', updateCurrentSection)
    window.addEventListener('resize', checkScreenSize)

    return () => {
      window.removeEventListener('scroll', updateCurrentSection)
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [currentSection, isMobile, isModalOpen])

  const scrollToNextSection = () => {
    if (currentSection < sections.length - 1) {
      const nextSection = document.getElementById(sections[currentSection + 1])
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <button
      onClick={scrollToNextSection}
      className={`fixed bottom-8 left-8 w-12 h-12 bg-cyan-400 text-gray-950 rounded-full flex items-center justify-center font-bold text-lg hover:bg-blue-500 hover:transform hover:-translate-y-1 transition-all duration-300 z-50 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Next section"
    >
      <i className="fas fa-chevron-down"></i>
    </button>
  )
}

export default FloatingNext
