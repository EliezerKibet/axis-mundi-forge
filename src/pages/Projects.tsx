import { useEffect, useState } from 'react';
import { Cpu, Diamond, Boxes, Network, Square, Triangle } from 'lucide-react';

const Projects = () => {
  const [animateProjects, setAnimateProjects] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateProjects(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const projects = [
    {
      icon: Cpu,
      title: "Neural Processing Platform",
      description: "Real-time data analysis system using advanced neural networks for predictive modeling and pattern recognition.",
      tags: ["TENSORFLOW", "PYTHON", "KUBERNETES"]
    },
    {
      icon: Diamond,
      title: "Quantum Finance Engine", 
      description: "Quantum computing solution for complex financial modeling and risk assessment with millisecond processing.",
      tags: ["QISKIT", "REACT", "GRAPHQL"]
    },
    {
      icon: Boxes,
      title: "Distributed Ledger System",
      description: "Blockchain infrastructure for secure, transparent supply chain management across global networks.",
      tags: ["ETHEREUM", "SOLIDITY", "IPFS"]
    },
    {
      icon: Network,
      title: "Smart City Infrastructure", 
      description: "IoT ecosystem managing urban resources through real-time data collection and automated response systems.",
      tags: ["AZURE IOT", "5G", "EDGE AI"]
    },
    {
      icon: Square,
      title: "Autonomous Systems Platform",
      description: "Self-healing infrastructure with automated deployment, scaling, and recovery mechanisms.",
      tags: ["DOCKER", "TERRAFORM", "GITOPS"]
    },
    {
      icon: Triangle,
      title: "Cybersecurity Matrix",
      description: "Advanced threat detection system using AI-driven behavioral analysis and zero-trust architecture.",
      tags: ["SIEM", "ML", "ZERO TRUST"]
    }
  ];

  return (
    <div className="min-h-screen bg-background tech-grid pt-20">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="blue-accent-line pl-8">
            <h1 className="mb-6">Featured Projects</h1>
            <p className="text-lg text-text-secondary max-w-3xl">
              Showcasing our latest technological achievements
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Animated blue line */}
          <div 
            className={`h-px bg-primary mb-20 transition-all duration-500 ${
              animateProjects ? 'w-full opacity-100' : 'w-0 opacity-0'
            }`}
          />
          
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => {
              const Icon = project.icon;
              const rowIndex = Math.floor(index / 2);
              const delay = rowIndex * 300;
              
              return (
                <div 
                  key={index}
                  className={`bg-card border border-primary/20 hover-lift hover-glow p-8 transition-all duration-700 ${
                    animateProjects 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-16 scale-95'
                  }`}
                  style={{ 
                    transitionDelay: animateProjects ? `${delay}ms` : '0ms' 
                  }}
                >
                  {/* Icon Area */}
                  <div className="mb-6 h-32 flex items-center justify-center">
                    <div className="w-20 h-20 border border-primary flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  
                  {/* Content Area */}
                  <div>
                    <h3 className="mb-4">{project.title}</h3>
                    <p className="text-text-secondary mb-6 leading-relaxed">
                      {project.description}
                    </p>
                    
                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="text-xs border border-primary text-primary px-3 py-1 tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;