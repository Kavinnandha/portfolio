import React, { useEffect, useRef, useState } from 'react'
import ProjectCard from './ProjectCard'
import ProjectModal from './ProjectModal'

const Projects = ({ onModalStateChange }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(1)
  const [selectedProject, setSelectedProject] = useState(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const sectionRef = useRef(null)
  const carouselRef = useRef(null)
  
  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [startTime, setStartTime] = useState(null)

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

    return () => observer.disconnect()
  }, [])

  // Detect touch device and update items per view based on screen size
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }

    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3) // Large screens: show 3 items
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2) // Medium screens: show 2 items
      } else {
        setItemsPerView(1) // Small screens: show 1 item
      }
    }

    checkTouchDevice()
    updateItemsPerView()
    
    window.addEventListener('resize', updateItemsPerView)
    window.addEventListener('resize', checkTouchDevice)
    
    return () => {
      window.removeEventListener('resize', updateItemsPerView)
      window.removeEventListener('resize', checkTouchDevice)
    }
  }, [])

  // Add touch event listeners with proper options
  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    const handleTouchMoveWithPrevent = (e) => {
      if (!touchStart) return
      
      const currentTouch = e.targetTouches[0].clientX
      const diff = touchStart - currentTouch
      
      // Only start dragging if moved more than 10px
      if (Math.abs(diff) > 10) {
        setIsDragging(true)
        setDragOffset(-diff)
        setTouchEnd(currentTouch)
        e.preventDefault() // This will work now
      }
    }

    // Add event listeners with { passive: false } option
    carousel.addEventListener('touchmove', handleTouchMoveWithPrevent, { passive: false })

    return () => {
      carousel.removeEventListener('touchmove', handleTouchMoveWithPrevent)
    }
  }, [touchStart])

  // Track modal state changes and notify parent
  useEffect(() => {
    if (onModalStateChange) {
      onModalStateChange(!!selectedProject)
    }
  }, [selectedProject, onModalStateChange])

  // Carousel navigation functions
  const nextProject = () => {
    const maxIndex = Math.max(0, projects.length - itemsPerView)
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevProject = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const goToProject = (index) => {
    const maxIndex = Math.max(0, projects.length - itemsPerView)
    setCurrentIndex(Math.min(index, maxIndex))
  }

  // Touch event handlers
  const handleTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setStartTime(Date.now())
    setIsDragging(false) // Don't set dragging true immediately
  }

  const handleTouchMove = (e) => {
    if (!touchStart) return
    
    const currentTouch = e.targetTouches[0].clientX
    const diff = touchStart - currentTouch
    
    // Only start dragging if moved more than 10px
    if (Math.abs(diff) > 10) {
      setIsDragging(true)
      setDragOffset(-diff)
      setTouchEnd(currentTouch)
    }
  }

  const handleTouchEnd = () => {
    if (!touchStart) {
      setIsDragging(false)
      setDragOffset(0)
      return
    }

    const distance = touchStart - (touchEnd || touchStart)
    const swipeTime = Date.now() - (startTime || Date.now())
    const minSwipeDistance = 50
    const maxSwipeTime = 300 // ms
    const maxIndex = Math.max(0, projects.length - itemsPerView)

    // Check for valid swipe (distance and time)
    if (Math.abs(distance) > minSwipeDistance && swipeTime < maxSwipeTime) {
      if (distance > 0 && currentIndex < maxIndex) {
        // Swipe left - next project
        nextProject()
      } else if (distance < 0 && currentIndex > 0) {
        // Swipe right - previous project  
        prevProject()
      }
    }

    // Reset states
    setIsDragging(false)
    setDragOffset(0)
    setTouchStart(null)
    setTouchEnd(null)
    setStartTime(null)
  }

  // Mouse event handlers for desktop drag simulation
  const handleMouseDown = (e) => {
    if (isTouchDevice) return
    
    setTouchEnd(null)
    setTouchStart(e.clientX)
    setStartTime(Date.now())
    setIsDragging(false)
    e.preventDefault()
  }

  const handleMouseMove = (e) => {
    if (isTouchDevice || !touchStart) return
    
    const diff = touchStart - e.clientX
    if (Math.abs(diff) > 10) {
      setIsDragging(true)
      setDragOffset(-diff)
      setTouchEnd(e.clientX)
    }
  }

  const handleMouseUp = (e) => {
    if (isTouchDevice || !touchStart) {
      setIsDragging(false)
      setDragOffset(0)
      return
    }

    const distance = touchStart - (touchEnd || touchStart)
    const swipeTime = Date.now() - (startTime || Date.now())
    const minSwipeDistance = 50
    const maxSwipeTime = 300
    const maxIndex = Math.max(0, projects.length - itemsPerView)

    if (Math.abs(distance) > minSwipeDistance && swipeTime < maxSwipeTime) {
      if (distance > 0 && currentIndex < maxIndex) {
        nextProject()
      } else if (distance < 0 && currentIndex > 0) {
        prevProject()
      }
    }

    setIsDragging(false)
    setDragOffset(0)
    setTouchStart(null)
    setTouchEnd(null)
    setStartTime(null)
  }

  const projects = [
  {
    id: 1,
    title: "Institution Management System",
    description: "A flexible platform for managing all facets of an educational institution, from student lifecycle to staff, courses, and academic records.",
    technologies: ["MongoDB", "Express", "Node.js", "React", "Tailwind", "Vite", "TypeScript", "Redis", "Docker", "NGINX"],
    icon: "fas fa-school",
    delay: "0ms",
    details: {
      overview: "A scalable and modular full-stack application engineered to streamline institutional operations. This system integrates student enrollment, attendance, academic evaluation, and course scheduling into a centralized dashboard, all secured with a dynamic Role-Based Access Control (RBAC) mechanism and Redis-powered caching.",
      features: [
        "Multi-role authentication with fine-grained access control",
        "Real-time attendance and academic performance tracking",
        "Course and Department management with auto-allocation features",
        "Dynamic, role-sensitive UI with intelligent sidebar rendering",
        "Optimized performance using Redis for caching frequently accessed data",
        "Comprehensive reporting tools for academic and administrative insights",
        "User-friendly interface with responsive design for seamless navigation",
        "Dockerized deployment for consistent environments"
      ]
    }
  },
  {
    id: 2,
    title: "Placement Drive Management System",
    description: "An end-to-end staff and HR management solution for tracking student progress, recruiter engagement, and placement logistics within academic institutions.",
    technologies: ["MongoDB", "Express", "Node.js", "React", "Tailwind", "Vite", "JavaScript", "Docker", "NGINX"],
    icon: "fas fa-briefcase",
    delay: "100ms",
    details: {
      overview: "Designed to streamline and digitize the placement process for universities and colleges, this system provides a robust framework to manage placement drives, recruiter communications, student follow-ups, and outcome reporting. With Dockerized deployment and NGINX reverse proxy, the application supports scalable deployment and high performance in real-world environments.",
      features: [
        "Drive creation and status monitoring with recruiter-specific portals",
        "Follow-up tracking, Meeting scheduling, and task delegation",
        "Custom notes, notifications, and reporting tools for placement officers",
        "Docker containerization for scalable and isolated environments"
      ]
    }
  },
  {
    id: 3,
    title: "Data Visualization from MySQL",
    description: "An interactive web-based data visualization suite that transforms complex relational data into intuitive visual insights using dynamic dashboards.",
    technologies: ["PHP", "Chart.js", "MySQL", "Apache", "Tailwind"],
    icon: "fas fa-chart-bar",
    delay: "200ms",
    details: {
      overview: "This project delivers powerful visual representations of relational datasets by connecting PHP backends to a MySQL database, converting raw records into actionable insights. Leveraging Tailwind for sleek frontend components, it allows for filterable, responsive, and analytical data views tailored for administrative use cases.",
      features: [
        "Live data charting with interactive filters and dropdowns",
        "Real-time analytics and aggregation for summary insights",
        "Responsive UI tailored for both desktop and mobile users",
        "Efficient SQL query design for optimized performance",
        "Export functionality for reports and charts"
      ]
    }
  },
  {
    id: 4,
    title: "Event Management System",
    description: "A comprehensive event management system for planning, registering, tracking, and analyzing institutional events at scale.",
    technologies: ["PHP", "MySQL", "Apache", "Linux", "Tailwind"],
    icon: "fas fa-calendar-check",
    delay: "300ms",
    details: {
      overview: "Developed for large-scale institutional environments, this system facilitates end-to-end event orchestration—from announcements to registrations, and feedback collection. Built on a LAMP stack with Tailwind UI, it emphasizes performance, reliability, and extensibility for multi-role event coordination.",
      features: [
        "Role-specific dashboards for organizers, attendees, and admins",
        "Dynamic registration limits, waitlists, and role-based access control",
        "Feedback collection and event analytics reporting",
      ]
    }
  },
 {
  id: 5,
  title: "REST API for Health App",
  description: "A secure, modular, and scalable RESTful API built to power a health tracking mobile application with real-time health metrics, user authentication, and analytics.",
  technologies: ["Node.js", "Express", "MongoDB", "JWT"],
  icon: "fas fa-server",
  delay: "400ms",
  details: {
    overview: "The backend REST API for the Health App is engineered to manage user authentication, health metric logging, and secure data retrieval for a Flutter-based mobile frontend. Built using Node.js and Express, the system supports modular endpoints for multiple health parameters while ensuring data privacy through JWT-based authentication and role control. MongoDB is used for flexible schema design to accommodate evolving health tracking needs.",
    features: [
      "Modular REST API architecture with versioned endpoints",
      "User registration, login, and JWT token-based authentication",
      "CRUD operations for tracking vitals, hydration, sleep, diet, and more",
      "Data aggregation for generating weekly/monthly health reports",
      "Secure API design with input validation, rate limiting, and CORS management",
      "MongoDB collections optimized for time-series health data",
    ]
  }
},
  {
    id: 6,
    title: "CIS Benchmarks Automation Tool",
    description: "A multi-platform automation tool to evaluate and enforce CIS security compliance using scripting and GUI-based interfaces.",
    technologies: ["PowerShell", "PyQt", "Bash"],
    icon: "fas fa-shield-alt",
    delay: "500ms",
    details: {
      overview: "A powerful cross-platform tool to automate system hardening based on CIS Benchmarks. Combines PowerShell, Bash, and a PyQt-based GUI to deliver both CLI and user-friendly interfaces for performing compliance scans and remediation across Linux and Windows environments.",
      features: [
        "Automated compliance scans with CIS benchmark alignment",
        "GUI-based reporting and remediation controls",
        "Cross-platform (Windows/Linux) compatibility",
        "Security scorecard generation with remediation status",
        "Modular script architecture for custom policy enforcement"
      ]
    }
  },
  {
    id: 7,
    title: "Billing Management System",
    description: "A feature-packed invoicing and billing platform designed for small-to-medium businesses with focus on usability and compliance.",
    technologies: ["PHP", "MySQL", "Bootstrap"],
    icon: "fas fa-file-invoice-dollar",
    delay: "600ms",
    details: {
      overview: "A complete billing solution designed to manage customer invoicing, payments, and financial reports with high precision. The system offers real-time invoice tracking, itemized billing, PDF generation, and a responsive admin dashboard, ensuring compatibility with both desktop and mobile workflows.",
      features: [
        "Invoice creation with tax and discount modules",
        "Customer management with due tracking",
        "Automated invoice PDF generation and download",
        "Detailed transaction history and reporting tools",
        "Responsive design using Bootstrap for mobile and desktop support"
      ]
    }
  }
]


  return (
    <section id="projects" className="min-h-screen flex items-center py-16 bg-gray-950" ref={sectionRef}>
      <div className="container mx-auto max-w-6xl px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            My Projects
          </h2>
        </div>

        {/* Projects Carousel */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 md:px-16 lg:px-20">
          {/* Navigation Arrows - Hidden on small screens for touch devices */}
          {(!isTouchDevice || window.innerWidth >= 768) && (
            <>
              <button
                onClick={prevProject}
                disabled={currentIndex === 0}
                className={`absolute -left-2 sm:-left-4 md:-left-8 lg:-left-16 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-gray-800/80 hover:bg-cyan-400 text-cyan-400 hover:text-gray-950 rounded-full flex items-center justify-center transition-all duration-300 z-10 backdrop-blur-sm ${
                  currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label="Previous project"
              >
                <i className="fas fa-chevron-left text-sm md:text-base"></i>
              </button>
              
              <button
                onClick={nextProject}
                disabled={currentIndex >= projects.length - itemsPerView}
                className={`absolute -right-2 sm:-right-4 md:-right-8 lg:-right-16 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-gray-800/80 hover:bg-cyan-400 text-cyan-400 hover:text-gray-950 rounded-full flex items-center justify-center transition-all duration-300 z-10 backdrop-blur-sm ${
                  currentIndex >= projects.length - itemsPerView ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label="Next project"
              >
                <i className="fas fa-chevron-right text-sm md:text-base"></i>
              </button>
            </>
          )}

          {/* Carousel Container with Touch Events */}
          <div 
            className="relative overflow-hidden rounded-3xl select-none"
            ref={carouselRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              setIsDragging(false)
              setDragOffset(0)
              setTouchStart(null)
              setTouchEnd(null)
            }}
            style={{ 
              touchAction: 'pan-y pinch-zoom',
              overscrollBehaviorX: 'contain'
            }}
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(${-((currentIndex * 100) / itemsPerView) + (carouselRef.current ? (dragOffset / carouselRef.current.offsetWidth) * 100 : 0)}%)`,
                transitionDuration: isDragging ? '0ms' : '500ms'
              }}
            >
              {projects.map((project, index) => (
                <div 
                  key={project.id} 
                  className="px-2 sm:px-4 flex-shrink-0"
                  style={{ width: `${100 / itemsPerView}%`, minHeight: '400px' }}
                >
                  <ProjectCard 
                    project={project} 
                    index={index} 
                    isVisible={isVisible}
                    isDragging={isDragging}
                    onProjectClick={setSelectedProject}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.max(1, projects.length - itemsPerView + 1) }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToProject(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-cyan-400 scale-125' 
                    : 'bg-gray-600 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </section>
  )
}

export default Projects