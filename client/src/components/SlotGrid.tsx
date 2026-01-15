import type { Symbol } from '../types';

interface SlotGridProps {
  rows: Symbol[][];
  isSpinning: boolean;
}

const getSymbolEmoji = (symbol: Symbol): string => {
  const emojis = { A: '💎', B: '🔔', C: '🍒', D: '⭐' };
  return emojis[symbol];
};

export default function SlotGrid({ rows, isSpinning }: SlotGridProps) {
  return (
    <div className="relative">
      {/* Casino Slot Frame */}
      <div className="bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-700 p-8 rounded-3xl shadow-2xl">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl">
          {/* Slot Grid */}
          <div className="grid grid-cols-3 gap-4">
            {rows.map((row, rowIndex) => (
              row.map((symbol, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`slot-symbol symbol-${symbol} ${isSpinning ? 'opacity-50' : ''}`}
                >
                  {getSymbolEmoji(symbol)}
                </div>
              ))
            ))}
          </div>

          {/* Paylines Indicators */}
          <div className="mt-4 flex justify-center gap-2">
            {[1, 2, 3].map(line => (
              <div
                key={line}
                className="w-16 h-1 bg-gradient-to-r from-casino-gold to-casino-darkGold rounded-full opacity-60"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Lights */}
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-casino-gold rounded-full animate-pulse-glow" />
      <div className="absolute -top-4 -right-4 w-8 h-8 bg-casino-red rounded-full animate-pulse-glow" />
      <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-casino-green rounded-full animate-pulse-glow" />
      <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-casino-purple rounded-full animate-pulse-glow" />
    </div>
  );
}