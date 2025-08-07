import React, { useEffect, useRef, useState } from 'react'

const Skills = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

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

  const skillCategories = [
    {
      title: "Frontend",
      skills: [
        { name: "React.js", icon: "fab fa-react" },
        { name: "JavaScript", icon: "fab fa-js-square" },
        { name: "TypeScript", icon: "fas fa-code" },
        { name: "Vite", icon: "fas fa-bolt" },
        { name: "HTML5", icon: "fab fa-html5" },
        { name: "CSS3", icon: "fab fa-css3-alt" },
        { name: "Tailwind", icon: "fas fa-palette" }
      ],
      delay: "0ms"
    },
    {
      title: "Backend",
      skills: [
        { name: "Node.js", icon: "fab fa-node-js" },
        { name: "Express", icon: "fas fa-server" },
        { name: "Python", icon: "fab fa-python" },
        { name: "REST API", icon: "fas fa-exchange-alt" },
        { name: "Socket.io", icon: "fas fa-plug" },
        { name: "JWT", icon: "fas fa-key" }
      ],
      delay: "200ms"
    },
    {
      title: "Database",
      skills: [
        { name: "MongoDB", icon: "fas fa-leaf" },
        { name: "MySQL", icon: "fas fa-database" },
        { name: "Redis", icon: "fas fa-memory" },
      ],
      delay: "400ms"
    },
    {
      title: "Cloud & DevOps",
      skills: [
        { name: "AWS", icon: "fab fa-aws" },
        { name: "Google Cloud", icon: "fab fa-google" },
        {name: "MongoDB Atlas", icon: "fas fa-cloud" },
        {name: "Docker", icon: "fab fa-docker" },
      ],
      delay: "500ms"
    },
    {
      title: "Tools & Others",
      skills: [
        { name: "Git", icon: "fab fa-git-alt" },
        { name: "GitHub", icon: "fab fa-github" },
        { name: "Linux", icon: "fab fa-linux" },
        { name: "Figma", icon: "fab fa-figma" },
        { name: "Postman", icon: "fas fa-paper-plane" },
        { name: "VS Code", icon: "fas fa-code" },
      ],
      delay: "600ms"
    }
  ]

  const SkillCategory = ({ category, index }) => {
    return (
      <div 
        className={`bg-gray-700 p-6 rounded-3xl border border-cyan-400/10 hover:border-cyan-400/30 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-400/20 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: isVisible ? category.delay : '0ms' }}
      >
        <h3 className="text-xl font-semibold mb-4 text-cyan-400 text-left relative pb-2">
          {category.title}
          <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
        </h3>
        
        <div className="flex flex-wrap gap-3">
          {category.skills.map((skill, skillIndex) => (
            <div
              key={skillIndex}
              className="skill-item flex items-center gap-2 px-4 py-2 bg-gray-950 rounded-full border border-gray-800 transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-500 hover:text-gray-950 hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/30 cursor-pointer group"
            >
              <div className="text-cyan-400 group-hover:text-gray-950 transition-colors duration-300">
                <i className={skill.icon}></i>
              </div>
              <span className="text-sm font-medium text-white group-hover:text-gray-950 transition-colors duration-300">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section id="skills" className="min-h-screen flex items-center py-16 bg-gray-900" ref={sectionRef}>
      <div className="container mx-auto max-w-6xl px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Technical Skills
          </h2>
          <p className="text-gray-400 text-lg">Technologies I work with</p>
        </div>

        {/* Skills Layout - Horizontal */}
        <div className="space-y-8">
          {skillCategories.map((category, index) => (
            <SkillCategory key={index} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
