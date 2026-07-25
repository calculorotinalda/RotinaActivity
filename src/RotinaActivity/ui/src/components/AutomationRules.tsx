import React, { useState, useEffect } from 'react';
import { AutomationRule } from '../types';
import { Zap, Plus, Trash2, ArrowRight } from 'lucide-react';
import { ApiService } from '../services/api';

interface AutomationRulesProps {
  rules: AutomationRule[];
}

export const AutomationRules: React.FC<AutomationRulesProps> = ({ rules: initialRules }) => {
  const [rules, setRules] = useState<AutomationRule[]>(initialRules);
  const [ruleName, setRuleName] = useState('');
  const [condition, setCondition] = useState('App == "VS Code"');
  const [action, setAction] = useState('Ativar Modo Focus & Atribuir Projeto');

  useEffect(() => {
    setRules(initialRules);
  }, [initialRules]);

  const handleCreateRule = async () => {
    if (!ruleName.trim()) return;
    const newRule: AutomationRule = {
      id: Date.now().toString(),
      name: ruleName,
      conditionIf: condition,
      actionThen: action,
      isActive: true
    };

    setRules(prev => [...prev, newRule]);
    setRuleName('');
    await ApiService.saveRule(newRule);
  };

  const toggleRule = async (id: string) => {
    const targetRule = rules.find(r => r.id === id);
    if (!targetRule) return;

    const newActiveState = !targetRule.isActive;
    setRules(rules.map(r => r.id === id ? { ...r, isActive: newActiveState } : r));
    await ApiService.toggleRule(id, newActiveState);
  };

  const handleDeleteRule = async (id: string) => {
    setRules(rules.filter(item => item.id !== id));
    await ApiService.deleteRule(id);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="glass-panel p-4 rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-950/30 to-slate-900 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Motor de Automação Visual (Regras IF / THEN)</h2>
            <p className="text-xs text-slate-300">Cria automações contextuais gravadas em base de dados para alternar projetos ou ativar modo focus</p>
          </div>
        </div>

        <span className="text-xs font-mono text-blue-300 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">
          {rules.filter(r => r.isActive).length} Regras Ativas
        </span>
      </div>

      {/* Visual Rule Builder Card */}
      <div className="glass-panel p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4 shadow-sm dark:shadow-none">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Criar Nova Regra de Automação</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block mb-1">Nome da Regra:</label>
            <input
              type="text"
              placeholder="Ex: Foco no Desenvolvimento"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-indigo-500 dark:text-indigo-400 block mb-1">Condição (SE / IF):</label>
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 block mb-1">Ação (ENTÃO / THEN):</label>
            <input
              type="text"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 font-mono focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleCreateRule}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all shadow-md shadow-blue-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Salvar e Gravar Regra na Base de Dados</span>
        </button>
      </div>

      {/* Rules List */}
      <div className="glass-panel p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4 shadow-sm dark:shadow-none">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Regras de Automação Gravadas</h3>

        {rules.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs">
            Nenhuma regra gravada na base de dados ainda. Usa o formulário acima para criar regras persitidas.
          </div>
        ) : (
          <div className="space-y-3">
            {rules.map((r) => (
              <div key={r.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{r.name}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.2 rounded ${r.isActive ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                      {r.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-mono text-slate-600 dark:text-slate-400">
                    <span className="text-indigo-600 dark:text-indigo-400">SE [{r.conditionIf}]</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-emerald-600 dark:text-emerald-400">ENTÃO [{r.actionThen}]</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleRule(r.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      r.isActive ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/30' : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/30'
                    }`}
                  >
                    {r.isActive ? 'Desativar' : 'Ativar'}
                  </button>
                  <button
                    onClick={() => handleDeleteRule(r.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
