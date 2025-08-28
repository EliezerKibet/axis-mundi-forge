const About = () => {
  const stats = [
    { number: "200+", label: "PROJECTS" },
    { number: "15Y", label: "EXPERIENCE" },
    { number: "50+", label: "ENGINEERS" },
    { number: "99.9%", label: "UPTIME" }
  ];

  const competencies = [
    "Cloud Architecture & DevOps",
    "Artificial Intelligence & ML", 
    "Blockchain & Web3",
    "Quantum Computing",
    "IoT & Edge Computing"
  ];

  return (
    <div className="min-h-screen bg-background tech-grid pt-20">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="blue-accent-line pl-8">
            <h1 className="mb-6">Engineering Excellence</h1>
            <p className="text-lg text-text-secondary max-w-3xl leading-relaxed">
              Founded on principles of innovation and precision, we deliver transformative 
              technology solutions that define industry standards.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-extralight text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-text-secondary tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Core Competencies */}
            <div>
              <h2 className="mb-8">Core Competencies</h2>
              <div className="space-y-4">
                {competencies.map((competency, index) => (
                  <div key={index} className="text-text-secondary border-l-2 border-transparent hover:border-primary pl-4 transition-colors duration-300">
                    {competency}
                  </div>
                ))}
              </div>
            </div>

            {/* Our Approach */}
            <div>
              <h2 className="mb-8">Our Approach</h2>
              <div className="space-y-6 text-text-secondary leading-relaxed">
                <p>
                  We employ agile methodologies combined with cutting-edge technology stacks 
                  to deliver solutions that are not just functional, but transformative. Our 
                  engineering teams work in synergy to create systems that are robust, 
                  scalable, and future-proof.
                </p>
                <p>
                  Every project undergoes rigorous testing, security audits, and performance 
                  optimization to ensure excellence at every level.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;