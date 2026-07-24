import React, { useState } from 'react';
import { Activity } from '../types';
import { Play, Pause, SkipBack, SkipForward, Search, Calendar, Filter, Clock, AppWindow } from 'lucide-react';

interface ForensicTimelineProps {
  activities: Activity[];
}

export const ForensicTimeline: React.FC<ForensicTimelineProps> = ({ activities }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrubberValue, setScrubberValue] = useState(65); // 0 - 100%
  const [searchFilter, setSearchFilter] = useState('');

  const filteredActivities = activities.filter(a =>
    a.appName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    a.windowTitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
    a.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/60">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span>Timeline Forense & Replay de Atividade</span>
          </h2>
          <p className="text-xs text-slate-400">Navegação minuto a minuto e reconstrução visual da sequência de trabalho</p>
        </div>

        {/* Date Selector & Search */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-200 font-mono">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>2026-07-24 (Hoje)</span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filtrar sessão..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Interactive Replay Scrubber */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">Controlo de Replay Temporal</span>
          <span className="text-xs font-mono text-indigo-400">Hora Atual no Replay: 14:35:12</span>
        </div>

        {/* Scrubber Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            value={scrubberValue}
            onChange={(e) => setScrubberValue(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>08:00 (Início)</span>
            <span>12:00</span>
            <span>16:00</span>
            <span>20:00 (Fim)</span>
          </div>
        </div>

        {/* Playback Buttons */}
        <div className="flex items-center justify-center space-x-3 pt-2">
          <button 
            onClick={() => setScrubberValue(Math.max(0, scrubberValue - 10))}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button 
            onClick={() => setScrubberValue(Math.min(100, scrubberValue + 10))}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sequential Activity Stream */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
        <h3 className="text-sm font-semibold text-white">Sequência de Utilização e Mudanças de Contexto</h3>

        <div className="relative border-l-2 border-slate-800 ml-4 space-y-6 py-2">
          {filteredActivities.map((act, index) => (
            <div key={act.id} className="relative pl-6 group">
              {/* Context Marker Node */}
              <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-slate-900 ${act.isProductive ? 'bg-indigo-500' : 'bg-rose-500'}`}></div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 group-hover:border-indigo-500/40 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center space-x-2">
                    <AppWindow className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-semibold text-slate-200">{act.appName}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {act.category}
                    </span>
                  </div>
                  <span className="font-mono text-slate-400 text-[11px]">{act.timestamp}</span>
                </div>

                <p className="text-xs text-slate-300 font-mono mb-2">{act.windowTitle}</p>

                {act.browserUrl && (
                  <p className="text-[11px] text-indigo-400 font-mono truncate mb-2">
                    URL: {act.browserUrl}
                  </p>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60 font-mono">
                  <span>Duração: {Math.floor(act.durationSeconds / 60)} min {act.durationSeconds % 60}s</span>
                  <span>Inatividade: {act.idleSeconds}s</span>
                  {act.cpuUsage && <span>CPU: {act.cpuUsage}%</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
