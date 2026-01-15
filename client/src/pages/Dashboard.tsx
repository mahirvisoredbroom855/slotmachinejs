import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import type { SpinRecord, UserStats } from "../types";
import StatsCards from "../components/StatsCards";
import SpinsTable from "../components/SpinsTable";
import SymbolDistribution from "../components/SymbolDistribution";
import { ArrowLeft, Download } from "lucide-react";

type StatsResponse = {
  balance: number;
  stats: UserStats | null;
  recentSpins: SpinRecord[];
  expectedProbabilities: Record<string, number>;
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentSpins, setRecentSpins] = useState<SpinRecord[]>([]);
  const [expectedProbs, setExpectedProbs] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStats = async () => {
    try {
      const data = (await api.getStats()) as StatsResponse;
      setStats(data.stats);
      setRecentSpins(data.recentSpins ?? []);
      setExpectedProbs(data.expectedProbabilities ?? {});
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportJSON = async () => {
    try {
      await api.exportJSON();
    } catch (error) {
      console.error(error);
      alert("Export JSON failed");
    }
  };

  const handleExportXML = async () => {
    try {
      await api.exportXML();
    } catch (error) {
      console.error(error);
      alert("Export XML failed");
    }
  };

  // Observed probs computed from symbolFrequencies
  const observedProbs = useMemo<Record<string, number>>(() => {
    const freqs = stats?.symbolFrequencies;
    if (!freqs) return {};

    const total = Object.values(freqs).reduce((sum, n) => sum + n, 0);
    if (total <= 0) return {};

    const out: Record<string, number> = {};
    for (const [symbol, count] of Object.entries(freqs)) {
      out[symbol] = count / total;
    }
    return out;
  }, [stats]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl font-bold text-casino-gold animate-pulse">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <button
              onClick={() => navigate("/game")}
              className="flex items-center gap-2 text-casino-gold hover:text-casino-darkGold mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Game
            </button>

            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-casino-gold to-casino-darkGold">
              Performance Dashboard
            </h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleExportJSON}
              className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold flex items-center gap-2 transition-all"
            >
              <Download size={20} />
              Export JSON
            </button>
            <button
              onClick={handleExportXML}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold flex items-center gap-2 transition-all"
            >
              <Download size={20} />
              Export XML
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards stats={stats} />
        </div>

        {/* Charts + Quick Stats */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <SymbolDistribution observed={observedProbs} expected={expectedProbs} />

          <div className="card-glass">
            <h3 className="text-2xl font-bold mb-4 text-casino-gold">Quick Stats</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-400">Total Bet</span>
                <span className="font-bold text-xl">
                  ${stats ? stats.totalBet.toFixed(2) : "0.00"}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-400">Total Winnings</span>
                <span className="font-bold text-xl text-green-400">
                  ${stats ? stats.totalWinnings.toFixed(2) : "0.00"}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <span className="text-gray-400">Average Bet</span>
                <span className="font-bold text-xl">
                  ${stats ? stats.avgBetSize.toFixed(2) : "0.00"}
                </span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-gray-400">Games Played</span>
                <span className="font-bold text-xl">{stats?.totalSpins ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Spins Table - This fixes the 'never read' errors */}
        <div className="mt-8">
          <SpinsTable spins={recentSpins} />
        </div>
      </div>
    </div>
  );
}