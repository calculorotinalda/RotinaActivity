import React, { useState } from 'react';
import { Grid, Calendar, Clock, Filter } from 'lucide-react';

export const HeatmapViewer: React.FC = () => {
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const hours = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  // Generate matrix intensities (0 to 4)
  const getIntensityColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-slate-900 border-slate-800';
      case 1: return 'bg-indigo-950/80 border-indigo-900/50 text-indigo-400';
      case 2: return 'bg-indigo-800/80 border-indigo-700/60 text-indigo-200';
      case 3: return 'bg-indigo-600 border-indigo-500 text-white';
      case 4: return 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold';
      default: return 'bg-slate-900 border-slate-800';
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="glass-panel p-4 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/30 to-slate-900 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Grid className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Heatmaps de Produtividade (Semanal & Anual)</h2>
            <p className="text-xs text-slate-400">Visualização de densidade de foco por hora do dia e calendário anual estilo GitHub</p>
          </div>
        </div>
      </div>

      {/* Weekly Hour/Day Grid */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
        <h3 className="text-sm font-semibold text-white">Heatmap Semanal (Horas x Dias)</h3>

        <div className="overflow-x-auto">
          <div className="min-w-[600px] space-y-2">
            {days.map((day, dayIdx) => (
              <div key={day} className="flex items-center space-x-2">
                <span className="w-20 text-xs font-semibold text-slate-400">{day}</span>
                <div className="grid grid-cols-7 gap-2 flex-1">
                  {hours.map((hr, hrIdx) => {
                    const level = (dayIdx + hrIdx * 2) % 5;
                    const cellKey = `${day}-${hr}`;
                    return (
                      <button
                        key={hr}
                        onClick={() => setSelectedCell(cellKey)}
                        className={`h-10 rounded-lg border text-xs font-mono flex items-center justify-center transition-all hover:scale-105 ${getIntensityColor(level)}`}
                      >
                        {hr}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedCell && (
          <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
            Selecionado: <span className="font-mono font-bold">{selectedCell}</span> — 1h45m de código produtivo registado.
          </div>
        )}
      </div>

      {/* Annual GitHub-Style Contribution Heatmap */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Mapa de Atividade Anual (2026)</h3>
          <span className="text-xs font-mono text-slate-400">1,420 horas registadas em 2026</span>
        </div>

        <div className="flex flex-wrap gap-1 p-2 bg-slate-950/60 rounded-xl border border-slate-800">
          {Array.from({ length: 156 }).map((_, i) => {
            const level = (i * 7) % 5;
            return (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-sm ${getIntensityColor(level)}`}
                title={`Dia ${i + 1}: ${level * 2}h focadas`}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
