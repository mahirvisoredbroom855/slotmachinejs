import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { ArrowLeft, Play, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SimulationResult {
  trials: number;
  totalBet: number;
  totalWinnings: number;
  netProfit: number;
  avgReturn: number;
  roi: string;
  winRate: string;
  symbolDistribution: { [key: string]: number };
  payoutDistribution: Array<{
    payout: number;
    count: number;
    percentage: string;
  }>;
}

export default function Admin() {
  const navigate = useNavigate();
  const [trials, setTrials] = useState(10000);
  const [lines, setLines] = useState(3);
  const [betPerLine, setBetPerLine] = useState(10);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const data = await api.simulate(trials, lines, betPerLine);
      setResult(data);
    } catch (error: any) {
      alert(error.message || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  const exportResults = () => {
    if (!result) return;
    
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `simulation-${trials}-trials-${Date.now()}.json`;
    link.click();
  };

  const symbolDistributionData = result
    ? Object.entries(result.symbolDistribution).map(([symbol, prob]) => ({
        symbol,
        percentage: (prob * 100).toFixed(2),
      }))
    : [];

  const payoutData = result?.payoutDistribution.slice(0, 10) || [];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/game')}
            className="flex items-center gap-2 text-casino-gold hover:text-casino-darkGold mb-4 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Game
          </button>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
            Monte Carlo Simulation Lab
          </h1>
          <p className="text-gray-400 mt-2">
            Run large-scale simulations to analyze probability distributions and expected outcomes
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="card-glass">
            <h2 className="text-2xl font-bold mb-6 text-casino-gold">Simulation Parameters</h2>

            <div className="space-y-6">
              {/* Trials */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Number of Trials
                </label>
                <select
                  value={trials}
                  onChange={(e) => setTrials(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={100}>100</option>
                  <option value={1000}>1,000</option>
                  <option value={10000}>10,000</option>
                  <option value={100000}>100,000</option>
                  <option value={1000000}>1,000,000</option>
                </select>
              </div>

              {/* Lines */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Lines
                </label>
                <select
                  value={lines}
                  onChange={(e) => setLines(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={1}>1 Line</option>
                  <option value={2}>2 Lines</option>
                  <option value={3}>3 Lines</option>
                </select>
              </div>

              {/* Bet Per Line */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Bet Per Line: ${betPerLine}
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={betPerLine}
                  onChange={(e) => setBetPerLine(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>$1</span>
                  <span>$100</span>
                </div>
              </div>

              {/* Run Button */}
              <button
                onClick={handleSimulate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-8 rounded-lg shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Running Simulation...
                  </>
                ) : (
                  <>
                    <Play size={20} /> Run Simulation
                  </>
                )}
              </button>

              {result && (
                <button
                  onClick={exportResults}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Download size={20} /> Export Results
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {!result && !loading && (
              <div className="card-glass text-center py-20">
                <div className="text-6xl mb-4">🎲</div>
                <h3 className="text-2xl font-bold text-gray-400 mb-2">
                  No Simulation Run Yet
                </h3>
                <p className="text-gray-500">
                  Configure parameters and click "Run Simulation" to begin
                </p>
              </div>
            )}

            {loading && (
              <div className="card-glass text-center py-20">
                <div className="text-6xl mb-4 animate-spin">⚙️</div>
                <h3 className="text-2xl font-bold text-purple-400 mb-2">
                  Running {trials.toLocaleString()} Simulations...
                </h3>
                <p className="text-gray-500">This may take a moment</p>
              </div>
            )}

            {result && !loading && (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="card-glass">
                    <p className="text-sm text-gray-400 mb-1">Total Trials</p>
                    <p className="text-2xl font-bold">{result.trials.toLocaleString()}</p>
                  </div>
                  <div className="card-glass">
                    <p className="text-sm text-gray-400 mb-1">Win Rate</p>
                    <p className="text-2xl font-bold text-green-400">{result.winRate}</p>
                  </div>
                  <div className="card-glass">
                    <p className="text-sm text-gray-400 mb-1">ROI</p>
                    <p className={`text-2xl font-bold ${result.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {result.roi}
                    </p>
                  </div>
                  <div className="card-glass">
                    <p className="text-sm text-gray-400 mb-1">Avg Return</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {(result.avgReturn * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="card-glass">
                  <h3 className="text-xl font-bold mb-4 text-casino-gold">Financial Summary</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Total Wagered</p>
                      <p className="text-3xl font-bold">${result.totalBet.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Total Won</p>
                      <p className="text-3xl font-bold text-green-400">
                        ${result.totalWinnings.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Net Profit/Loss</p>
                      <p className={`text-3xl font-bold ${result.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {result.netProfit >= 0 ? '+' : ''}${result.netProfit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Symbol Distribution Chart */}
                <div className="card-glass">
                  <h3 className="text-xl font-bold mb-4 text-casino-gold">Symbol Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={symbolDistributionData}>
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
                      <Bar dataKey="percentage" fill="#8B5CF6" name="Frequency %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Payout Distribution Chart */}
                <div className="card-glass">
                  <h3 className="text-xl font-bold mb-4 text-casino-gold">
                    Payout Distribution (Top 10)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={payoutData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="payout" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(17, 24, 39, 0.95)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '0.5rem',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="count" fill="#10B981" name="Occurrences" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Payout Table */}
                <div className="card-glass">
                  <h3 className="text-xl font-bold mb-4 text-casino-gold">Detailed Payout Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Payout</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Count</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.payoutDistribution.map((item, idx) => (
                          <tr key={idx} className="border-b border-gray-800 hover:bg-white/5">
                            <td className="py-3 px-4 font-semibold">${item.payout}</td>
                            <td className="py-3 px-4 text-right">{item.count.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right text-purple-400">{item.percentage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}