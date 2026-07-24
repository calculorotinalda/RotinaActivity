import React from 'react';
import { 
  LayoutDashboard, 
  History, 
  Bot, 
  Target, 
  ShieldAlert, 
  Zap, 
  Activity, 
  FolderKanban, 
  Trophy, 
  Grid, 
  FileText, 
  Settings, 
  Stethoscope 
} from 'lucide-react';

export type TabType = 
  | 'dashboard'
  | 'timeline'
  | 'ai-coach'
  | 'focus'
  | 'privacy'
  | 'automation'
  | 'hardware'
  | 'projects'
  | 'goals'
  | 'heatmaps'
  | 'reports'
  | 'settings'
  | 'diagnostics';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const menuItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard 360°', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'timeline', label: 'Timeline Forense', icon: <History className="w-4 h-4" /> },
    { id: 'ai-coach', label: 'AI Coach Local', icon: <Bot className="w-4 h-4" />, badge: 'Ollama' },
    { id: 'focus', label: 'Modo Focus', icon: <Target className="w-4 h-4" /> },
    { id: 'privacy', label: 'Centro Privacidade', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'automation', label: 'Regras IF/THEN', icon: <Zap className="w-4 h-4" /> },
    { id: 'hardware', label: 'Monitor Sistema', icon: <Activity className="w-4 h-4" /> },
    { id: 'projects', label: 'Projetos & Clientes', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'goals', label: 'Objetivos & Conquistas', icon: <Trophy className="w-4 h-4" /> },
    { id: 'heatmaps', label: 'Heatmaps Produtividade', icon: <Grid className="w-4 h-4" /> },
    { id: 'reports', label: 'Relatórios & Export', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'Configurações', icon: <Settings className="w-4 h-4" /> },
    { id: 'diagnostics', label: 'Diagnósticos', icon: <Stethoscope className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-[#0D121F] border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      <div className="py-3 px-2 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-slate-500">
          Navegação Principal
        </div>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Profile & Status */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs text-white">
              RA
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Rotina User</p>
              <p className="text-[10px] text-slate-500">Offline-First Engine</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400" title="Motor Local Funcional"></span>
        </div>
      </div>
    </aside>
  );
};
