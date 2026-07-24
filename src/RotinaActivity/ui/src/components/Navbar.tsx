import React from 'react';
import { Search, Shield, Zap, Moon, Sun, Monitor, Cpu } from 'lucide-react';

interface NavbarProps {
  onOpenCommandPalette: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  cpuPercent: number;
  ramUsageMb: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCommandPalette,
  isDarkMode,
  onToggleTheme,
  cpuPercent,
  ramUsageMb
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-[#0F1522]/90 backdrop-blur-md px-4 flex items-center justify-between z-30 shrink-0">
      {/* Brand & Workspace */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm tracking-tight text-white">RotinaActivity</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
              ULTIMATE
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Workspace Pessoal</span>
        </div>
      </div>

      {/* Center Search Bar / Command Palette Trigger */}
      <button
        onClick={onOpenCommandPalette}
        className="w-96 h-9 px-3 rounded-lg bg-slate-900/80 border border-slate-700/60 hover:border-indigo-500/50 transition-all flex items-center justify-between text-slate-400 text-xs shadow-inner group"
      >
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
          <span className="text-slate-400 group-hover:text-slate-200">Pesquisar aplicações, sites, projetos, IA (Ctrl+K)...</span>
        </div>
        <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
          Ctrl K
        </kbd>
      </button>

      {/* Right Controls & Live Performance Meter */}
      <div className="flex items-center space-x-4">
        {/* Hardware Status Pills */}
        <div className="hidden lg:flex items-center space-x-3 text-xs bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800">
          <div className="flex items-center space-x-1.5 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono text-[11px]">{cpuPercent.toFixed(1)}% CPU</span>
          </div>
          <div className="w-px h-3 bg-slate-800"></div>
          <div className="flex items-center space-x-1.5 text-slate-300">
            <Monitor className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-[11px]">{ramUsageMb.toFixed(0)} MB RAM</span>
          </div>
        </div>

        {/* System Tray Agent Live Status Indicator */}
        <div className="flex items-center space-x-2 text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px]">Agente Ativo</span>
        </div>

        {/* Privacy Lock Badge */}
        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors" title="Monitorização Local 100% Privada">
          <Shield className="w-4 h-4 text-emerald-400" />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Alternar Tema"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>
      </div>
    </header>
  );
};
