import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Linkedin, Download } from 'lucide-react';
import profileData from '../content/profile.json';
import skillsData from '../content/skills.json';
import experienceData from '../content/experience.json';
import { downloadCV } from '../lib/storage';

export default function About() {
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Strong':
        return 'bg-accent-red';
      case 'Moderate':
        return 'bg-orange-500';
      default:
        return 'bg-gray-400';
    }
  };

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
            <h1 className="text-hero font-bold mb-4">About Jen</h1>
            <p className="text-h3 text-text-light mb-6">
              {profileData.currentTitle}
            </p>
            <div className="flex items-center gap-4 mb-8">
              <a
                href={profileData.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-body text-accent-red hover:underline"
              >
                <Linkedin size={20} />
                <span>LinkedIn</span>
              </a>
              <span className="text-text-light">•</span>
              <span className="text-body text-text-light">
                {profileData.location} | {profileData.remote}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-off-white">
        <div className="section-container">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-h1 font-bold mb-6">My Journey</h2>
              <p className="text-body text-text-secondary leading-relaxed mb-6">
                {profileData.elevatorPitch}
              </p>
              <p className="text-body text-text-secondary leading-relaxed">
                {profileData.careerNarrative}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-h1 font-bold mb-6">We're probably a good fit if...</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-h3 font-bold mb-4 text-accent-red">Seeking</h3>
                  <ul className="space-y-2">
                    {profileData.lookingFor.map((item) => (
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
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-h1 font-bold mb-4">Key Capabilities</h2>
            <p className="text-body text-text-light max-w-2xl">
              Skills and expertise developed over 20+ years of innovation work
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {skillsData.keySkillCategories.map((skill, index) => (
              <motion.div
                key={skill.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-off-white p-6 rounded-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-h3 font-bold">{skill.category}</h3>
                  <span className={`px-3 py-1 ${getRatingColor(skill.rating)} text-white text-small rounded-full`}>
                    {skill.rating}
                  </span>
                </div>
                <p className="text-body text-text-secondary mb-4">
                  {skill.description}
                </p>
                <div>
                  <p className="text-small font-semibold mb-2">Evidence:</p>
                  <ul className="space-y-1">
                    {skill.evidence.map((evidence) => (
                      <li key={evidence} className="text-small text-text-light flex items-start gap-2">
                        <span className="w-1 h-1 bg-accent-red rounded-full mt-2 flex-shrink-0"></span>
                        <span>{evidence}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
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
            className="mb-12"
          >
            <h2 className="text-h1 font-bold mb-4">Credentials & Certifications</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {skillsData.certificationGroups.map((group, groupIndex) => (
              <motion.div
                key={group.groupLabel}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: groupIndex * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="text-small text-accent-red font-bold mb-4 uppercase tracking-wide">
                  {group.groupLabel}
                </div>
                <ul className="space-y-4">
                  {group.items.map((item) => (
                    <li key={`${item.name}-${item.year}`} className="border-b border-border-light pb-3 last:border-0 last:pb-0">
                      <p className="text-body font-semibold leading-snug mb-1">{item.name}</p>
                      <p className="text-small text-text-light">{item.issuer} · {item.year}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="max-w-4xl">
            {/* Current role — Magnetic */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-h1 font-bold mb-6">Experience</h2>
              {experienceData.jobs.map((job, index) => (
                <div key={index} className="mb-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-h3 font-bold">{job.title}</h3>
                      <p className="text-body text-accent-red">{job.company}</p>
                    </div>
                    {job.startDate && job.endDate && (
                      <span className="text-body text-text-light">
                        {job.startDate} - {job.endDate}
                      </span>
                    )}
                  </div>
                  <div className="mb-4">
                    <h4 className="text-body font-semibold mb-2">Key Achievements:</h4>
                    <ul className="space-y-2">
                      {job.achievements.map((achievement) => (
                        <li key={achievement} className="text-body text-text-secondary flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-accent-red rounded-full mt-2 flex-shrink-0"></span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Prior experience — agency + client-side */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-h1 font-bold mb-6 pt-8 border-t border-border-light">
                Experience prior to Magnetic
              </h2>
              {experienceData.priorJobs.map((group) => (
                <div key={group.sectionLabel} className="mb-10">
                  <h3 className="text-h3 font-bold text-text-light mb-6">
                    {group.sectionLabel}
                  </h3>
                  {group.jobs.map((job, jobIndex) => (
                    <div key={jobIndex} className="mb-8 pl-0">
                      <div className="mb-3">
                        <h4 className="text-h3 font-bold">{job.title}</h4>
                        <p className="text-body text-accent-red">{job.company}</p>
                        {job.context && (
                          <p className="text-small text-text-light italic mt-0.5">{job.context}</p>
                        )}
                      </div>
                      <ul className="space-y-2">
                        {job.achievements.map((achievement) => (
                          <li key={achievement} className="text-body text-text-secondary flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-accent-red rounded-full mt-2 flex-shrink-0"></span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Want to know more? — replaces Giving Back */}
      <section className="section-padding bg-off-white">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-h1 font-bold mb-3">Want to know more?</h2>
                <p className="text-body text-text-secondary max-w-xl">
                  Connect with me on LinkedIn to see my latest thinking, projects, and how I'm using AI in practice.
                </p>
              </div>
              <a
                href={profileData.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2 whitespace-nowrap flex-shrink-0"
              >
                <Linkedin size={20} />
                View My LinkedIn
              </a>
            </div>
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
            <h2 className="text-h1 font-bold mb-4 text-white">Sound like the right fit?</h2>
            <p className="text-body mb-8 opacity-90 max-w-2xl mx-auto">
              Book a call and let's find out. It's 30 minutes, no strings attached.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="https://calendly.com/jen-jengstodart" target="_blank" rel="noopener noreferrer" className="bg-white text-accent-red px-10 py-3.5 rounded-full font-bold text-small hover:bg-off-white transition-colors inline-flex items-center gap-2">
                Book a Call
              </a>
              <button
                onClick={downloadCV}
                className="bg-transparent text-white border-2 border-white px-9 py-3 rounded-full font-semibold text-small hover:bg-white hover:text-accent-red transition-colors inline-flex items-center gap-2"
              >
                <Download size={20} />
                Download CV
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
