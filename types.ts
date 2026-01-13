
export enum PillarType {
  INTELLIGENCE = 'INTELLIGENCE',
  SPACES = 'SPACES',
  APEX = 'APEX'
}

export interface AIEngineConfig {
  brandName: string;
  modelName: string;
  provider: string;
  latency: string;
  status: 'OPTIMAL' | 'DEGRADED' | 'WAKING';
}

export interface AttritionRisk {
  department: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  fatigueIndex: number;
  lastUpdate: string;
}

export interface EnergyMetrics {
  gridUsage: number;
  solarUsage: number;
  batteryLevel: number;
  savingsPerHour: number;
  co2Level: number;
  vocLevel: number;
  lux: number;
}

export interface ApexMetrics {
  userId: string;
  hrv: number;
  sleepScore: number;
  readinessScore: number;
  businessOutput: number;
  status: 'Peak' | 'Optimizing' | 'Recovery';
}

export interface DashboardState {
  activePillar: PillarType;
}
