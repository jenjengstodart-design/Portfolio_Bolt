import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GA_ID = 'G-VH1YDB45NY';
const LINKEDIN_PARTNER_ID = '506285014';

function loadGA() {
  if (document.getElementById('ga-script')) return;
  const script1 = document.createElement('script');
  script1.id = 'ga-script';
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.id = 'ga-config';
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}');
  `;
  document.head.appendChild(script2);
}

function loadLinkedIn() {
  if (document.getElementById('li-script')) return;
  const script1 = document.createElement('script');
  script1.id = 'li-init';
  script1.innerHTML = `
    _linkedin_partner_id = "${LINKEDIN_PARTNER_ID}";
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(_linkedin_partner_id);
  `;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.id = 'li-script';
  script2.innerHTML = `
    (function(l) {
      if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
      window.lintrk.q=[]}
      var s = document.getElementsByTagName("script")[0];
      var b = document.createElement("script");
      b.type = "text/javascript"; b.async = true;
      b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
      s.parentNode.insertBefore(b, s);
    })(window.lintrk);
  `;
  document.head.appendChild(script2);
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Small delay so it doesn't flash immediately on load
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
    if (consent === 'accepted') {
      loadGA();
      loadLinkedIn();
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setVisible(false);
    loadGA();
    loadLinkedIn();
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-sm z-[60] bg-white rounded-2xl shadow-lg border border-border-light p-5"
          role="dialog"
          aria-label="Cookie consent"
        >
          <p className="font-bold text-text-primary text-body mb-1">
            Cookies? Yes, we have those 🍪
          </p>
          <p className="text-small text-text-secondary mb-4 leading-snug">
            Nothing creepy, just basic analytics. You can say no and everything still works fine.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              className="btn-primary text-small px-5 py-2"
            >
              Accept
            </button>
            <button
              onClick={handleDecline}
              className="btn-secondary text-small px-5 py-2"
            >
              No thanks
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
