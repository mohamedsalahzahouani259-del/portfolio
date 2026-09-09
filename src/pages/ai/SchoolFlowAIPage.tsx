import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  Award,
  Users,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { askSchoolFlowAI } from '../../lib/schoolFlowAI';
import { Button } from '../../components/ui/Button';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const SchoolFlowAIPage: React.FC = () => {
  const { user, organization } = useAuth();
  const {
    students,
    formations,
    groups,
    trainers,
    enrollments,
    sessions,
    attendance,
    payments,
  } = useData();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-0',
      sender: 'ai',
      text: `Bonjour ${user?.firstName || 'Directeur'} ! Je suis **SchoolFlow AI**, votre assistant d'analyse pédagogique et financière. Je suis connecté en temps réel aux données de **${organization?.name || 'votre centre'}**. Posez-moi une question sur vos étudiants, vos absences, vos encaissements ou vos plannings !`,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQueries = [
    'Quels sont les étudiants avec des absences ?',
    'Combien de dinars reste-t-il à encaisser ?',
    'Quel formateur a effectué le plus d’heures ?',
    'Quelle est la formation la plus rentable ?',
    'Donne-moi un résumé global du centre',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    // Compute live response from current data
    setTimeout(() => {
      const aiResponse = askSchoolFlowAI(q, {
        students,
        formations,
        groups,
        trainers,
        enrollments,
        sessions,
        attendance,
        payments,
      });

      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
              <span>SchoolFlow AI</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider">
              Live Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Analyse intelligente en langage naturel sur vos données pédagogiques et financières
          </p>
        </div>
      </div>

      {/* 2. Suggested Prompt Chips */}
      <div className="flex flex-wrap gap-2">
        {suggestedQueries.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(item)}
            className="text-xs px-3 py-1.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 rounded-xl transition-all shadow-2xs text-left"
          >
            {item}
          </button>
        ))}
      </div>

      {/* 3. Chat Window */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[520px]">
        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-slate-800 text-white'
                    : 'bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-xs'
                }`}
              >
                {msg.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white font-medium rounded-tr-xs'
                    : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <p
                  className={`text-[10px] mt-2 text-right ${
                    msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 text-slate-500 border border-slate-200 rounded-2xl px-4 py-3 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-200" />
                <span className="text-[11px] font-medium text-slate-600">Calcul en cours...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Posez une question sur les notes, l'argent encaissé, les absences..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <Button
            variant="primary"
            onClick={() => handleSendMessage()}
            icon={Send}
            disabled={!inputQuery.trim()}
          >
            Envoyer
          </Button>
        </div>
      </div>
    </div>
  );
};
