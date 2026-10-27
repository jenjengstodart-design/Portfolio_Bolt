import { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const PROMPT_CHIPS = [
  "What kind of work does Jen do?",
  "Tell me about a project",
  "How does Jen use AI?",
];

interface ChatWidgetProps {
  onOpen?: () => void;
}

export default function ChatWidget({ onOpen }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSignpost, setShowSignpost] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Jen's AI assistant — here to answer questions about her work, approach, and how she might be able to help you. What would you like to know? 👋",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !conversationId) {
      initializeConversation();
    }
  }, [isOpen]);

  // Show signpost on first visit after 2s delay
  useEffect(() => {
    if (localStorage.getItem('chatOpened')) return;
    const timer = setTimeout(() => {
      if (!localStorage.getItem('chatOpened')) {
        setShowSignpost(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Listen for openChat custom event from hero callout
  useEffect(() => {
    const handler = () => {
      setIsOpen(true);
      localStorage.setItem('chatOpened', 'true');
      setShowSignpost(false);
    };
    window.addEventListener('openChat', handler);
    return () => window.removeEventListener('openChat', handler);
  }, []);

  const initializeConversation = async () => {
    const sessionId = sessionStorage.getItem('session_id') || generateSessionId();
    sessionStorage.setItem('session_id', sessionId);

    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          session_id: sessionId,
          started_at: new Date().toISOString(),
          last_message_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      setConversationId(data.id);

      await supabase.from('analytics_events').insert({
        event_type: 'chat_started',
        session_id: sessionId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error initializing conversation:', error);
    }
  };

  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    if (conversationId) {
      try {
        await supabase.from('chat_messages').insert({
          conversation_id: conversationId,
          role: 'user',
          content: messageText,
          timestamp: new Date().toISOString(),
        });

        await supabase
          .from('chat_conversations')
          .update({
            last_message_at: new Date().toISOString(),
            message_count: messages.length + 1,
          })
          .eq('id', conversationId);
      } catch (error) {
        console.warn('Chat transcript logging unavailable:', error);
      }
    }

    try {
      const allMessages = [...messages, userMessage];
      const conversationHistory = allMessages
        .filter((msg, index) => msg.role !== 'assistant' || index > 0)
        .map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Chat API error', response.status, errorText);

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || 'Unknown error' };
        }

        // 429 and 503 carry text worth showing the visitor verbatim.
        const showVerbatim = response.status === 429 || response.status === 503;
        const err = new Error(
          errorData.error || `API error: ${response.status} ${response.statusText}`
        );
        if (showVerbatim && errorData.error) {
          (err as Error & { userFacing?: string }).userFacing = errorData.error;
        }
        throw err;
      }

      const data = await response.json();

      // The API returns an array of blocks and text is not always first - a
      // thinking block can precede it. Join every text block rather than
      // trusting content[0].
      const replyText = Array.isArray(data.content)
        ? data.content
            .filter((block: { type?: string }) => block?.type === 'text')
            .map((block: { text?: string }) => block.text ?? '')
            .join('\n\n')
            .trim()
        : '';

      const assistantMessage: Message = {
        role: 'assistant',
        content: replyText || 'Sorry, I encountered an error.',
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (conversationId) {
        try {
          await supabase.from('chat_messages').insert({
            conversation_id: conversationId,
            role: 'assistant',
            content: assistantMessage.content,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          console.warn('Chat transcript logging unavailable:', error);
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const userFacing = (error as Error & { userFacing?: string })?.userFacing;
      const errorMessage: Message = {
        role: 'assistant',
        content:
          userFacing ??
          'Sorry, I encountered an error processing your message. Please try again or contact Jen directly at jen.jengstodart@gmail.com',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    sendMessage(input);
  };

  const handleChipClick = (chipText: string) => {
    sendMessage(chipText);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 h-[520px] bg-white rounded-2xl shadow-lg flex flex-col z-50 border border-border-light"
          >
            <div className="bg-accent-red text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/images/1_cartoon_headshot.png" alt="Jen" className="w-8 h-8 rounded-full object-cover object-top border-2 border-white/40" />
                <span className="font-bold text-body">Chat with Jen's AI Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index}>
                  <div
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-accent-red text-white'
                          : 'bg-off-white text-text-secondary'
                      }`}
                    >
                      <p className="text-small whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                  {/* Prompt chips — shown only after the welcome message, before any user reply */}
                  {message.role === 'assistant' && index === 0 && messages.length === 1 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {PROMPT_CHIPS.map((chip) => (
                        <button
                          key={chip}
                          onClick={() => handleChipClick(chip)}
                          disabled={isLoading}
                          className="text-xs px-3 py-1.5 rounded-full border border-accent-red text-accent-red hover:bg-accent-red hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-off-white p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-text-light rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-text-light rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-text-light rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-border-light">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 border border-border-light rounded-full focus:outline-none focus:ring-2 focus:ring-accent-red text-small"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-accent-red text-white p-2 rounded-full hover:bg-accent-red-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end">
        {/* Pulse ring — only when chat is closed */}
        {!isOpen && (
          <span className="absolute inline-flex rounded-full bg-accent-red opacity-30 animate-ping"
            style={{ width: '56px', height: '56px', right: 0, bottom: 0 }}
          />
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const opening = !isOpen;
            setIsOpen(opening);
            if (opening) {
              localStorage.setItem('chatOpened', 'true');
              setShowSignpost(false);
              onOpen?.();
            }
          }}
          className={`relative bg-accent-red text-white rounded-full shadow-lg hover:shadow-red flex items-center justify-center gap-2 transition-all duration-300 ${
            showSignpost && !isOpen
              ? 'px-5 py-4 text-sm font-bold'
              : 'p-1'
          }`}
          aria-label="Open chat"
        >
          {isOpen ? (
            <X size={28} />
          ) : showSignpost ? (
            <>
              <img src="/images/1_cartoon_headshot.png" alt="Jen" className="w-8 h-8 rounded-full object-cover object-top" />
              <span className="text-white text-sm font-bold whitespace-nowrap">Chat with Jen</span>
            </>
          ) : (
            <img src="/images/1_cartoon_headshot.png" alt="Jen" className="w-12 h-12 rounded-full object-cover object-top" />
          )}
        </motion.button>
      </div>
    </>
  );
}
