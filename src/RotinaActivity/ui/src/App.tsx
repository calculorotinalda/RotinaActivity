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
  const [score, setScore] = useState<ProductivityScore>({ score: 88, focusScore: 92, consistencyScore: 85, contextSwitches: 14, interruptionCount: 3, workRestRatio: '82% / 18%' });
  const [goals, setGoals] = useState<Goal[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({ cpuPercent: 1.8, ramUsageMb: 86.4, ramTotalMb: 16384, gpuPercent: 4.2, diskPercent: 28.5, networkKbps: 124.5, batteryPercent: 98 });

  useEffect(() => {
    // Load initial data
    ApiService.getActivities().then(setActivities);
    ApiService.getScore().then(setScore);
    ApiService.getGoals().then(setGoals);
    ApiService.getAutomationRules().then(setAutomationRules);
    ApiService.getAIInsights().then(setAiInsights);
    ApiService.getSystemMetrics().then(setMetrics);
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
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
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

        <main className="flex-1 bg-[#0B0F17] overflow-hidden">
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
          {activeTab === 'diagnostics' && <DiagnosticsCenter />}
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
