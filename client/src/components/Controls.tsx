import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface ControlsProps {
  balance: number;
  onSpin: (lines: number, betPerLine: number) => void;
  isSpinning: boolean;
}

export default function Controls({ balance, onSpin, isSpinning }: ControlsProps) {
  const [lines, setLines] = useState(3);
  const [betPerLine, setBetPerLine] = useState(10);

  const totalBet = lines * betPerLine;
  const canAfford = balance >= totalBet;

  const handleSpin = () => {
    if (canAfford && !isSpinning) {
      onSpin(lines, betPerLine);
    }
  };

  return (
    <div className="card-glass space-y-6">
      {/* Balance Display */}
      <div className="text-center">
        <p className="text-sm text-gray-400 uppercase tracking-wider">Balance</p>
        <p className="text-5xl font-black text-casino-gold mt-2">
          ${balance.toFixed(2)}
        </p>
      </div>

      {/* Lines Control */}
      <div>
        <label className="block text-sm font-semibold mb-3 text-gray-300">
          Active Lines: <span className="text-casino-gold text-xl">{lines}</span>
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLines(Math.max(1, lines - 1))}
            className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors"
            disabled={lines <= 1}
          >
            <Minus size={20} />
          </button>
          <div className="flex-1 bg-gray-800 rounded-lg p-3 text-center">
            <div className="flex justify-around">
              {[1, 2, 3].map(l => (
                <div
                  key={l}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg transition-all ${
                    l <= lines
                      ? 'bg-casino-green text-white shadow-lg shadow-casino-green/50'
                      : 'bg-gray-700 text-gray-500'
                  }`}
                >
                  {l}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setLines(Math.min(3, lines + 1))}
            className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors"
            disabled={lines >= 3}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Bet Per Line Control */}
      <div>
        <label className="block text-sm font-semibold mb-3 text-gray-300">
          Bet Per Line: <span className="text-casino-gold text-xl">${betPerLine}</span>
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setBetPerLine(Math.max(1, betPerLine - 5))}
            className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors"
            disabled={betPerLine <= 1}
          >
            <Minus size={20} />
          </button>
          <input
            type="range"
            min="1"
            max="100"
            value={betPerLine}
            onChange={(e) => setBetPerLine(Number(e.target.value))}
            className="flex-1"
          />
          <button
            onClick={() => setBetPerLine(Math.min(100, betPerLine + 5))}
            className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors"
            disabled={betPerLine >= 100}
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>$1</span>
          <span>$100</span>
        </div>
      </div>

      {/* Total Bet Display */}
      <div className="bg-gray-800 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-400">Total Bet</p>
        <p className="text-3xl font-bold text-white mt-1">${totalBet}</p>
      </div>

      {/* Spin Button */}
      <button
        onClick={handleSpin}
        disabled={!canAfford || isSpinning}
        className="btn-spin w-full"
      >
        {isSpinning ? '🎰 SPINNING...' : '🎰 SPIN'}
      </button>

      {!canAfford && (
        <p className="text-red-400 text-sm text-center animate-pulse">
          Insufficient balance for this bet!
        </p>
      )}
    </div>
  );
}