import React, { useEffect, useState } from 'react'

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [followerPosition, setFollowerPosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      setTimeout(() => {
        setFollowerPosition({ x: e.clientX, y: e.clientY })
      }, 50)
    }

    const handleMouseEnter = () => setIsPointer(true)
    const handleMouseLeave = () => setIsPointer(false)

    document.addEventListener('mousemove', updateMousePosition)

    // Add event listeners to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      document.removeEventListener('mousemove', updateMousePosition)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  // Hide cursors on mobile
  if (window.innerWidth <= 768) {
    return null
  }

  return (
    <>
      {/* Main Cursor */}
      <div
        className={`fixed w-5 h-5 bg-cyan-400 rounded-full pointer-events-none z-[9999] transition-transform duration-100 mix-blend-difference ${
          isPointer ? 'scale-150' : 'scale-100'
        }`}
        style={{
          left: mousePosition.x + 'px',
          top: mousePosition.y + 'px',
          transform: 'translate(-50%, -50%)'
        }}
      />
      
      {/* Cursor Follower */}
      <div
        className={`fixed w-10 h-10 border-2 border-cyan-400 rounded-full pointer-events-none z-[9998] transition-all duration-300 opacity-50 ${
          isPointer ? 'scale-150' : 'scale-100'
        }`}
        style={{
          left: followerPosition.x + 'px',
          top: followerPosition.y + 'px',
          transform: 'translate(-50%, -50%)'
        }}
      />
    </>
  )
}

export default CustomCursor
