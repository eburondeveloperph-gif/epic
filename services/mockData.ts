
import { AttritionRisk, EnergyMetrics, ApexMetrics } from '../types';
import { MOCK_DEPARTMENTS } from '../constants';

export const generateAttritionData = (): AttritionRisk[] => {
  return MOCK_DEPARTMENTS.map(dept => ({
    department: dept,
    score: Math.random(),
    trend: Math.random() > 0.5 ? 'up' : 'down',
    fatigueIndex: Math.floor(Math.random() * 100),
    lastUpdate: new Date().toLocaleTimeString(),
  }));
};

export const generateEnergyData = (): EnergyMetrics => {
  const solar = Math.random() * 50;
  const grid = Math.random() * 30;
  return {
    gridUsage: grid,
    solarUsage: solar,
    batteryLevel: Math.floor(Math.random() * 100),
    savingsPerHour: solar * 0.15,
    co2Level: 400 + Math.random() * 600,
    vocLevel: 0.1 + Math.random() * 0.5,
    lux: 300 + Math.random() * 400,
  };
};

export const generateApexData = (): ApexMetrics[] => {
  return [
    { userId: 'EX001', hrv: 65, sleepScore: 88, readinessScore: 92, businessOutput: 95, status: 'Peak' },
    { userId: 'EX002', hrv: 45, sleepScore: 72, readinessScore: 68, businessOutput: 82, status: 'Optimizing' },
    { userId: 'EX003', hrv: 30, sleepScore: 55, readinessScore: 45, businessOutput: 60, status: 'Recovery' },
  ];
};
