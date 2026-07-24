import React, { useState, useEffect } from 'react';
import { Target, Play, Pause, RotateCcw, Shield, BellOff, Zap, CheckCircle } from 'lucide-react';

export const FocusMode: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [focusModeType, setFocusModeType] = useState<'pomodoro' | 'deep_work' | 'sprint'>('deep_work');
  const [blockDistractions, setBlockDistractions] = useState(true);
  const [muteNotifications, setMuteNotifications] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    if (focusModeType === 'pomodoro') setSecondsLeft(25 * 60);
    else if (focusModeType === 'deep_work') setSecondsLeft(50 * 60);
    else setSecondsLeft(15 * 60);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/30 to-slate-900 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Modo Focus & Deep Work</h2>
            <p className="text-xs text-slate-400">Ambiente avançado de concentração sem distrações e controlo inteligente de notificações</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-emerald-400 font-medium font-mono">Modo Focus Pronto</span>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="glass-panel p-8 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col items-center justify-center space-y-6">
        {/* Preset Switcher */}
        <div className="flex items-center space-x-2 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => { setFocusModeType('pomodoro'); setSecondsLeft(25 * 60); setIsRunning(false); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              focusModeType === 'pomodoro' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pomodoro (25m)
          </button>
          <button
            onClick={() => { setFocusModeType('deep_work'); setSecondsLeft(50 * 60); setIsRunning(false); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              focusModeType === 'deep_work' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Deep Work (50m)
          </button>
          <button
            onClick={() => { setFocusModeType('sprint'); setSecondsLeft(15 * 60); setIsRunning(false); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              focusModeType === 'sprint' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sprint Curto (15m)
          </button>
        </div>

        {/* Big Clock Circle */}
        <div className="relative w-64 h-64 rounded-full border-8 border-slate-800 border-t-emerald-500 flex flex-col items-center justify-center shadow-2xl bg-slate-950/40">
          <span className="text-6xl font-mono font-extrabold text-white tracking-wider">
            {formatTime(secondsLeft)}
          </span>
          <span className="text-xs text-slate-400 font-mono mt-2 uppercase tracking-widest">
            {isRunning ? 'Em Concentração' : 'Pausado'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleReset}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all"
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isRunning ? 'Pausar Sessão' : 'Iniciar Deep Work'}</span>
          </button>
        </div>
      </div>

      {/* Focus Mode Protection Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-indigo-400" />
            <div>
              <h4 className="text-xs font-semibold text-white">Bloqueio Automático de Distrações</h4>
              <p className="text-[11px] text-slate-400">Bloqueia redes sociais e sites recreativos durante a sessão</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={blockDistractions}
            onChange={(e) => setBlockDistractions(e.target.checked)}
            className="w-4 h-4 accent-indigo-600 cursor-pointer"
          />
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BellOff className="w-5 h-5 text-amber-400" />
            <div>
              <h4 className="text-xs font-semibold text-white">Silenciar Notificações de Sistema</h4>
              <p className="text-[11px] text-slate-400">Evita alertas e popups durante a contagem</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={muteNotifications}
            onChange={(e) => setMuteNotifications(e.target.checked)}
            className="w-4 h-4 accent-indigo-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
