import React, { useState } from 'react';
import { Settings, Shield, Cpu, Bell, Sliders, Database, Moon, Key } from 'lucide-react';

export const SettingsCenter: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'monitoring' | 'privacy' | 'ai' | 'backup'>('general');

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">Central de Configurações Unificada</h2>
          <p className="text-xs text-slate-400">Gestão abrangente de parâmetros de rastreamento, privacidade, IA, alertas e backup</p>
        </div>
      </div>

      {/* Settings Navigation Subtabs */}
      <div className="flex border-b border-slate-800 space-x-4">
        {[
          { id: 'general', label: 'Geral & Aparência' },
          { id: 'monitoring', label: 'Rastreamento & Regras' },
          { id: 'privacy', label: 'Privacidade & Vault' },
          { id: 'ai', label: 'Provedores de IA' },
          { id: 'backup', label: 'Backup & Sincronização' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`pb-3 text-xs font-semibold border-b-2 transition-all ${
              activeSubTab === tab.id
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Subtab Contents */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
        {activeSubTab === 'general' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-semibold text-white">Preferências Gerais</h3>
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <span>Iniciar RotinaActivity com o Windows</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600 cursor-pointer" />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <span>Minimizar para a Barra de Tarefas (System Tray) ao fechar</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600 cursor-pointer" />
            </div>
          </div>
        )}

        {activeSubTab === 'monitoring' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-semibold text-white">Frequência de Captura</h3>
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <span>Intervalo de Verificação de Janela Ativa</span>
              <select className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200">
                <option value="1000">1 Segundo (Alta Precisão)</option>
                <option value="2000">2 Segundos (Recomendado)</option>
                <option value="5000">5 Segundos (Poupança de Energia)</option>
              </select>
            </div>
          </div>
        )}

        {activeSubTab === 'privacy' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-semibold text-white font-mono">Retenção de Dados Locais</h3>
            <p className="text-slate-400">Define o tempo máximo de armazenamento do histórico local:</p>
            <select className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200">
              <option value="unlimited">Ilimitado (Padrão Ultimate)</option>
              <option value="365">1 Ano</option>
              <option value="90">90 Dias</option>
            </select>
          </div>
        )}

        {activeSubTab === 'ai' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-semibold text-white">Configuração Ollama & OpenAI API</h3>
            <div>
              <label className="text-slate-400 block mb-1">Ollama Base Endpoint:</label>
              <input type="text" defaultValue="http://localhost:11434" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1 text-slate-200 font-mono" />
            </div>
          </div>
        )}

        {activeSubTab === 'backup' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-semibold text-white">Agendamento de Backups Encriptados</h3>
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <span>Backup Diário Automático</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600 cursor-pointer" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
