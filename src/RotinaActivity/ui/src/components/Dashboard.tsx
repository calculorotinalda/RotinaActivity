import React from 'react';
import { ProductivityScore, Activity } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, Clock, Zap, AlertTriangle, ArrowUpRight, 
  CheckCircle2, Layers 
} from 'lucide-react';

interface DashboardProps {
  score: ProductivityScore;
  activities: Activity[];
}

export const Dashboard: React.FC<DashboardProps> = ({ score, activities }) => {
  // Dynamically compute categories from actual database activities
  const categoryMap: { [cat: string]: number } = {};
  activities.forEach(a => {
    categoryMap[a.category] = (categoryMap[a.category] || 0) + 1;
  });
  const totalCat = activities.length || 1;
  const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const categoryDistribution = Object.keys(categoryMap).length > 0
    ? Object.keys(categoryMap).map((cat, idx) => ({
        name: cat,
        value: Math.round((categoryMap[cat] / totalCat) * 100),
        color: colors[idx % colors.length]
      }))
    : [
        { name: 'Sem registos', value: 100, color: '#94a3b8' }
      ];

  // Dynamic hourly breakdown aggregating all recorded activity timestamps
  const hourlyDataMap: { [hour: string]: { prod: number; unprod: number } } = {};
  const baseHours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
  baseHours.forEach(h => {
    hourlyDataMap[h] = { prod: 0, unprod: 0 };
  });

  activities.forEach(a => {
    if (a.timestamp && a.timestamp.length >= 2) {
      const hourSlot = a.timestamp.substring(0, 2) + ':00';
      if (!hourlyDataMap[hourSlot]) {
        hourlyDataMap[hourSlot] = { prod: 0, unprod: 0 };
      }
      const durationMins = Math.max(1, Math.floor(a.durationSeconds / 60));
      if (a.isProductive) {
        hourlyDataMap[hourSlot].prod += durationMins;
      } else {
        hourlyDataMap[hourSlot].unprod += durationMins;
      }
    }
  });

  const hourlyData = Object.keys(hourlyDataMap)
    .sort()
    .map(h => ({
      hour: h,
      prod: hourlyDataMap[h].prod,
      unprod: hourlyDataMap[h].unprod
    }));

  const totalProductiveMinutes = activities
    .filter(a => a.isProductive)
    .reduce((acc, curr) => acc + Math.floor(curr.durationSeconds / 60), 0);
  const hoursFocadas = Math.floor(totalProductiveMinutes / 60);
  const minsFocadas = totalProductiveMinutes % 60;

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
      {/* Top Banner KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Productivity Score 360 Card */}
        <div className="glass-panel p-4 rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 dark:from-indigo-950/40 text-white flex items-center justify-between shadow-lg">
          <div>
            <div className="flex items-center space-x-1.5 text-xs text-indigo-300 font-semibold mb-1">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>Productivity Score 360°</span>
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight flex items-baseline space-x-1">
              <span>{score.score}</span>
              <span className="text-xs text-slate-400 font-normal">/ 100</span>
            </div>
            <p className="text-[11px] text-emerald-400 font-medium flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              Base de Dados Produção Limpa
            </p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 flex items-center justify-center font-bold text-indigo-300 text-sm bg-indigo-900/20">
            {score.score}%
          </div>
        </div>

        {/* Foco & Consistência */}
        <div className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="flex items-center space-x-1.5 font-medium">
              <Clock className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span>Horas Focadas</span>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">Produção</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{hoursFocadas}h {minsFocadas}m</div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (totalProductiveMinutes / 300) * 100)}%` }}></div>
          </div>
        </div>

        {/* Mudanças de Contexto */}
        <div className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="flex items-center space-x-1.5 font-medium">
              <Layers className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Mudanças de Contexto</span>
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">Real-time</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{score.contextSwitches} / hora</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Monitorização em tempo real</p>
        </div>

        {/* Equilíbrio Trabalho/Descanso */}
        <div className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="flex items-center space-x-1.5 font-medium">
              <TrendingUp className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              <span>Trabalho / Pausas</span>
            </span>
            <span className="text-purple-600 dark:text-purple-400 font-mono text-[11px]">Ativo</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{score.workRestRatio}</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Calculado sobre a tua utilização</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Productivity Timeline Bar Chart */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Distribuição Diária de Foco</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Minutos produtivos vs. não produtivos por hora</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500"></span>
                <span className="text-slate-600 dark:text-slate-300">Produtivo</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
                <span className="text-slate-600 dark:text-slate-300">Distração</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#fff' }} 
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="prod" fill="#6366f1" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="unprod" fill="#f43f5e" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Distribution */}
        <div className="glass-panel p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4 flex flex-col justify-between shadow-sm dark:shadow-none">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Distribuição por Categoria</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Categorias na base de dados</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={categoryDistribution} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={55} 
                  outerRadius={75} 
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5">
            {categoryDistribution.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{cat.name}</span>
                </div>
                <span className="text-slate-500 dark:text-slate-400 font-mono">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Applications & Realtime Activity List */}
      <div className="glass-panel p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Atividade Recente Monitorizada</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Eventos registados na base de dados SQLite em tempo real</p>
          </div>
          <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-200 dark:border-indigo-500/20">
            {activities.length} eventos registados
          </span>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800/80">
          {activities.length === 0 ? (
            <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
              Base de dados pronta. O agente está a registar as tuas janelas ativas em segundo plano...
            </div>
          ) : (
            activities.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 px-2 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${act.isProductive ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                    {act.isProductive ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-200">{act.appName}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {act.category}
                      </span>
                      {act.project && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20">
                          {act.project}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">{act.windowTitle}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {Math.floor(act.durationSeconds / 60)} min {act.durationSeconds % 60}s
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{act.timestamp}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
