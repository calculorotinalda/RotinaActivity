import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';
import { Dashboard } from './components/Dashboard';
import { ForensicTimeline } from './components/ForensicTimeline';
import { AICoach } from './components/AICoach';
import { FocusMode } from './components/FocusMode';
import { PrivacyCenter } from './components/PrivacyCenter';
import { AutomationRules } from './components/AutomationRules';
import { SystemMonitor } from './components/SystemMonitor';
import { GoalsGamification } from './components/GoalsGamification';
import { HeatmapViewer } from './components/HeatmapViewer';
import { ReportsExporter } from './components/ReportsExporter';
import { SettingsCenter } from './components/SettingsCenter';
import { DiagnosticsCenter } from './components/DiagnosticsCenter';

import { ApiService } from './services/api';
import { Activity, ProductivityScore, Goal, AutomationRule, AIInsight, SystemMetrics } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // States
  const [activities, setActivities] = useState<Activity[]>([]);
  const [score, setScore] = useState<ProductivityScore>({ score: 0, focusScore: 0, consistencyScore: 0, contextSwitches: 0, interruptionCount: 0, workRestRatio: '0% / 0%' });
  const [goals, setGoals] = useState<Goal[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({ cpuPercent: 0, ramUsageMb: 0, ramTotalMb: 16384, gpuPercent: 0, diskPercent: 0, networkKbps: 0, batteryPercent: 100 });

  // Toggle Dark/Light class on html document root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchProductionData = () => {
      ApiService.getActivities().then(setActivities);
      ApiService.getScore().then(setScore);
      ApiService.getGoals().then(setGoals);
      ApiService.getAutomationRules().then(setAutomationRules);
      ApiService.getAIInsights().then(setAiInsights);
      ApiService.getSystemMetrics().then(setMetrics);
    };

    fetchProductionData();
    // Poll API every 3s to capture real-time production activities recorded by background C# agent
    const interval = setInterval(fetchProductionData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCommandPaletteSelect = (actionId: string) => {
    if (actionId === 'timeline') setActiveTab('timeline');
    else if (actionId === 'ai-coach') setActiveTab('ai-coach');
    else if (actionId === 'focus') setActiveTab('focus');
    else if (actionId === 'privacy') setActiveTab('privacy');
    else if (actionId === 'automation') setActiveTab('automation');
    else if (actionId === 'reports') setActiveTab('reports');
  };

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden transition-colors ${isDarkMode ? 'dark bg-[#0B0F17] text-gray-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Navbar Header */}
      <Navbar
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        cpuPercent={metrics.cpuPercent}
        ramUsageMb={metrics.ramUsageMb}
      />

      {/* Body container (Sidebar + Content View) */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        <main className={`flex-1 overflow-hidden transition-colors ${isDarkMode ? 'bg-[#0B0F17]' : 'bg-slate-100'}`}>
          {activeTab === 'dashboard' && <Dashboard score={score} activities={activities} />}
          {activeTab === 'timeline' && <ForensicTimeline activities={activities} />}
          {activeTab === 'ai-coach' && <AICoach insights={aiInsights} />}
          {activeTab === 'focus' && <FocusMode />}
          {activeTab === 'privacy' && <PrivacyCenter />}
          {activeTab === 'automation' && <AutomationRules rules={automationRules} />}
          {activeTab === 'hardware' && <SystemMonitor metrics={metrics} />}
          {activeTab === 'projects' && <Dashboard score={score} activities={activities} />}
          {activeTab === 'goals' && <GoalsGamification goals={goals} />}
          {activeTab === 'heatmaps' && <HeatmapViewer />}
          {activeTab === 'reports' && <ReportsExporter />}
          {activeTab === 'settings' && <SettingsCenter />}
          {activeTab === 'diagnostics' && <DiagnosticsCenter activities={activities} />}
        </main>
      </div>

      {/* Universal Command Palette Ctrl+K */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectAction={handleCommandPaletteSelect}
      />
    </div>
  );
};
