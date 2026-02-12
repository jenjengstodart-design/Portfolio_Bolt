import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import profileData from '../content/profile.json';
import skillsData from '../content/skills.json';
import experienceData from '../content/experience.json';
import projectsData from '../content/projects.json';
import servicesData from '../content/services.json';
import faqData from '../content/faq.json';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Jen's AI assistant. I can answer questions about her experience, skills, and services. How can I help you today?",
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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    if (conversationId) {
      await supabase.from('chat_messages').insert({
        conversation_id: conversationId,
        role: 'user',
        content: input,
        timestamp: new Date().toISOString(),
      });

      await supabase
        .from('chat_conversations')
        .update({
          last_message_at: new Date().toISOString(),
          message_count: messages.length + 1,
        })
        .eq('id', conversationId);
    }

    try {
      const systemPrompt = `You are an AI assistant representing Jen Jeng, an Innovation Partner with 20+ years of experience. You have access to all her portfolio information and should answer questions accurately based on this data.

CRITICAL BEHAVIOR RULES:
${faqData.aiBehaviorRules.map(rule => `- ${rule}`).join('\n')}

PROFILE INFORMATION:
${JSON.stringify(profileData, null, 2)}

SKILLS & CERTIFICATIONS:
${JSON.stringify(skillsData, null, 2)}

EXPERIENCE:
${JSON.stringify(experienceData, null, 2)}

SERVICES:
${JSON.stringify(servicesData, null, 2)}

PROJECTS (use publicChallenge and publicOutcome for responses):
${JSON.stringify(projectsData.categories.map(cat => ({
  category: cat.name,
  projects: cat.projects.map(p => ({
    id: p.id,
    title: p.title,
    client: p.client,
    industry: p.industry,
    publicChallenge: p.publicChallenge,
    publicOutcome: p.publicOutcome,
    methods: p.methods,
    metrics: p.metrics
  }))
})), null, 2)}

PRE-WRITTEN FAQ ANSWERS:
${faqData.faq.map(item => `Q: ${item.question}\nA: ${item.answer}`).join('\n\n')}

When answering:
1. Be direct and honest - never oversell
2. Use first person ("I") since you represent Jen
3. If you don't have information, say so clearly
4. Reference specific projects and evidence when relevant
5. If asked about something Jen doesn't have experience with, be honest about it
6. Keep responses conversational but professional
7. Suggest they contact Jen directly for detailed discussions`;

      const allMessages = [...messages, userMessage];
      const conversationHistory = allMessages
        .filter((msg, index) => msg.role !== 'assistant' || index > 0)
        .map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

      console.log('Calling chat API with', conversationHistory.length, 'messages');

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      console.log('Request URL:', apiUrl);
      console.log('Using Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing');

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          messages: conversationHistory,
          systemPrompt: systemPrompt,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('=== CHAT API ERROR ===');
        console.error('Status:', response.status);
        console.error('Status Text:', response.statusText);
        console.error('Error Response Body:', errorText);
        console.error('Request URL:', apiUrl);
        console.error('=====================');

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || 'Unknown error' };
        }

        throw new Error(errorData.error || `API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Successfully received AI response');

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content[0].type === 'text' ? data.content[0].text : 'Sorry, I encountered an error.',
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (conversationId) {
        await supabase.from('chat_messages').insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: assistantMessage.content,
          timestamp: new Date().toISOString(),
        });
      }

      const normalizedQuestion = input.toLowerCase().trim();
      const { data: existingQuestion } = await supabase
        .from('popular_questions')
        .select('*')
        .eq('question', normalizedQuestion)
        .maybeSingle();

      if (existingQuestion) {
        await supabase
          .from('popular_questions')
          .update({
            ask_count: existingQuestion.ask_count + 1,
            last_asked: new Date().toISOString(),
          })
          .eq('id', existingQuestion.id);
      } else {
        await supabase.from('popular_questions').insert({
          question: normalizedQuestion,
          ask_count: 1,
          last_asked: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your message. Please try again or contact Jen directly at contact@jenjeng.com',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-lg flex flex-col z-50 border border-border-light"
          >
            <div className="bg-accent-red text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle size={20} />
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
                <div
                  key={index}
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

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-accent-red text-white p-4 rounded-full shadow-lg hover:shadow-red transition-all z-50"
        aria-label="Open chat"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>
    </>
  );
}
