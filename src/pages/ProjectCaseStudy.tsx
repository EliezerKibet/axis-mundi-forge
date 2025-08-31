import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Users, Building } from 'lucide-react';
import { projectCaseStudies } from '../data/projectCaseStudies';
import ProjectSidebar from '../components/ProjectSidebar';
import QuantumCircuit from '../components/QuantumCircuit';
import AIArchitecture from '../components/AIArchitecture';
import CityNetwork from '../components/CityNetwork';

const ProjectCaseStudy = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = projectCaseStudies.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-background tech-grid pt-20">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h1 className="text-4xl font-light text-text-primary mb-4">Project Not Found</h1>
          <Link to="/projects" className="text-primary hover:text-primary-accent">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      line = line.trim();
      if (!line) return <br key={index} />;
      
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-4xl font-light text-text-primary mb-6 mt-8">{line.slice(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-light text-text-primary mb-4 mt-8">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-light text-text-primary mb-3 mt-6">{line.slice(4)}</h3>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="text-text-primary font-medium mb-4">{line.slice(2, -2)}</p>;
      }
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="text-text-secondary mb-2 ml-4 relative">
            <span className="absolute -left-4 text-primary">•</span>
            {line.slice(2)}
          </li>
        );
      }
      if (line.match(/^\d+\./)) {
        return (
          <li key={index} className="text-text-secondary mb-2 ml-6 relative">
            <span className="absolute -left-6 text-primary">{line.match(/^\d+\./)![0]}</span>
            {line.replace(/^\d+\.\s*/, '')}
          </li>
        );
      }
      
      return <p key={index} className="text-text-secondary mb-4 leading-relaxed">{line}</p>;
    });
  };

  const renderVisualComponent = () => {
    switch (project.visualComponent) {
      case 'QuantumCircuit':
        return <QuantumCircuit />;
      case 'AIArchitecture':
        return <AIArchitecture />;
      case 'CityNetwork':
        return <CityNetwork />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background tech-grid pt-20">
      {/* Back Navigation */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <Link 
          to="/projects" 
          className="inline-flex items-center text-primary hover:text-primary-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>
      </div>

      {/* Project Header */}
      <section className="bg-card border-l-4 border-primary py-12 px-6 mb-12">
        <div className="max-w-6xl mx-auto">
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              {project.duration}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              {project.teamSize}
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-primary" />
              {project.client}
            </div>
            {project.technologies.map((tech, index) => (
              <span key={index} className="px-3 py-1 bg-primary/10 border border-primary/30 text-primary">
                {tech}
              </span>
            ))}
          </div>
          
          {/* Project Title */}
          <h1 className="text-5xl md:text-6xl font-extralight tracking-wider text-text-primary mb-4">
            {project.title}
          </h1>
          <p className="text-xl text-text-secondary max-w-4xl">
            {project.subtitle}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Project Content */}
          <div className="lg:col-span-2">
            {/* Visual Component */}
            {project.visualComponent && (
              <div className="mb-12">
                {renderVisualComponent()}
              </div>
            )}

            {/* Project Content */}
            <div className="prose prose-invert max-w-none">
              {formatContent(project.content)}
            </div>

            {/* Key Metrics Section */}
            <div className="mt-12 p-6 bg-primary/5 border-l-4 border-primary">
              <h3 className="text-xl font-light text-text-primary mb-4">Key Results</h3>
              <div className="grid grid-cols-2 gap-4">
                {project.metrics.map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-light text-primary mb-1">
                      {metric.value}
                      {metric.improvement && (
                        <span className="text-sm text-primary-accent ml-2">
                          +{metric.improvement}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Navigation */}
            <div className="mt-16 pt-8 border-t border-primary/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-text-secondary mb-2">Previous Project</p>
                  <Link to="/projects" className="text-primary hover:text-primary-accent">
                    View All Projects
                  </Link>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text-secondary mb-2">Next Project</p>
                  <Link to="/projects" className="text-primary hover:text-primary-accent">
                    Explore More
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProjectSidebar currentProject={project} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCaseStudy;