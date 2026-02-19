import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lightbulb, Users, TrendingUp, Sparkles, ArrowRight, MessageCircle } from 'lucide-react';
import profileData from '../content/profile.json';
import servicesData from '../content/services.json';
import projectsData from '../content/projects.json';
import { downloadCV } from '../lib/storage';

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
            <div className="flex items-start gap-8 mb-8">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="/images/Screenshot_2026-02-15_at_22.57.59.png"
                    alt="Jen's portrait"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-grow">
                <h1 className="text-hero font-bold mb-4">Hi, I'm Jen.</h1>
                <p className="text-h3 text-text-light font-medium">
                  {profileData.currentTitle}
                </p>
              </div>
            </div>
            <p className="text-body text-text-secondary mb-4 max-w-3xl leading-relaxed">
              {profileData.elevatorPitch}
            </p>
            <button
              onClick={() => window.dispatchEvent(new Event('openChat'))}
              className="text-small text-accent-red font-semibold mb-8 hover:underline text-left flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle size={15} />
              Curious what I do? Ask my AI — it knows my work inside out
            </button>
            <div className="flex flex-wrap gap-4">
              <Link to="/work" className="btn-primary">
                View My Work
              </Link>
              <button onClick={downloadCV} className="btn-secondary">
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
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
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

      {/* MY AI LAB SECTION — placeholder, ready to populate with real tools */}
      <section className="section-padding bg-off-white">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-h1 font-bold mb-2">My AI Lab</h2>
                <p className="text-body text-text-light max-w-2xl">
                  Tools I've built using ChatGPT, Claude Code and Gemini — real AI, real use cases
                </p>
              </div>
              {/* Uncomment when you have a dedicated /ai-lab page:
              <Link to="/ai-lab" className="text-accent-red font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                View all tools <ArrowRight size={18} />
              </Link>
              */}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                tag: 'CLAUDE CODE',
                tagColor: 'bg-orange-100 text-orange-700',
                title: '🚧 Coming soon',
                description: 'An AI tool built with Claude Code. Details to be added.',
                link: '#',
              },
              {
                tag: 'CHATGPT',
                tagColor: 'bg-green-100 text-green-700',
                title: '🚧 Coming soon',
                description: 'A custom GPT or ChatGPT-powered tool. Details to be added.',
                link: '#',
              },
              {
                tag: 'GEMINI',
                tagColor: 'bg-blue-100 text-blue-700',
                title: '🚧 Coming soon',
                description: 'A Gemini Gem or Google AI tool. Details to be added.',
                link: '#',
              },
            ].map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${tool.tagColor}`}>
                  {tool.tag}
                </span>
                <h3 className="text-h3 font-bold mb-3">{tool.title}</h3>
                <p className="text-body text-text-secondary mb-6">{tool.description}</p>
                <a
                  href={tool.link}
                  className="text-accent-red font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Try it <ArrowRight size={16} />
                </a>
              </motion.div>
            ))}
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
            <h2 className="text-h1 font-bold mb-4">My Approach</h2>
            <p className="text-body text-text-light max-w-2xl mx-auto">
              Three things that make the difference between good ideas and real results
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Start with people',
                points: ['Every brief starts with who this is really for', 'Research and empathy before any solution', 'Validation before you invest'],
              },
              {
                title: 'Build in structure',
                points: ['Clear frameworks and measurable outcomes', 'Work that scales and replicates without me', 'Processes that stick long after I\'ve left'],
              },
              {
                title: 'Amplify with AI',
                points: ['AI as a working partner, not a shortcut', 'Think faster, spot patterns, deliver more', 'Practical and measurable, not hype'],
              },
            ].map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-off-white p-8 rounded-2xl shadow-sm"
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
            <h2 className="text-h1 font-bold mb-4 text-white">Got a challenge worth solving?</h2>
            <p className="text-body mb-8 opacity-90 max-w-2xl mx-auto">
              Book a 30-minute discovery call — no pitch, just a conversation about where you're headed and whether I'm the right person to help.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://calendly.com/jen-jengstodart"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-accent-red px-10 py-3.5 rounded-full font-bold text-small hover:bg-off-white transition-colors"
              >
                Book a Discovery Call
              </a>
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
