import React, { useState } from 'react';
import { PrivacyRule } from '../types';
import { Shield, Lock, EyeOff, Trash2, Key, CheckCircle, AlertTriangle, Plus } from 'lucide-react';

export const PrivacyCenter: React.FC = () => {
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(true);
  const [incognitoAutoPause, setIncognitoAutoPause] = useState(true);
  const [titleMasking, setTitleMasking] = useState(true);
  const [masterPassword, setMasterPassword] = useState('••••••••••••');

  const [privacyRules, setPrivacyRules] = useState<PrivacyRule[]>([
    { id: 'p1', appOrDomain: 'banking.santander.pt', ruleType: 'exclude', pattern: '*santander*', isActive: true },
    { id: 'p2', appOrDomain: 'KeePass.exe', ruleType: 'exclude', pattern: 'KeePass.exe', isActive: true },
    { id: 'p3', appOrDomain: 'WhatsApp.exe', ruleType: 'mask', pattern: '*WhatsApp*', isActive: true }
  ]);

  const [newDomain, setNewDomain] = useState('');

  const handleAddRule = () => {
    if (!newDomain.trim()) return;
    const newRule: PrivacyRule = {
      id: Date.now().toString(),
      appOrDomain: newDomain,
      ruleType: 'exclude',
      pattern: `*${newDomain}*`,
      isActive: true
    };
    setPrivacyRules([...privacyRules, newRule]);
    setNewDomain('');
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/30 to-slate-900 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Centro de Privacidade & Cofre Zero-Knowledge</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                AES-256 ENCRYPTED
              </span>
            </h2>
            <p className="text-xs text-slate-400">Auditoria de acessos, exclusão automática de dados sensíveis e encriptação local absoluta</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20 font-mono">
          <Lock className="w-3.5 h-3.5" />
          <span>Cofre Protegido</span>
        </div>
      </div>

      {/* Global Privacy Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Incognito & Masking */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <EyeOff className="w-4 h-4 text-indigo-400" />
            <span>Regras Globais de Proteção</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="font-semibold text-slate-200">Deteção de Janela Anónima / Incógnito</p>
                <p className="text-[11px] text-slate-400">Pausa automaticamente a monitorização em abas privadas</p>
              </div>
              <input
                type="checkbox"
                checked={incognitoAutoPause}
                onChange={(e) => setIncognitoAutoPause(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-1 border-t border-slate-800">
              <div>
                <p className="font-semibold text-slate-200">Mascaramento de Títulos de Janelas Sensíveis</p>
                <p className="text-[11px] text-slate-400">Oculta títulos contendo palavras como "Senha", "Bank", etc.</p>
              </div>
              <input
                type="checkbox"
                checked={titleMasking}
                onChange={(e) => setTitleMasking(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Master Password Vault Setup */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Key className="w-4 h-4 text-emerald-400" />
            <span>Cofre de Dados AES-256</span>
          </h3>

          <p className="text-xs text-slate-300">
            A tua base de dados SQLite local é encriptada com AES-256. A chave é controlada exclusivamente por ti.
          </p>

          <div className="space-y-2">
            <label className="text-[11px] font-mono text-slate-400">Palavra-passe Mestra do Cofre:</label>
            <div className="flex space-x-2">
              <input
                type="password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                className="flex-1 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none"
              />
              <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold">
                Atualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Exclusion Rules Table */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Zonas Privadas & Exclusões Personalizadas</h3>
            <p className="text-xs text-slate-400">Aplicações e domínios ignorados pelo motor de rastreamento</p>
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Adicionar domínio ou exe..."
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1 text-xs text-slate-200 focus:outline-none"
            />
            <button
              onClick={handleAddRule}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-800">
          {privacyRules.map((r) => (
            <div key={r.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-slate-200">{r.appOrDomain}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {r.ruleType === 'exclude' ? 'Ignorar Total' : 'Mascarar Título'}
                </span>
              </div>
              <button 
                onClick={() => setPrivacyRules(privacyRules.filter(p => p.id !== r.id))}
                className="text-slate-500 hover:text-rose-400 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone - Data Purge */}
      <div className="glass-panel p-5 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-3">
        <div className="flex items-center space-x-2 text-rose-400 font-semibold text-xs">
          <AlertTriangle className="w-4 h-4" />
          <span>Zona de Eliminação Definitiva (Nuclear Delete)</span>
        </div>
        <p className="text-xs text-slate-300">
          Elimina permanentemente todo o histórico local de atividade, relatórios, métricas e base de dados sem possibilidade de recuperação.
        </p>
        <button className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-rose-600/30">
          Eliminar Todos os Dados Permanentemente
        </button>
      </div>
    </div>
  );
};
