import React from 'react';
import { TrendUpIcon, TrendDownIcon } from './Icons';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export default function StatCard({ title, value, icon, trend, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'text-primary bg-primary-100 dark:bg-primary-900/30',
    green: 'text-success bg-success-100 dark:bg-success-900/30',
    purple: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
    orange: 'text-warning bg-warning-100 dark:bg-warning-900/30',
    red: 'text-danger bg-danger-100 dark:bg-danger-900/30',
  };

  return (
    <div className="card-hover p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]} transition-transform hover:scale-105`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1.5 text-sm font-medium px-2.5 py-1 rounded-lg ${
            trend.isPositive
              ? 'text-success bg-success-50 dark:bg-success-900/20'
              : 'text-danger bg-danger-50 dark:bg-danger-900/20'
          }`}>
            {trend.isPositive ? <TrendUpIcon className="w-4 h-4" /> : <TrendDownIcon className="w-4 h-4" />}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-text-secondary mb-2">{title}</p>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
      </div>
    </div>
  );
}
