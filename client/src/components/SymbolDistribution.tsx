import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SymbolDistributionProps {
  observed: { [key: string]: number };
  expected: { [key: string]: number };
}

export default function SymbolDistribution({ observed, expected }: SymbolDistributionProps) {
  const data = ['A', 'B', 'C', 'D'].map(symbol => ({
    symbol,
    observed: ((observed[symbol] || 0) * 100).toFixed(2),
    expected: ((expected[symbol] || 0) * 100).toFixed(2),
  }));

  return (
    <div className="card-glass">
      <h3 className="text-2xl font-bold mb-6 text-casino-gold">Symbol Distribution</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="symbol" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(17, 24, 39, 0.95)', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.5rem',
            }}
          />
          <Legend />
          <Bar dataKey="observed" fill="#10B981" name="Observed %" />
          <Bar dataKey="expected" fill="#6366F1" name="Expected %" />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-4 gap-2 text-sm">
        {['A', 'B', 'C', 'D'].map(symbol => (
          <div key={symbol} className="text-center">
            <div className={`slot-symbol symbol-${symbol} w-12 h-12 mx-auto mb-2`}>
              {symbol === 'A' && '💎'}
              {symbol === 'B' && '🔔'}
              {symbol === 'C' && '🍒'}
              {symbol === 'D' && '⭐'}
            </div>
            <p className="text-xs text-gray-400">
              {((observed[symbol] || 0) * 100).toFixed(1)}% / {((expected[symbol] || 0) * 100).toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}