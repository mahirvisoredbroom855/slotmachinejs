import type { SpinRecord } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface SpinsTableProps {
  spins: SpinRecord[];
}

export default function SpinsTable({ spins }: SpinsTableProps) {
  const [showAll, setShowAll] = useState(false);
  const displaySpins = showAll ? spins : spins.slice(0, 10);

  if (spins.length === 0) {
    return (
      <div className="card-glass text-center text-gray-400 py-8">
        No spins recorded yet. Play some games to see your history!
      </div>
    );
  }

  return (
    <div className="card-glass">
      <h3 className="text-2xl font-bold mb-4 text-casino-gold">Recent Spins</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Time</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Lines</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Bet</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Won</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Net</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Balance</th>
            </tr>
          </thead>
          <tbody>
            {displaySpins.map((spin, idx) => (
              <tr 
                key={idx}
                className="border-b border-gray-800 hover:bg-white/5 transition-colors"
              >
                <td className="py-3 px-4 text-sm text-gray-300">
                  {new Date(spin.createdAt).toLocaleTimeString()}
                </td>
                <td className="py-3 px-4 text-right text-sm">{spin.lines}</td>
                <td className="py-3 px-4 text-right text-sm">${spin.totalBet.toFixed(2)}</td>
                <td className="py-3 px-4 text-right text-sm text-green-400">
                  ${spin.winnings.toFixed(2)}
                </td>
                <td className={`py-3 px-4 text-right text-sm font-semibold ${
                  spin.net >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {spin.net >= 0 ? '+' : ''}${spin.net.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right text-sm font-semibold">
                  ${spin.balanceAfter.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {spins.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          {showAll ? (
            <>
              Show Less <ChevronUp size={18} />
            </>
          ) : (
            <>
              Show All ({spins.length}) <ChevronDown size={18} />
            </>
          )}
        </button>
      )}
    </div>
  );
}