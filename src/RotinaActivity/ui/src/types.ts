export interface Activity {
  id: string;
  timestamp: string;
  appName: string;
  windowTitle: string;
  browserUrl?: string;
  category: string;
  durationSeconds: number;
  idleSeconds: number;
  isProductive: boolean;
  project?: string;
  client?: string;
  tags?: string[];
  cpuUsage?: number;
  ramUsage?: number;
}

export interface ProductivityScore {
  score: number;
  focusScore: number;
  consistencyScore: number;
  contextSwitches: number;
  interruptionCount: number;
  workRestRatio: string;
}

export interface Goal {
  id: string;
  title: string;
  targetMinutes: number;
  currentMinutes: number;
  type: 'daily' | 'weekly' | 'monthly';
  category: string;
  isCompleted: boolean;
}

export interface AutomationRule {
  id: string;
  name: string;
  conditionIf: string;
  actionThen: string;
  isActive: boolean;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  category: 'productivity' | 'distraction' | 'burnout' | 'prediction';
  confidenceScore: number;
  timestamp: string;
}

export interface PrivacyRule {
  id: string;
  appOrDomain: string;
  ruleType: 'exclude' | 'mask' | 'private_hours';
  pattern: string;
  isActive: boolean;
}

export interface SystemMetrics {
  cpuPercent: number;
  ramUsageMb: number;
  ramTotalMb: number;
  gpuPercent: number;
  diskPercent: number;
  networkKbps: number;
  batteryPercent: number;
}

export interface ProjectClient {
  id: string;
  name: string;
  client: string;
  hourlyRate: number;
  billableHours: number;
  nonBillableHours: number;
  budget: number;
}
