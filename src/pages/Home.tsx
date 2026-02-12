import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lightbulb, Users, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import profileData from '../content/profile.json';
import servicesData from '../content/services.json';
import projectsData from '../content/projects.json';

const iconMap: Record<string, React.ElementType> = {
  Lightbulb,
  Users,
  TrendingUp,
  Sparkles,
};

export default function Home() {
  const featuredProjects = projectsData.categories.flatMap(category =>
    category.projects.filter(project => project.featured)
  );

  return (
    <div className="pt-20">
      <section className="section-padding bg-white">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h1 className="text-hero font-bold mb-6">Innovation Partner</h1>
            <p className="text-h3 text-text-light mb-8 font-medium">
              {profileData.currentTitle}
            </p>
            <p className="text-body text-text-secondary mb-10 max-w-3xl leading-relaxed">
              {profileData.elevatorPitch}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/work" className="btn-primary">
                View My Work
              </Link>
              <button className="btn-secondary">
                Download CV
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-off-white">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-h1 font-bold mb-4">My Expertise</h2>
            <p className="text-body text-text-light max-w-2xl mx-auto">
              AI-enhanced, human-centred approach to innovation and transformation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {servicesData.services.map((service, index) => {
              const Icon = iconMap[service.icon];
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link
                    to={`/expertise#${service.id}`}
                    className="block bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 h-full"
                  >
                    <div className="w-12 h-12 bg-accent-red/10 rounded-full flex items-center justify-center mb-4">
                      <Icon className="text-accent-red" size={24} />
                    </div>
                    <h3 className="text-h3 font-bold mb-3">{service.title}</h3>
                    <p className="text-body text-text-secondary">
                      {service.shortDescription}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-h1 font-bold mb-4">Featured Work</h2>
            <p className="text-body text-text-light max-w-2xl mx-auto">
              20+ years delivering transformation across FMCG, retail, government, and scaling startups
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProjects.slice(0, 6).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  to={`/work/${project.id}`}
                  className="block group h-full"
                >
                  <div className="bg-nav-active h-48 rounded-lg mb-4 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-accent-red/20 to-accent-red/5 flex items-center justify-center text-text-light group-hover:scale-110 transition-transform duration-300">
                      <span className="text-small">Project Image</span>
                    </div>
                  </div>
                  <h3 className="text-h3 font-bold mb-2 group-hover:text-accent-red transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-small text-text-light mb-2">
                    {project.client} | {project.industry}
                  </p>
                  <p className="text-body text-text-secondary line-clamp-2">
                    {project.publicOutcome}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/work" className="btn-primary inline-flex items-center gap-2">
              View All Projects
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-off-white">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-h1 font-bold mb-4">My Approach</h2>
            <p className="text-body text-text-light max-w-2xl mx-auto">
              Collaborative, action-based, and AI-enhanced
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Human-Centred',
                points: ['Research-driven', 'Empathy first', 'User validation'],
              },
              {
                title: 'Structured',
                points: ['Clear frameworks', 'Measurable outcomes', 'Replicable processes'],
              },
              {
                title: 'AI-Enhanced',
                points: ['Modern tools', 'Amplified capabilities', 'Future-ready'],
              },
            ].map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm"
              >
                <h3 className="text-h3 font-bold mb-4">{pillar.title}</h3>
                <ul className="space-y-2">
                  {pillar.points.map((point) => (
                    <li key={point} className="text-body text-text-secondary flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-accent-red rounded-full"></span>
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
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
            <h2 className="text-h1 font-bold mb-4 text-white">Let's Work Together</h2>
            <p className="text-body mb-8 opacity-90 max-w-2xl mx-auto">
              Ready to unlock growth and innovation? Let's discuss how I can help your organization thrive.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-accent-red px-10 py-3.5 rounded-full font-bold text-small hover:bg-off-white transition-colors"
              >
                Book a Discovery Call
              </Link>
              <a
                href="https://www.linkedin.com/in/jenjeng/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent text-white border-2 border-white px-9 py-3 rounded-full font-semibold text-small hover:bg-white hover:text-accent-red transition-colors"
              >
                View My LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
