import type { UserStats } from '../types';
import { TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react';

interface StatsCardsProps {
  stats: UserStats | null;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  if (!stats) {
    return (
      <div className="text-center text-gray-400 py-8">
        No stats yet. Start spinning to see your performance!
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Spins',
      value: stats.totalSpins.toLocaleString(),
      icon: Target,
      color: 'from-blue-500 to-blue-700',
    },
    {
      title: 'Net Profit/Loss',
      value: `$${stats.netProfit.toFixed(2)}`,
      icon: stats.netProfit >= 0 ? TrendingUp : TrendingDown,
      color: stats.netProfit >= 0 ? 'from-green-500 to-green-700' : 'from-red-500 to-red-700',
    },
    {
      title: 'Win Rate',
      value: `${(stats.winRate * 100).toFixed(1)}%`,
      icon: Target,
      color: 'from-purple-500 to-purple-700',
    },
    {
      title: 'ROI',
      value: `${(stats.roi || 0).toFixed(2)}%`,
      icon: DollarSign,
      color: (stats.roi || 0) >= 0 ? 'from-yellow-500 to-yellow-700' : 'from-orange-500 to-orange-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div key={idx} className="card-glass">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400 uppercase tracking-wider">{card.title}</p>
            <div className={`p-2 bg-gradient-to-br ${card.color} rounded-lg`}>
              <card.icon size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}