import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lightbulb, Users, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import servicesData from '../content/services.json';
import projectsData from '../content/projects.json';

const iconMap: Record<string, React.ElementType> = {
  Lightbulb,
  Users,
  TrendingUp,
  Sparkles,
};

export default function Services() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  const allProjects = projectsData.categories.flatMap(category => category.projects);

  return (
    <div className="pt-20">
      <section className="section-padding bg-white">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-hero font-bold mb-6">My Expertise</h1>
            <p className="text-h3 text-text-light max-w-3xl mx-auto">
              AI-enhanced, human-centred innovation and transformation
            </p>
          </motion.div>
        </div>
      </section>

      {servicesData.services.map((service, index) => {
        const Icon = iconMap[service.icon];
        const relatedProjects = allProjects.filter(project =>
          service.relatedProjects.includes(project.id)
        );

        return (
          <section
            key={service.id}
            id={service.id}
            className={`section-padding ${index % 2 === 0 ? 'bg-off-white' : 'bg-white'}`}
          >
            <div className="section-container">
              <div className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={index % 2 === 1 ? 'md:order-2' : ''}
                >
                  <div className="w-16 h-16 bg-accent-red/10 rounded-full flex items-center justify-center mb-6">
                    <Icon className="text-accent-red" size={32} />
                  </div>
                  <h2 className="text-h1 font-bold mb-4">{service.title}</h2>
                  <p className="text-body text-text-secondary mb-6 leading-relaxed">
                    {service.fullDescription}
                  </p>
                  <Link
                    to="/contact"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    Discuss This Expertise
                    <ArrowRight size={20} />
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={index % 2 === 1 ? 'md:order-1' : ''}
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-h3 font-bold mb-3">Who It's For</h3>
                      <ul className="space-y-2">
                        {service.whoItsFor.map((item) => (
                          <li key={item} className="text-body text-text-secondary flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-accent-red rounded-full mt-2 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-h3 font-bold mb-3">What's Included</h3>
                      <ul className="space-y-2">
                        {service.whatsIncluded.map((item) => (
                          <li key={item} className="text-body text-text-secondary flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-accent-red rounded-full mt-2 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-h3 font-bold mb-3">Typical Deliverables</h3>
                      <ul className="space-y-2">
                        {service.deliverables.map((item) => (
                          <li key={item} className="text-body text-text-secondary flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-accent-red rounded-full mt-2 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>

              {relatedProjects.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-16"
                >
                  <h3 className="text-h2 font-bold mb-8">Related Projects</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {relatedProjects.map((project) => (
                      <Link
                        key={project.id}
                        to={`/work/${project.id}`}
                        className="block group"
                      >
                        <div className="bg-nav-active h-40 rounded-lg mb-4 overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-accent-red/20 to-accent-red/5 flex items-center justify-center text-text-light group-hover:scale-110 transition-transform duration-300">
                            <span className="text-small">Project Image</span>
                          </div>
                        </div>
                        <h4 className="text-body font-bold mb-1 group-hover:text-accent-red transition-colors">
                          {project.title}
                        </h4>
                        <p className="text-small text-text-light">
                          {project.client}
                        </p>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </section>
        );
      })}

      <section className="section-padding bg-accent-red text-white">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-h1 font-bold mb-4 text-white">Ready to Get Started?</h2>
            <p className="text-body mb-8 opacity-90 max-w-2xl mx-auto">
              Let's discuss how my expertise can help your organization achieve its goals.
            </p>
            <Link
              to="/contact"
              className="bg-white text-accent-red px-10 py-3.5 rounded-full font-bold text-small hover:bg-off-white transition-colors inline-block"
            >
              Book a Discovery Call
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
