import React, { useEffect } from 'react'

const ProjectModal = ({ project, onClose }) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    // Save current scroll position
    const scrollY = window.scrollY
    
    // Prevent scrolling by fixing the body
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    // Cleanup function to restore scrolling
    return () => {
      // Restore body styles
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      
      // Restore scroll position instantly without animation
      window.scrollTo({
        top: scrollY,
        behavior: 'instant'
      })
    }
  }, [])
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <i className={`${project.icon} text-3xl text-cyan-400`}></i>
            <h2 className="text-2xl font-bold text-white">{project.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-700 hover:bg-red-500 text-gray-300 hover:text-white rounded-full flex items-center justify-center transition-all duration-300"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto scrollbar-thin scrollbar-track-gray-700 scrollbar-thumb-cyan-400 hover:scrollbar-thumb-cyan-300" style={{ maxHeight: 'calc(90vh - 100px)' }}>
          {/* Modal Content */}
          <div className="p-8 space-y-8 pb-12">
          {/* Overview */}
          <div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Project Overview</h3>
            <p className="text-gray-300 leading-relaxed">{project.details.overview}</p>
          </div>

          {/* Key Features */}
          <div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Key Features</h3>
            <ul className="space-y-2">
              {project.details.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <i className="fas fa-check-circle text-cyan-400 mt-1 flex-shrink-0"></i>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Technologies Used</h3>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="bg-gray-700 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectModal
