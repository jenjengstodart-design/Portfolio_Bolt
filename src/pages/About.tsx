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
              <h2 className="text-h1 font-bold mb-6">I can help, if you're looking for...</h2>
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
                <div>
                  <h3 className="text-h3 font-bold mb-4">Not Interested In</h3>
                  <ul className="space-y-2">
                    {profileData.notLookingFor.map((item) => (
                      <li key={item} className="text-body text-text-light flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-text-light rounded-full mt-2 flex-shrink-0"></span>
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
            {skillsData.certifications.map((cert, index) => (
              <motion.div
                key={`${cert.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="text-small text-accent-red font-semibold mb-2">
                  {cert.year}
                </div>
                <h3 className="text-body font-bold mb-2">{cert.name}</h3>
                <p className="text-small text-text-light">{cert.issuer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-h1 font-bold mb-6">Experience</h2>
              {experienceData.jobs.map((job, index) => (
                <div key={index} className="mb-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-h3 font-bold">{job.title}</h3>
                      <p className="text-body text-accent-red">{job.company}</p>
                    </div>
                    <span className="text-body text-text-light">
                      {job.startDate} - {job.endDate}
                    </span>
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-h1 font-bold mb-6">Giving Back</h2>
              {experienceData.volunteerWork.map((work, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-h3 font-bold">{work.role}</h3>
                      <p className="text-body text-accent-red">{work.organization}</p>
                    </div>
                    <span className="text-body text-text-light">{work.duration}</span>
                  </div>
                  <p className="text-body text-text-secondary">{work.description}</p>
                </div>
              ))}
            </motion.div>
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
            <h2 className="text-h1 font-bold mb-4 text-white">Want to Work Together?</h2>
            <p className="text-body mb-8 opacity-90 max-w-2xl mx-auto">
              Let's discuss how my experience and skills can help your organization.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact" className="bg-white text-accent-red px-10 py-3.5 rounded-full font-bold text-small hover:bg-off-white transition-colors inline-flex items-center gap-2">
                Book a Call
              </Link>
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
