import { Activity, ProductivityScore, Goal, AutomationRule, AIInsight, PrivacyRule, SystemMetrics, ProjectClient } from '../types';

const API_BASE = 'http://localhost:58201/api';

export class ApiService {
  public static async getActivities(): Promise<Activity[]> {
    try {
      const res = await fetch(`${API_BASE}/activities`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback local mock dataset for offline / static preview
    }

    return [
      { id: '1', timestamp: '10:14:00', appName: 'Visual Studio Code', windowTitle: 'RotinaActivity.cs - RotinaActivity', category: 'Desenvolvimento', durationSeconds: 3400, idleSeconds: 20, isProductive: true, project: 'RotinaActivity', client: 'Rotina Corp', tags: ['C#', '.NET'], cpuUsage: 3.2, ramUsage: 88 },
      { id: '2', timestamp: '11:15:00', appName: 'Google Chrome', windowTitle: 'GitHub - Pull Requests · RotinaActivity', browserUrl: 'https://github.com', category: 'Desenvolvimento', durationSeconds: 1800, idleSeconds: 10, isProductive: true, project: 'RotinaActivity', client: 'Rotina Corp', tags: ['Git'], cpuUsage: 4.1, ramUsage: 142 },
      { id: '3', timestamp: '12:00:00', appName: 'Slack', windowTitle: '#general - Rotina Workspace', category: 'Comunicação', durationSeconds: 900, idleSeconds: 5, isProductive: true, project: 'RotinaActivity', client: 'Rotina Corp', tags: ['Chat'], cpuUsage: 1.5, ramUsage: 75 },
      { id: '4', timestamp: '13:10:00', appName: 'YouTube', windowTitle: 'Lofi Hip Hop Radio - Beats to Study To', browserUrl: 'https://youtube.com', category: 'Entretenimento', durationSeconds: 2400, idleSeconds: 120, isProductive: false, tags: ['Music'], cpuUsage: 5.0, ramUsage: 210 },
      { id: '5', timestamp: '14:30:00', appName: 'Figma', windowTitle: 'RotinaActivity Design System - Modern Dark UI', category: 'Design', durationSeconds: 2900, idleSeconds: 40, isProductive: true, project: 'RotinaActivity', client: 'Rotina Corp', tags: ['UI/UX'], cpuUsage: 6.2, ramUsage: 190 },
      { id: '6', timestamp: '16:00:00', appName: 'Obsidian', windowTitle: 'RotinaActivity Architectural Specification.md', category: 'Documentação', durationSeconds: 1500, idleSeconds: 15, isProductive: true, project: 'RotinaActivity', tags: ['Notes'], cpuUsage: 0.9, ramUsage: 45 }
    ];
  }

  public static async getScore(): Promise<ProductivityScore> {
    return {
      score: 88,
      focusScore: 92,
      consistencyScore: 85,
      contextSwitches: 14,
      interruptionCount: 3,
      workRestRatio: '82% / 18%'
    };
  }

  public static async getSystemMetrics(): Promise<SystemMetrics> {
    return {
      cpuPercent: 1.8,
      ramUsageMb: 86.4,
      ramTotalMb: 16384,
      gpuPercent: 4.2,
      diskPercent: 28.5,
      networkKbps: 124.5,
      batteryPercent: 98
    };
  }

  public static async getGoals(): Promise<Goal[]> {
    return [
      { id: 'g1', title: 'Foco em Desenvolvimento', targetMinutes: 300, currentMinutes: 245, type: 'daily', category: 'Desenvolvimento', isCompleted: false },
      { id: 'g2', title: 'Limitar Redes Sociais', targetMinutes: 45, currentMinutes: 22, type: 'daily', category: 'Entretenimento', isCompleted: false },
      { id: 'g3', title: 'Sessões de Deep Work', targetMinutes: 120, currentMinutes: 120, type: 'daily', category: 'Trabalho', isCompleted: true },
      { id: 'g4', title: 'Meta Semanal de Código', targetMinutes: 1800, currentMinutes: 1450, type: 'weekly', category: 'Desenvolvimento', isCompleted: false }
    ];
  }

  public static async getAutomationRules(): Promise<AutomationRule[]> {
    return [
      { id: 'r1', name: 'Ativar Modo Foco no VS Code', conditionIf: 'App == "Visual Studio Code"', actionThen: 'Ativar Modo Focus & Bloquear Notificações', isActive: true },
      { id: 'r2', name: 'Atribuir Projeto RotinaActivity no GitHub', conditionIf: 'URL contem "github.com/rotina"', actionThen: 'Atribuir Projeto "RotinaActivity"', isActive: true },
      { id: 'r3', name: 'Alerta de Pausa após 90 min de Foco', conditionIf: 'TempoContinuo > 90m', actionThen: 'Notificar Recomendação de Pausa', isActive: true }
    ];
  }

  public static async getAIInsights(): Promise<AIInsight[]> {
    return [
      { id: 'ai1', title: 'Pico de Alta Produtividade Detectado', description: 'A tua eficiência aumenta 37% entre as 09:00 e as 11:30. Recomendamos agendar tarefas complexas neste intervalo.', category: 'productivity', confidenceScore: 96, timestamp: 'Hoje às 11:30' },
      { id: 'ai2', title: 'Padrão de Queda de Desempenho', description: 'Após 90 minutos consecutivos de trabalho contínuo, a tua velocidade de resposta cai 18%. Fazer pausas curtas previne a fadiga mental.', category: 'burnout', confidenceScore: 91, timestamp: 'Hoje às 14:15' },
      { id: 'ai3', title: 'Previsão Semanal de Foco', description: 'Com base no histórico dos últimos 30 dias, as Terças-feiras são o teu dia mais produtivo (média de 6h45m focadas).', category: 'prediction', confidenceScore: 89, timestamp: 'Ontem' }
    ];
  }

  public static async getProjects(): Promise<ProjectClient[]> {
    return [
      { id: 'p1', name: 'RotinaActivity Ultimate', client: 'Rotina Corp', hourlyRate: 85, billableHours: 42.5, nonBillableHours: 6.0, budget: 5000 },
      { id: 'p2', name: 'Enterprise Analytics Engine', client: 'Acme Systems', hourlyRate: 110, billableHours: 28.0, nonBillableHours: 2.5, budget: 8500 },
      { id: 'p3', name: 'Design System Arc 2.0', client: 'Internal Studio', hourlyRate: 70, billableHours: 15.0, nonBillableHours: 1.0, budget: 3000 }
    ];
  }
}
