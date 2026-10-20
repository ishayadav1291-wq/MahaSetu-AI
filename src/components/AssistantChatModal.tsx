import React, { useState } from 'react';
import { BookOpen, Send, X, Bot, User, ShieldCheck } from 'lucide-react';
import { translations } from '../i18n/translations';

interface AssistantChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'mr';
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
  rule_id?: string;
}

export const AssistantChatModal: React.FC<AssistantChatModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const t = translations[lang];

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: lang === 'mr'
        ? 'नमस्कार! मी महासेतू नियम सहाय्यक आहे. महाराष्ट्रातील औद्योगिक परवानग्या, अग्निशमन NOC किंवा प्रदूषण संमती नियमांबद्दल मला विचारू शकता. मी केवळ अधिकृत नियमांवर आधारित उत्तरे देतो.'
        : 'Welcome! I am the MahaSetu Rules Assistant. Ask me about Maharashtra industrial permissions, Fire NOC, MPCB clearances, or Factories Act regulations. All my answers strictly cite verified rules.',
    },
  ]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', text: textToSend }];
    setMessages(newMessages);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/v1/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          language: lang,
        }),
      });

      const data = await res.json();
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          text: data.answer || (lang === 'mr' ? 'खात्री नाही. कृपया संबंधित विभागाशी संपर्क साधा.' : 'Not sure. Please contact the department.'),
          rule_id: data.rule_id,
        },
      ]);
    } catch (e) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          text: lang === 'mr' ? 'तांत्रिक त्रुटी. कृपया पुन्हा प्रयत्न करा.' : 'Connection error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full h-[580px] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white/10 rounded">
              <BookOpen className="w-5 h-5 text-slate-200" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                {lang === 'mr' ? 'शासकीय नियम व परवानगी सहाय्यक' : 'Regulatory Rules & Clearances Guide'}
              </h3>
              <p className="text-[11px] text-slate-300">
                {lang === 'mr' ? 'अधिकृत शासकीय अधिनियमांवर आधारित' : 'Rules-grounded statutory answers based on Maharashtra State Acts'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded cursor-pointer transition-colors"
          >
            <X className="w-5 h-5 text-slate-300 hover:text-white" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  <BookOpen className="w-3.5 h-3.5 text-slate-200" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-blue-900 text-white rounded-tr-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs space-y-1.5'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                {m.rule_id && (
                  <div className="pt-1 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-mono font-semibold text-blue-900">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Cited Rule: {m.rule_id}</span>
                  </div>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center shrink-0 text-xs">
                M
              </div>
              <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-500 shadow-xs animate-pulse">
                Consulting Maharashtra State rules catalog...
              </div>
            </div>
          )}
        </div>

        {/* Sample Prompt Chips */}
        <div className="px-4 py-2 border-t border-slate-100 bg-white flex flex-wrap items-center gap-1.5 text-[11px]">
          <button
            onClick={() => handleSend(t.assistant_sample_q1)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md cursor-pointer transition-colors"
          >
            {t.assistant_sample_q1}
          </button>
          <button
            onClick={() => handleSend(t.assistant_sample_q2)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md cursor-pointer transition-colors"
          >
            {t.assistant_sample_q2}
          </button>
          <button
            onClick={() => handleSend(t.assistant_sample_q3)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md cursor-pointer transition-colors"
          >
            {t.assistant_sample_q3}
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={t.assistant_placeholder}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="p-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white rounded-lg cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
