import { Link } from 'react-router-dom';
import { Linkedin, Mail } from 'lucide-react';
import profileData from '../content/profile.json';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-text-primary text-white py-12">
      <div className="section-container">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-h3 font-bold mb-4 text-white">Jen Jeng</h3>
            <p className="text-small opacity-90">
              Innovation Partner helping organisations design human-centred,
              future-ready growth in an AI-powered world.
            </p>
          </div>

          <div>
            <h4 className="text-body font-semibold mb-4 text-white">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/expertise" className="text-small opacity-90 hover:opacity-100 hover:text-accent-red transition-colors">
                Expertise
              </Link>
              <Link to="/work" className="text-small opacity-90 hover:opacity-100 hover:text-accent-red transition-colors">
                Work
              </Link>
              <Link to="/about" className="text-small opacity-90 hover:opacity-100 hover:text-accent-red transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-small opacity-90 hover:opacity-100 hover:text-accent-red transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-body font-semibold mb-4 text-white">Connect</h4>
            <div className="flex gap-4">
              <a
                href={profileData.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-accent-red transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <Link
                to="/contact"
                className="p-2 bg-white/10 rounded-full hover:bg-accent-red transition-colors"
                aria-label="Contact"
              >
                <Mail size={20} />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 text-center">
          <p className="text-small opacity-75">
            © {currentYear} Jen Jeng. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
