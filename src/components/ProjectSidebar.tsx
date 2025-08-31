import { projectCaseStudies, projectTechnologies, ProjectCaseStudy } from '../data/projectCaseStudies';
import { Link } from 'react-router-dom';

interface ProjectSidebarProps {
  currentProject?: ProjectCaseStudy;
}

const ProjectSidebar = ({ currentProject }: ProjectSidebarProps) => {
  // Filter out current project from related projects
  const relatedProjects = projectCaseStudies.filter(project => 
    currentProject ? project.id !== currentProject.id : true
  ).slice(0, 2);

  return (
    <div className="space-y-8">
      {/* Related Projects */}
      <div className="bg-card border border-primary/20 p-6">
        <h3 className="text-xl font-light tracking-wider text-text-primary mb-6">
          Related Projects
        </h3>
        <div className="space-y-4">
          {relatedProjects.map((project) => (
            <Link 
              key={project.id}
              to={`/projects/${project.slug}`}
              className="block group"
            >
              <div className="pb-4 border-b border-primary/10 last:border-b-0 last:pb-0">
                <h4 className="text-text-primary group-hover:text-primary-accent transition-colors mb-2 leading-snug">
                  {project.title}
                </h4>
                <p className="text-sm text-text-secondary mb-2">
                  {project.subtitle}
                </p>
                <span className="text-xs text-primary">
                  {project.duration} • {project.teamSize}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Technologies Used */}
      <div className="bg-card border border-primary/20 p-6">
        <h3 className="text-xl font-light tracking-wider text-text-primary mb-6">
          Technologies
        </h3>
        <div className="flex flex-wrap gap-2">
          {projectTechnologies.map((tech) => (
            <span 
              key={tech}
              className="px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-sm cursor-pointer hover:bg-primary/20 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Project Metrics */}
      {currentProject && (
        <div className="bg-card border border-primary/20 p-6">
          <h3 className="text-xl font-light tracking-wider text-text-primary mb-6">
            Key Metrics
          </h3>
          <div className="space-y-4">
            {currentProject.metrics.map((metric, index) => (
              <div key={index} className="bg-background/50 p-4 border border-primary/10">
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
      )}

      {/* Contact CTA */}
      <div className="bg-card border border-primary/20 p-6">
        <h3 className="text-xl font-light tracking-wider text-text-primary mb-4">
          Ready to Transform?
        </h3>
        <p className="text-text-secondary mb-6 text-sm leading-relaxed">
          Discuss your project with our experts
        </p>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-background border border-primary/30 text-text-primary placeholder-text-secondary focus:border-primary focus:outline-none transition-colors"
          />
          <button
            type="submit"
            className="w-full px-4 py-3 bg-primary text-primary-foreground hover:bg-primary-accent transition-colors font-light tracking-wider"
          >
            GET STARTED
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectSidebar;