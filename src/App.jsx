import React, { useState } from 'react'
import CustomCursor from './components/CustomCursor'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import ScrollToTop from './components/ScrollToTop'
import FloatingNext from './components/FloatingNext'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="bg-gray-950 text-white min-h-screen overflow-x-hidden">
      <CustomCursor />
      <Hero />
      <About />
      <Projects onModalStateChange={setIsModalOpen} />
      <Skills />
      <Contact />
      <ScrollToTop />
      <FloatingNext isModalOpen={isModalOpen} />
    </div>
  )
}

export default App
