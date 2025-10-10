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
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    green: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    purple: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
    orange: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
    red: 'text-red-600 bg-red-50 dark:bg-red-900/20',
  };

  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? <TrendUpIcon className="w-4 h-4" /> : <TrendDownIcon className="w-4 h-4" />}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">{title}</p>
        <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
      </div>
    </div>
  );
}
