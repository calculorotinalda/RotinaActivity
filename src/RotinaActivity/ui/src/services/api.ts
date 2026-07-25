import { Activity, ProductivityScore, Goal, AutomationRule, AIInsight, SystemMetrics, ProjectClient } from '../types';

// Use relative API base or explicit window origin to eliminate cross-origin CORS issues in WebView2
const getApiBase = () => {
  if (typeof window !== 'undefined' && window.location && window.location.origin && !window.location.origin.includes('app.rotina')) {
    return `${window.location.origin}/api`;
  }
  return 'http://localhost:58201/api';
};

const API_BASE = getApiBase();

export class ApiService {
  public static async getActivities(): Promise<Activity[]> {
    try {
      const res = await fetch(`${API_BASE}/activities`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      } else {
        console.error('getActivities status:', res.status);
      }
    } catch (err) {
      console.error('getActivities error:', err);
    }
    return [];
  }

  public static async getScore(): Promise<ProductivityScore> {
    try {
      const res = await fetch(`${API_BASE}/score`);
      if (res.ok) {
        const data = await res.json();
        if (typeof data?.score === 'number') return data;
      }
    } catch (err) {
      console.error('getScore error:', err);
    }

    return {
      score: 0,
      focusScore: 0,
      consistencyScore: 0,
      contextSwitches: 0,
      interruptionCount: 0,
      workRestRatio: '0% / 0%'
    };
  }

  public static async getSystemMetrics(): Promise<SystemMetrics> {
    try {
      const res = await fetch(`${API_BASE}/metrics`);
      if (res.ok) {
        const data = await res.json();
        if (typeof data?.cpuPercent === 'number' && typeof data?.ramUsageMb === 'number') {
          return data;
        }
      }
    } catch (err) {
      console.error('getSystemMetrics error:', err);
    }

    return {
      cpuPercent: 1.5,
      ramUsageMb: 86.4,
      ramTotalMb: 16384,
      gpuPercent: 3.2,
      diskPercent: 24.5,
      networkKbps: 80.0,
      batteryPercent: 100
    };
  }

  public static async getGoals(): Promise<Goal[]> {
    try {
      const res = await fetch(`${API_BASE}/goals`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (err) {
      console.error('getGoals error:', err);
    }

    return [];
  }

  public static async createGoal(goal: Goal): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal)
      });
      return res.ok;
    } catch (err) {
      console.error('createGoal error:', err);
      return false;
    }
  }

  public static async getAutomationRules(): Promise<AutomationRule[]> {
    try {
      const res = await fetch(`${API_BASE}/rules`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      } else {
        console.error('getAutomationRules status:', res.status);
      }
    } catch (err) {
      console.error('getAutomationRules error:', err);
    }

    return [];
  }

  public static async saveRule(rule: AutomationRule): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule)
      });
      return res.ok;
    } catch (err) {
      console.error('saveRule error:', err);
      return false;
    }
  }

  public static async toggleRule(id: string, isActive: boolean): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/rules/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive })
      });
      return res.ok;
    } catch (err) {
      console.error('toggleRule error:', err);
      return false;
    }
  }

  public static async deleteRule(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/rules?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (err) {
      console.error('deleteRule error:', err);
      return false;
    }
  }

  public static async getAIInsights(): Promise<AIInsight[]> {
    try {
      const res = await fetch(`${API_BASE}/insights`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (err) {
      console.error('getAIInsights error:', err);
    }

    return [];
  }

  public static async getProjects(): Promise<ProjectClient[]> {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (err) {
      console.error('getProjects error:', err);
    }

    return [];
  }

  public static async clearDatabase(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/clear-db`, { method: 'POST' });
      return res.ok;
    } catch (err) {
      console.error('clearDatabase error:', err);
      return false;
    }
  }
}
