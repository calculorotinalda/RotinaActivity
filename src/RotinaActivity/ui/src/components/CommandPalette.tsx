import React, { useState, useEffect } from 'react';
import { Search, X, AppWindow, Globe, FileText, Zap, Bot, Shield, Target } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectAction
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered by parent if implemented, or handles state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickCommands = [
    { id: 'timeline', label: 'Ver Timeline Forense de Hoje', icon: <AppWindow className="w-4 h-4 text-indigo-400" />, type: 'Navegação' },
    { id: 'ai-coach', label: 'Perguntar ao AI Coach sobre produtividade', icon: <Bot className="w-4 h-4 text-purple-400" />, type: 'IA' },
    { id: 'focus', label: 'Iniciar Sessão de Deep Work (25 min)', icon: <Target className="w-4 h-4 text-emerald-400" />, type: 'Modo Focus' },
    { id: 'privacy', label: 'Pausar Monitorização Imediatamente', icon: <Shield className="w-4 h-4 text-amber-400" />, type: 'Privacidade' },
    { id: 'automation', label: 'Criar Nova Regra Visual IF/THEN', icon: <Zap className="w-4 h-4 text-blue-400" />, type: 'Automação' },
    { id: 'reports', label: 'Exportar Relatório PDF / Markdown', icon: <FileText className="w-4 h-4 text-slate-400" />, type: 'Relatório' }
  ];

  const filteredCommands = quickCommands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="w-full max-w-2xl bg-[#111622] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Input Header */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <Search className="w-5 h-5 text-indigo-400" />
            <input
              type="text"
              autoFocus
              placeholder="Pesquisar aplicações, sites, projetos, regras, IA..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => {
                  onSelectAction(cmd.id);
                  onClose();
                }}
                className="w-full px-3 py-2.5 rounded-lg flex items-center justify-between text-left hover:bg-indigo-600/15 group transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="p-1.5 rounded bg-slate-900 border border-slate-800 group-hover:border-indigo-500/40">
                    {cmd.icon}
                  </span>
                  <span className="text-xs font-medium text-slate-200 group-hover:text-indigo-300">
                    {cmd.label}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {cmd.type}
                </span>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              Nenhum resultado encontrado para "{query}".
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Usa <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">↓</kbd> para navegar</span>
          <span>Esc para fechar</span>
        </div>
      </div>
    </div>
  );
};
