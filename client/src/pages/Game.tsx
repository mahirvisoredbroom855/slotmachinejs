import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { api } from '../lib/api';
import SlotGrid from '../components/SlotGrid';
import Controls from '../components/Controls';
import type { SpinResult, Symbol } from '../types';
import { LogOut, BarChart3, Settings } from 'lucide-react';

export default function Game() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastResult, setLastResult] = useState<SpinResult | null>(null);
  const [rows, setRows] = useState<Symbol[][]>([
    ['D', 'D', 'D'],
    ['C', 'C', 'C'],
    ['B', 'B', 'B'],
  ]);

  useEffect(() => {
    initUser();
  }, []);

  const initUser = async () => {
    try {
      const data = await api.init();
      setBalance(data.balance);
    } catch (error) {
      console.error('Init error:', error);
    }
  };

  const handleSpin = async (lines: number, betPerLine: number) => {
    setIsSpinning(true);
    
    try {
      // Simulate spinning animation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = await api.spin(lines, betPerLine);
      setLastResult(result);
      setRows(result.rows);
      setBalance(result.balanceAfter);
    } catch (error: any) {
      alert(error.message || 'Spin failed');
    } finally {
      setIsSpinning(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-casino-gold to-casino-darkGold">
              SlotLab Casino
            </h1>
            <p className="text-gray-400 mt-1">
              {auth.currentUser?.email}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <BarChart3 size={20} /> Dashboard
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <Settings size={20} /> Admin
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-lg font-semibold flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Slot Machine - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <SlotGrid rows={rows} isSpinning={isSpinning} />
            
            {/* Result Display */}
            {lastResult && !isSpinning && (
              <div className={`card-glass text-center animate-slide-up ${
                lastResult.winnings > 0 ? 'glow-effect' : ''
              }`}>
                {lastResult.winnings > 0 ? (
                  <>
                    <p className="text-6xl font-black text-green-400 mb-2">
                      🎉 WIN! 🎉
                    </p>
                    <p className="text-4xl font-bold text-casino-gold">
                      +${lastResult.winnings.toFixed(2)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-gray-400 mb-2">
                      Better luck next time!
                    </p>
                    <p className="text-2xl text-red-400">
                      ${lastResult.net.toFixed(2)}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div>
            <Controls
              balance={balance}
              onSpin={handleSpin}
              isSpinning={isSpinning}
            />
          </div>
        </div>

        {/* Symbol Legend */}
        <div className="mt-12 card-glass">
          <h3 className="text-xl font-bold mb-4 text-casino-gold">Symbol Payouts</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { symbol: 'A', emoji: '💎', multiplier: '5x', rarity: 'Legendary' },
              { symbol: 'B', emoji: '🔔', multiplier: '4x', rarity: 'Rare' },
              { symbol: 'C', emoji: '🍒', multiplier: '3x', rarity: 'Uncommon' },
              { symbol: 'D', emoji: '⭐', multiplier: '2x', rarity: 'Common' },
            ].map(({ symbol, emoji, multiplier, rarity }) => (
              <div key={symbol} className="text-center">
                <div className={`slot-symbol symbol-${symbol} w-16 h-16 mx-auto mb-2 text-4xl`}>
                  {emoji}
                </div>
                <p className="font-bold text-lg">{multiplier}</p>
                <p className="text-sm text-gray-400">{rarity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}