import React from 'react';
import { Goal } from '../types';
import { Trophy, Target, Award, Flame, CheckCircle, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GoalsGamificationProps {
  goals: Goal[];
}

export const GoalsGamification: React.FC<GoalsGamificationProps> = ({ goals }) => {
  const handleTriggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const badges = [
    { title: 'Master of Deep Work', desc: '5 horas seguidas de código sem interrupção', icon: '⚡', unlocked: true },
    { title: 'Foco de Aço', desc: 'Menos de 3 mudanças de contexto por hora', icon: '🛡️', unlocked: true },
    { title: 'Semana Lendária', desc: 'Cumpriu todas as metas diárias 5 dias seguidos', icon: '🔥', unlocked: true },
    { title: 'Zen Master', desc: 'Realizou todas as pausas de descanso recomendadas', icon: '🧘', unlocked: false }
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
      {/* Header & Level Progress */}
      <div className="glass-panel p-5 rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-950/30 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">Objetivos, Níveis & Gamificação</h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Nível 14 • Mestre do Foco
              </span>
            </div>
            <p className="text-xs text-slate-400">Streak Atual: 7 dias consecutivos de metas atingidas 🔥</p>
          </div>
        </div>

        <button
          onClick={handleTriggerConfetti}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-lg shadow-amber-500/20"
        >
          Celebrar Conquistas 🎉
        </button>
      </div>

      {/* Goals Progress Grid */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Metas Ativas</h3>
          <button className="text-xs text-indigo-400 hover:underline flex items-center space-x-1 font-medium">
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Meta</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((g) => {
            const percent = Math.min(100, Math.floor((g.currentMinutes / g.targetMinutes) * 100));
            return (
              <div key={g.id} className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{g.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                    {g.type}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{g.currentMinutes} min / {g.targetMinutes} min</span>
                  <span className={g.isCompleted ? 'text-emerald-400 font-bold' : 'text-amber-400'}>{percent}%</span>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${g.isCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${percent}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unlockable Badges Grid */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
        <h3 className="text-sm font-semibold text-white">Medalhas & Conquistas Desbloqueadas</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b, i) => (
            <div key={i} className={`p-4 rounded-xl border flex items-start space-x-3 ${b.unlocked ? 'border-amber-500/30 bg-amber-950/10' : 'border-slate-800 bg-slate-950/40 opacity-50'}`}>
              <div className="text-2xl">{b.icon}</div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">{b.title}</h4>
                <p className="text-[11px] text-slate-400">{b.desc}</p>
                <span className="text-[9px] font-mono mt-1 inline-block text-amber-400 font-medium">
                  {b.unlocked ? 'Desbloqueado' : 'Bloqueado'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
