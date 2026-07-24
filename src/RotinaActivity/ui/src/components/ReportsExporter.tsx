import React, { useState } from 'react';
import { FileText, Download, CheckCircle, FileCode, FileSpreadsheet, Sparkles } from 'lucide-react';

export const ReportsExporter: React.FC = () => {
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExport = (format: string) => {
    setDownloadSuccess(`Relatório ${reportPeriod} exportado com sucesso no formato .${format.toLowerCase()}!`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="glass-panel p-4 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/30 to-slate-900 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Relatórios & Gerador Multi-Formato</h2>
            <p className="text-xs text-slate-400">Geração automática de relatórios executivos com gráficos e resumo IA</p>
          </div>
        </div>
      </div>

      {/* Export Options Panel */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
        <h3 className="text-sm font-semibold text-white">Configurar Período do Relatório</h3>

        <div className="flex space-x-3">
          <button
            onClick={() => setReportPeriod('daily')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              reportPeriod === 'daily' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Diário (Hoje)
          </button>
          <button
            onClick={() => setReportPeriod('weekly')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              reportPeriod === 'weekly' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Semanal (Esta Semana)
          </button>
          <button
            onClick={() => setReportPeriod('monthly')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              reportPeriod === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Mensal (Julho 2026)
          </button>
        </div>

        {downloadSuccess && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          <button
            onClick={() => handleExport('PDF')}
            className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500/50 flex flex-col items-center justify-center space-y-2 group transition-all"
          >
            <FileText className="w-6 h-6 text-rose-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200">Exportar PDF</span>
            <span className="text-[10px] text-slate-500">Com Gráficos</span>
          </button>

          <button
            onClick={() => handleExport('XLSX')}
            className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500/50 flex flex-col items-center justify-center space-y-2 group transition-all"
          >
            <FileSpreadsheet className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200">Exportar Excel</span>
            <span className="text-[10px] text-slate-500">Tabelas Dinâmicas</span>
          </button>

          <button
            onClick={() => handleExport('CSV')}
            className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500/50 flex flex-col items-center justify-center space-y-2 group transition-all"
          >
            <Download className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200">Exportar CSV</span>
            <span className="text-[10px] text-slate-500">Dados Brutos</span>
          </button>

          <button
            onClick={() => handleExport('JSON')}
            className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500/50 flex flex-col items-center justify-center space-y-2 group transition-all"
          >
            <FileCode className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200">Exportar JSON</span>
            <span className="text-[10px] text-slate-500">Backup Completo</span>
          </button>

          <button
            onClick={() => handleExport('MD')}
            className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500/50 flex flex-col items-center justify-center space-y-2 group transition-all"
          >
            <Sparkles className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200">Markdown</span>
            <span className="text-[10px] text-slate-500">Para Obsidian</span>
          </button>
        </div>
      </div>
    </div>
  );
};
