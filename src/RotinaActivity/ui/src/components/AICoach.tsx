import React, { useState } from 'react';
import { AIInsight } from '../types';
import { Bot, Send, Sparkles, Cpu, Cloud } from 'lucide-react';

interface AICoachProps {
  insights: AIInsight[];
}

export const AICoach: React.FC<AICoachProps> = ({ insights }) => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string; confidence?: number }[]>([
    {
      sender: 'ai',
      text: 'Olá! Sou o teu AI Productivity Coach local. Pergunta-me sobre o teu desempenho, distrações ou recomendações de otimização de rotina!',
      confidence: 100
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [aiProvider, setAiProvider] = useState<'ollama' | 'openai'>('ollama');
  const [selectedModel, setSelectedModel] = useState('llama3:8b-instruct');

  const suggestedPrompts = [
    "Quanto tempo trabalhei hoje?",
    "Em que projeto passei mais tempo esta semana?",
    "Qual foi a minha maior distração?",
    "Qual é o meu horário mais produtivo?",
    "Como posso melhorar a minha produtividade?"
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = { sender: 'user' as const, text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');

    setTimeout(() => {
      let replyText = "Com base nos teus dados locais de hoje:";
      if (query.includes("trabalhei hoje")) {
        replyText = "A tua atividade está a ser capturada em tempo real na base de dados SQLite.";
      } else if (query.includes("distração") || query.includes("redes sociais")) {
        replyText = "O monitoramento contextual deteta alternâncias de janelas para identificar perdas de foco.";
      } else if (query.includes("horário mais produtivo") || query.includes("melhor")) {
        replyText = "Recomendamos agendar tarefas complexas nos teus blocos de maior tempo de atividade contínua!";
      } else {
        replyText = `Analisei a tua solicitação ("${query}"). Os teus dados de produção estão preservados localmente com total privacidade.`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: replyText, confidence: 95 }]);
    }, 500);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
      {/* Header & AI Model Configuration */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 glass-panel p-4 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/30 to-slate-900 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span>AI Productivity Coach</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                LOCAL-FIRST
              </span>
            </h2>
            <p className="text-xs text-slate-300">Assistente pessoal de produtividade treinado em linguagem natural sobre os teus dados privados</p>
          </div>
        </div>

        {/* Model Switcher */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center bg-slate-950/80 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setAiProvider('ollama')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-all ${
                aiProvider === 'ollama' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Ollama (Local)</span>
            </button>
            <button
              onClick={() => setAiProvider('openai')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-all ${
                aiProvider === 'openai' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Cloud LLM</span>
            </button>
          </div>

          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="llama3:8b-instruct">Llama 3 8B (Local)</option>
            <option value="mistral:7b">Mistral 7B (Local)</option>
            <option value="gpt-4o-mini">GPT-4o Mini (Cloud)</option>
          </select>
        </div>
      </div>

      {/* AI Insights & Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((ins) => (
          <div key={ins.id} className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-2 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>{ins.title}</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                {ins.confidenceScore}% Confiança
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300">{ins.description}</p>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono pt-1 border-t border-slate-200 dark:border-slate-800/60">
              {ins.timestamp}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="glass-panel rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-col h-96 shadow-sm dark:shadow-none">
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-xl p-3 rounded-xl text-xs ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700/60'
                }`}
              >
                <p>{m.text}</p>
                {m.confidence && m.sender === 'ai' && (
                  <span className="block text-[9px] text-indigo-600 dark:text-indigo-300 font-mono mt-1 text-right">
                    Grau de Confiança: {m.confidence}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Prompts */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono shrink-0">Sugestões:</span>
          {suggestedPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(p)}
              className="text-[10px] whitespace-nowrap bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full border border-slate-300 dark:border-slate-700 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Faz uma pergunta em linguagem natural ao AI Coach..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleSendMessage()}
            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-md shadow-indigo-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
