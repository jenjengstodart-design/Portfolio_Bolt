import { motion } from 'framer-motion';

const clients = [
  'Mars Inc',
  'Waitrose',
  'National Physical Laboratory',
  'Acacium Group',
  'Mars Pet Nutrition',
  'Miro',
  'Kingston University',
  'Channel 4',
  'William Hill',
];

export default function ClientLogos() {
  return (
    <section className="section-padding bg-off-white">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-h2 font-bold mb-4">Trusted By</h2>
          <p className="text-body text-text-light">
            Selected clients and partners I've worked with
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 items-center">
          {clients.map((client, index) => (
            <motion.div
              key={client}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex items-center justify-center"
            >
              <div className="group w-full h-24 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center p-6 grayscale hover:grayscale-0">
                <span className="text-body font-semibold text-text-secondary group-hover:text-accent-red transition-colors text-center">
                  {client}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
