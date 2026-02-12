import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, Linkedin, MapPin, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import profileData from '../content/profile.json';

type FormData = {
  name: string;
  email: string;
  company: string;
  inquiryType: string;
  message: string;
};

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const { error } = await supabase.from('analytics_events').insert({
        event_type: 'contact_form_submission',
        page: '/contact',
        metadata: data,
        session_id: sessionStorage.getItem('session_id') || 'unknown',
      });

      if (error) throw error;

      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
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
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-hero font-bold mb-6">Let's Connect</h1>
            <p className="text-h3 text-text-light">
              Ready to discuss how I can help your organization thrive? Get in touch.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-h2 font-bold mb-6">Get in Touch</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-body font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-4 py-3 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-red"
                  />
                  {errors.name && (
                    <p className="text-small text-accent-red mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-body font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className="w-full px-4 py-3 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-red"
                  />
                  {errors.email && (
                    <p className="text-small text-accent-red mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="company" className="block text-body font-medium mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    {...register('company')}
                    className="w-full px-4 py-3 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-red"
                  />
                </div>

                <div>
                  <label htmlFor="inquiryType" className="block text-body font-medium mb-2">
                    Inquiry Type *
                  </label>
                  <select
                    id="inquiryType"
                    {...register('inquiryType', { required: 'Please select an inquiry type' })}
                    className="w-full px-4 py-3 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-red"
                  >
                    <option value="">Select...</option>
                    <option value="innovation-management">Innovation Management</option>
                    <option value="human-centred-design">Human-Centred Design</option>
                    <option value="transformation-strategy">Transformation Strategy</option>
                    <option value="ai-capability-building">AI Capability Building</option>
                    <option value="general">General Inquiry</option>
                  </select>
                  {errors.inquiryType && (
                    <p className="text-small text-accent-red mt-1">{errors.inquiryType.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-body font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register('message', { required: 'Message is required' })}
                    className="w-full px-4 py-3 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-red resize-none"
                  />
                  {errors.message && (
                    <p className="text-small text-accent-red mt-1">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 text-green-800 rounded-lg text-body">
                    Thank you for your message! I'll get back to you soon.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 text-red-800 rounded-lg text-body">
                    There was an error sending your message. Please try again or contact me directly.
                  </div>
                )}
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-h2 font-bold mb-6">Contact Information</h2>

                <div className="space-y-4">
                  <a
                    href={`mailto:${profileData.email}`}
                    className="flex items-start gap-4 p-4 bg-off-white rounded-lg hover:bg-nav-active transition-colors"
                  >
                    <Mail className="text-accent-red flex-shrink-0 mt-1" size={24} />
                    <div>
                      <p className="text-body font-medium">Email</p>
                      <p className="text-body text-text-light">{profileData.email}</p>
                    </div>
                  </a>

                  <a
                    href={profileData.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 bg-off-white rounded-lg hover:bg-nav-active transition-colors"
                  >
                    <Linkedin className="text-accent-red flex-shrink-0 mt-1" size={24} />
                    <div>
                      <p className="text-body font-medium">LinkedIn</p>
                      <p className="text-body text-text-light">Connect with me on LinkedIn</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 bg-off-white rounded-lg">
                    <MapPin className="text-accent-red flex-shrink-0 mt-1" size={24} />
                    <div>
                      <p className="text-body font-medium">Location</p>
                      <p className="text-body text-text-light">
                        {profileData.location} | {profileData.remote}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-off-white rounded-lg">
                    <Clock className="text-accent-red flex-shrink-0 mt-1" size={24} />
                    <div>
                      <p className="text-body font-medium">Availability</p>
                      <p className="text-body text-text-light">{profileData.availability}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-accent-red/5 p-6 rounded-lg border-l-4 border-accent-red">
                <h3 className="text-h3 font-bold mb-3">I can help you if you're looking for</h3>
                <ul className="space-y-2">
                  {profileData.lookingFor.slice(0, 3).map((item) => (
                    <li key={item} className="text-body text-text-secondary flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-accent-red rounded-full mt-2 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
