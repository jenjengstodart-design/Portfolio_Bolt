import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import projectsData from '../content/projects.json';

export default function Work() {
  const [activeCategory, setActiveCategory] = useState<string>('All Projects');

  const categories = ['All Projects', ...projectsData.categories.map(c => c.name)];

  const filteredProjects = activeCategory === 'All Projects'
    ? projectsData.categories.flatMap(category =>
        category.projects.map(project => ({ ...project, categoryName: category.name }))
      )
    : projectsData.categories
        .find(c => c.name === activeCategory)
        ?.projects.map(project => ({ ...project, categoryName: activeCategory })) || [];

  return (
    <div className="pt-20">
      <section className="section-padding bg-white">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-hero font-bold">My Work</h1>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-off-white">
        <div className="section-container">
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-small font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-accent-red text-white'
                    : 'bg-white text-text-secondary hover:bg-nav-active'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  to={`/work/${project.id}`}
                  className="block group h-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="bg-nav-active h-48 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-small text-accent-red font-medium mb-2">
                      {project.categoryName}
                    </div>
                    <h3 className="text-h3 font-bold mb-2 group-hover:text-accent-red transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-small text-text-light mb-3">
                      {project.client} | {project.industry}
                    </p>
                    <p className="text-body text-text-secondary line-clamp-3 mb-4">
                      {project.publicOutcome}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.methods.slice(0, 3).map((method) => (
                        <span
                          key={method}
                          className="px-3 py-1 bg-off-white text-text-secondary text-small rounded-full"
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-body text-text-light">
                No projects found in this category.
              </p>
            </div>
          )}
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
            <h2 className="text-h1 font-bold mb-4 text-white">Interested in Working Together?</h2>
            <p className="text-body mb-8 opacity-90 max-w-2xl mx-auto">
              Let's discuss how I can help your organisation achieve similar results.
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
