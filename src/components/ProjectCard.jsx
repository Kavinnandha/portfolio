import React, { useState, useEffect } from 'react'

const ProjectCard = ({ project, index, isVisible: cardVisible, isDragging, onProjectClick }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkTouchDevice()
  }, [])

  const handleCardClick = (e) => {
    // Prevent opening modal if user is swiping
    if (isDragging) {
      e.preventDefault()
      return
    }
    onProjectClick(project)
  }

  return (
    <div 
      className={`project-card bg-gray-800 rounded-3xl overflow-hidden transition-all duration-500 hover:transform hover:-translate-y-4 hover:shadow-2xl hover:shadow-cyan-400/20 w-full h-full cursor-pointer select-none ${
        cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: cardVisible ? project.delay : '0ms' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Project Content */}
      <div className="p-4 sm:p-6 md:p-8 h-full flex flex-col">
        {/* Icon and Title Row */}
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-shrink-0">
            <i className={`${project.icon} text-2xl sm:text-3xl text-cyan-400 transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}></i>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-cyan-400 flex-1">
            {project.title}
          </h3>
        </div>
        
        {/* Description */}
        <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 leading-relaxed flex-grow">
          {project.description}
        </p>
        
        {/* Technologies Stack */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
          {project.technologies.map((tech, techIndex) => (
            <span
              key={techIndex}
              className="bg-gray-700 text-cyan-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium hover:bg-cyan-400 hover:text-gray-950 transition-all duration-300"
            >
              {tech}
            </span>
          ))}
        </div>
        
        {/* View Details Indicator */}
        <div className="text-center">
          <div className={`inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500 transition-all duration-300 ${isHovered ? 'text-cyan-400' : ''}`}>
            <span>{isTouchDevice ? 'Tap for details • Swipe to navigate' : 'Click for more details'}</span>
            <i className={`fas fa-arrow-right transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`}></i>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
