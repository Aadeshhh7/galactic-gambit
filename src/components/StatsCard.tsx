import { TrendingUp, Users, Trophy, Calendar } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: 'trophy' | 'users' | 'calendar' | 'trending';
}

const iconMap = {
  trophy: Trophy,
  users: Users,
  calendar: Calendar,
  trending: TrendingUp,
};

export default function StatsCard({ title, value, change, icon }: StatsCardProps) {
  const Icon = iconMap[icon];

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <p className="text-sm text-green-400 mt-2">{change}</p>
          )}
        </div>
        <div className="w-12 h-12 bg-chess-accent rounded-lg flex items-center justify-center">
          <Icon className="text-chess-gold" size={24} />
        </div>
      </div>
    </div>
  );
}