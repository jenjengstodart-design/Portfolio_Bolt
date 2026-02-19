import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatSignpostProps {
  chatIsOpen: boolean;
}

export default function ChatSignpost({ chatIsOpen }: ChatSignpostProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if the user has already opened the chat before
    if (localStorage.getItem('chatOpened')) return;

    const timer = setTimeout(() => {
      // Check again in case chat was opened during the delay
      if (!localStorage.getItem('chatOpened')) {
        setVisible(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Hide when chat opens
  useEffect(() => {
    if (chatIsOpen) {
      setVisible(false);
    }
  }, [chatIsOpen]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-[88px] right-6 z-40 flex flex-col items-end gap-1 pointer-events-none"
          aria-hidden="true"
        >
          <span className="text-text-primary font-semibold text-sm md:text-base leading-tight">
            Ask Jen's AI
          </span>
          {/* Curved arrow pointing down-right toward the chat button */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 md:w-8 md:h-8"
          >
            {/* Curved path from top-left to bottom-right */}
            <path
              d="M4 4 C 4 18, 18 18, 28 26"
              stroke="#E60000"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Arrowhead pointing down-right */}
            <path
              d="M28 26 L20 24 M28 26 L26 18"
              stroke="#E60000"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
