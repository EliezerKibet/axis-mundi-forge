import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cpu, Diamond, Network } from "lucide-react";

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
      title: "Neural Commerce Platform",
      description:
        "AI-powered e-commerce platform processing $2M daily transactions with 99.99% uptime. Deep learning personalization achieving 340% ROI.",
      tags: ["TENSORFLOW", "REACT", "KUBERNETES"],
      client: "Fortune 500 Retailer",
      slug: "neural-commerce-platform",
    },
    {
      icon: Diamond,
      title: "Quantum Finance Dashboard",
      description:
        "Quantum-classical hybrid system managing $5B in assets with real-time rebalancing. 10,000x faster than traditional methods.",
      tags: ["QISKIT", "PYTHON", "D3.JS"],
      client: "Investment Management Firm",
      slug: "quantum-finance-dashboard",
    },
    {
      icon: Network,
      title: "Smart City Infrastructure",
      description:
        "IoT ecosystem managing 10,000+ sensors across the city. Reducing traffic congestion by 34% and saving $50M annually.",
      tags: ["AZURE IOT", "TENSORFLOW", "POWER BI"],
      client: "Metropolitan Government",
      slug: "smart-city-infrastructure",
    },
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
              animateProjects ? "w-full opacity-100" : "w-0 opacity-0"
            }`}
          />

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {projects.map((project, index) => {
              const Icon = project.icon;
              const delay = index * 200;

              return (
                <Link
                  key={index}
                  to={`/projects/${project.slug}`}
                  className={`block bg-card border border-primary/20 hover-lift hover-glow p-8 transition-all duration-700 cursor-pointer group ${
                    animateProjects
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-16 scale-95"
                  }`}
                  style={{
                    transitionDelay: animateProjects ? `${delay}ms` : "0ms",
                  }}
                >
                  {/* Icon Area */}
                  <div className="mb-6 h-32 flex items-center justify-center">
                    <div className="w-20 h-20 border border-primary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  {/* Content Area */}
                  <div>
                    <h3 className="mb-2 group-hover:text-primary-accent transition-colors">{project.title}</h3>
                    <p className="text-sm text-primary mb-4">{project.client}</p>
                    <p className="text-text-secondary mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-xs border border-primary text-primary px-3 py-1 tracking-wider group-hover:bg-primary/10 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
