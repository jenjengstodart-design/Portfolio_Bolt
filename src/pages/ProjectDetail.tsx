import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import projectsData from '../content/projects.json';

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const allProjects = projectsData.categories.flatMap(category =>
    category.projects.map(project => ({
      ...project,
      categoryName: category.name,
    }))
  );

  const currentIndex = allProjects.findIndex(p => p.id === projectId);
  const project = allProjects[currentIndex];

  if (!project) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-h1 font-bold mb-4">Project Not Found</h1>
          <Link to="/work" className="btn-primary">
            Back to Work
          </Link>
        </div>
      </div>
    );
  }

  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  return (
    <div className="pt-20">
      <section className="section-padding bg-white">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => navigate('/work')}
              className="flex items-center gap-2 text-text-light hover:text-accent-red transition-colors mb-8"
            >
              <ArrowLeft size={20} />
              <span className="text-body">Back to All Work</span>
            </button>

            <div className="mb-6">
              <span className="inline-block px-4 py-1 bg-accent-red/10 text-accent-red text-small font-medium rounded-full mb-4">
                {project.categoryName}
              </span>
              <h1 className="text-hero font-bold mb-4">{project.title}</h1>
              <div className="flex flex-wrap gap-3 text-body text-text-light">
                <span>{project.client}</span>
                <span>•</span>
                <span>{project.industry}</span>
              </div>
            </div>

            <div className="bg-nav-active h-96 rounded-2xl mb-12 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-off-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-h1 font-bold mb-6">The Challenge</h2>
              <p className="text-body text-text-secondary leading-relaxed">
                {project.publicChallenge}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-h1 font-bold mb-6">The Approach</h2>
              <p className="text-body text-text-secondary leading-relaxed">
                {project.approach}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-h1 font-bold mb-6">The Impact</h2>
              <p className="text-body text-text-secondary leading-relaxed mb-8">
                {project.publicOutcome}
              </p>
              {project.metrics && (
                <div className="bg-white p-6 rounded-lg border-l-4 border-accent-red">
                  <p className="text-body font-bold text-accent-red">
                    Key Result
                  </p>
                  <p className="text-h3 font-bold mt-2">{project.metrics}</p>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h3 className="text-h2 font-bold mb-4">Methods & Tools</h3>
              <div className="flex flex-wrap gap-3">
                {project.methods.map((method) => (
                  <span
                    key={method}
                    className="px-4 py-2 bg-white text-text-secondary text-body font-medium rounded-full border border-border-light"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </motion.div>

            {project.links && project.links.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-h2 font-bold mb-4">Learn More</h3>
                <div className="space-y-3">
                  {project.links.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-body text-accent-red hover:underline"
                    >
                      <ExternalLink size={20} />
                      <span>{link}</span>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white border-t border-border-light">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-center gap-8"
          >
            <Link
              to="/work"
              className="flex items-center gap-2 text-body text-text-secondary hover:text-accent-red transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to All Work</span>
            </Link>

            <Link
              to={`/work/${nextProject.id}`}
              className="group flex items-center gap-4 bg-off-white p-6 rounded-lg hover:bg-nav-active transition-colors"
            >
              <div className="text-right">
                <p className="text-small text-text-light mb-1">Next Project</p>
                <p className="text-body font-bold group-hover:text-accent-red transition-colors">
                  {nextProject.title}
                </p>
              </div>
              <ArrowRight size={24} className="text-accent-red" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-accent-red text-white">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-h1 font-bold mb-4 text-white">Like What You See?</h2>
            <p className="text-body mb-8 opacity-90 max-w-2xl mx-auto">
              Let's discuss how I can help your organization achieve similar results.
            </p>
            <Link
              to="/contact"
              className="bg-white text-accent-red px-10 py-3.5 rounded-full font-bold text-small hover:bg-off-white transition-colors inline-block"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
