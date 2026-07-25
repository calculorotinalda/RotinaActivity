import React from 'react';
import { SystemMetrics } from '../types';
import { Cpu, HardDrive, Wifi, Battery, Monitor, Activity } from 'lucide-react';

interface SystemMonitorProps {
  metrics?: SystemMetrics;
}

export const SystemMonitor: React.FC<SystemMonitorProps> = ({ metrics }) => {
  const cpuPercent = typeof metrics?.cpuPercent === 'number' ? metrics.cpuPercent : 0;
  const ramUsageMb = typeof metrics?.ramUsageMb === 'number' ? metrics.ramUsageMb : 0;
  const batteryPercent = typeof metrics?.batteryPercent === 'number' ? metrics.batteryPercent : 100;
  const networkKbps = typeof metrics?.networkKbps === 'number' ? metrics.networkKbps : 0;

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="glass-panel p-4 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/30 to-slate-900 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Monitor Avançado de Hardware & Sistema</h2>
            <p className="text-xs text-slate-400">Correlação entre o desempenho do hardware e a produtividade de trabalho</p>
          </div>
        </div>

        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
          Impacto no Sistema &lt; 2% CPU
        </span>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CPU */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center space-x-1.5 font-medium">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Utilização de CPU</span>
            </span>
            <span className="font-mono text-indigo-400">{cpuPercent}%</span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{cpuPercent.toFixed(1)}%</div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min(100, cpuPercent * 10)}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400">Excelente eficiência do agente background</p>
        </div>

        {/* RAM */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center space-x-1.5 font-medium">
              <Monitor className="w-4 h-4 text-emerald-400" />
              <span>Consumo de RAM</span>
            </span>
            <span className="font-mono text-emerald-400">&lt; 100 MB Target</span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{ramUsageMb.toFixed(1)} MB</div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '42%' }}></div>
          </div>
          <p className="text-[11px] text-slate-400">Total disponível: 16.0 GB</p>
        </div>

        {/* Bateria / Consumo Energético */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center space-x-1.5 font-medium">
              <Battery className="w-4 h-4 text-amber-400" />
              <span>Bateria & Energia</span>
            </span>
            <span className="font-mono text-amber-400">{batteryPercent}%</span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{batteryPercent}%</div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${batteryPercent}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400">Modo de Alta Eficiência Ativo</p>
        </div>
      </div>

      {/* Network & Storage Detailed Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-white">
            <Wifi className="w-4 h-4 text-purple-400" />
            <span>Tráfego Local & Sincronização</span>
          </div>
          <p className="text-xs text-slate-300">Largura de banda de telemetria local: <span className="font-mono text-indigo-400">{networkKbps} KB/s</span></p>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-white">
            <HardDrive className="w-4 h-4 text-indigo-400" />
            <span>Armazenamento SQLite WAL</span>
          </div>
          <p className="text-xs text-slate-300">Tamanho atual da base de dados: <span className="font-mono text-emerald-400">12.4 MB</span></p>
        </div>
      </div>
    </div>
  );
};
