import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, Loader2, Calendar, Layout, HelpCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hi there! I'm **FlowAI**, your virtual assistant at **Prompt Flow**. 🚀\n\nI can help you explore our updated Social Media & Growth packages, explain our automation services, or guide you to book a **Free Strategy Call** with our experts. What are you looking to achieve today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const rawMsg = textToSend || input;
    if (!rawMsg.trim() || isLoading) return;

    if (!textToSend) {
      setInput('');
    }

    const newMessages: Message[] = [...messages, { role: 'user', text: rawMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setMessages((prev) => [...prev, { role: 'model', text: data.text }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            text: "I'm having a little trouble connecting right now. 🔌\n\nYou can always scroll down to our contact form at the bottom of the page to reach out directly!"
          }
        ]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: "Oops, something went wrong. Let's try again! If issues persist, feel free to fill out our contact form directly on the page."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectSuggested = (query: string) => {
    handleSend(query);
  };

  // Safe and beautiful custom text formatter that parses simple markdown like bolding (`**`) and line breaks
  const renderMessageContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-pink-400">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part.split('\n').map((line, lineIdx) => (
        <span key={`${index}-${lineIdx}`}>
          {lineIdx > 0 && <br />}
          {line}
        </span>
      ));
    });
  };

  const quickPrompts = [
    { text: 'See Pricing Plans', icon: Layout, query: 'What are your Social Media packages and pricing?' },
    { text: 'How to get started?', icon: Sparkles, query: 'How do I sign up or get started with you?' },
    { text: 'Book Free Strategy Call', icon: Calendar, query: 'How do I book a free strategy call?' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="w-[340px] md:w-[380px] h-[500px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col mb-4"
          >
            {/* Header */}
            <div className="bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center">
                    <Sparkles className="text-pink-500 w-4 h-4" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-white">FlowAI</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    Assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
              {messages.map((msg, i) => {
                const isModel = msg.role === 'model';
                return (
                  <div
                    key={i}
                    className={`flex ${isModel ? 'justify-start' : 'justify-end'} items-start gap-2.5`}
                  >
                    {isModel && (
                      <div className="w-6 h-6 bg-slate-800 border border-slate-700 rounded flex items-center justify-center shrink-0 mt-0.5 text-pink-400">
                        <Sparkles size={10} />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3 rounded-xl text-xs font-semibold leading-relaxed ${
                        isModel
                          ? 'bg-slate-800/40 text-slate-200 border border-slate-800/80 rounded-tl-none font-medium'
                          : 'bg-pink-600 text-white rounded-tr-none font-medium border border-pink-500/50'
                      }`}
                    >
                      {renderMessageContent(msg.text)}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start items-center gap-2.5">
                  <div className="w-6 h-6 bg-slate-850 border border-slate-800 rounded flex items-center justify-center shrink-0 text-pink-400">
                    <Sparkles size={10} className="animate-spin" />
                  </div>
                  <div className="bg-slate-800/40 border border-slate-800/80 p-3 rounded-xl rounded-tl-none text-xs text-slate-400 font-medium flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin text-pink-400" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions list */}
            {messages.length === 1 && !isLoading && (
              <div className="px-4 py-2 border-t border-slate-800/50 bg-slate-950/20">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">Suggested</span>
                <div className="flex flex-col gap-1.5">
                  {quickPrompts.map((prompt, pIdx) => {
                    const Icon = prompt.icon;
                    return (
                      <button
                        key={pIdx}
                        onClick={() => selectSuggested(prompt.query)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-left text-xs font-semibold text-slate-300 hover:text-white border border-slate-700/50 transition-all cursor-pointer group"
                      >
                        <Icon size={11} className="text-pink-500 group-hover:scale-110 transition-transform" />
                        <span>{prompt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-slate-800 bg-slate-900/50 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-pink-500/50 text-white rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-xl bg-pink-600 hover:bg-pink-500 disabled:bg-slate-800 disabled:text-slate-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-md shadow-pink-500/10 active:scale-95 disabled:shadow-none"
              >
                <Send size={12} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 bg-pink-600 hover:bg-pink-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-pink-650/10 cursor-pointer relative border border-pink-500"
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </motion.button>
    </div>
  );
}
