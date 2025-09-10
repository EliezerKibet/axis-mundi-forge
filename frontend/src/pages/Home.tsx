import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button-variants";
import { ArrowRight } from "lucide-react";
import { useParams, Link } from "react-router-dom";
const Home = () => {
  const [animateServices, setAnimateServices] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateServices(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const services = [
    {
      number: "01",
      title: "Advanced Architecture",
      description:
        "Building scalable systems with microservices, cloud-native design, and distributed computing.",
    },
    {
      number: "02",
      title: "AI Integration",
      description:
        "Leveraging machine learning and neural networks to create intelligent, adaptive solutions.",
    },
    {
      number: "03",
      title: "Security First",
      description:
        "Zero-trust architecture with end-to-end encryption and advanced threat detection.",
    },
  ];

  return (
    <div className="min-h-screen bg-background tech-grid">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-6">
            Next Generation
            <br />
            <span className="text-primary-accent">Technology Solutions</span>
          </h1>

          <p className="text-lg text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
            We architect the future through precision engineering and innovative
            design. Transform your vision into scalable, cutting-edge digital
            solutions.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button variant="hero" size="hero" className="group">
              <Link className="absolute inset-0" to="/projects" />
              EXPLORE PROJECTS
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="heroSecondary" size="hero">
              <Link className="absolute inset-0" to="/contact" />
              START BUILDING
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Animated blue line */}
          <div
            className={`h-px bg-primary mb-20 transition-all duration-500 ${
              animateServices ? "w-full opacity-100" : "w-0 opacity-0"
            }`}
          />

          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {services.map((service, index) => (
              <div
                key={index}
                className={`hover-lift transition-all duration-700 ${
                  animateServices
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{
                  transitionDelay: animateServices ? `${index * 200}ms` : "0ms",
                }}
              >
                <div className="mb-8">
                  <div className="w-20 h-20 border border-primary flex items-center justify-center mb-6">
                    <span className="text-primary text-xl font-light tracking-wider">
                      {service.number}
                    </span>
                  </div>
                  <h3 className="mb-4">{service.title}</h3>
                  <p className="text-text-secondary leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
