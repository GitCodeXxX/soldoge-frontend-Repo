export default function APYStats() {
  const dailyRate = 0.5;
  const apy = ((1 + dailyRate / 100) ** 365 - 1) * 100;

  return (
    <div className="bg-indigo-900 p-4 rounded text-white mb-4">
      <h3 className="text-lg font-bold">📊 $SolDoge APY</h3>
      <p className="text-green-400">{apy.toFixed(2)}% / year</p>
      <p className="text-xs text-gray-400">Daily ROI: {dailyRate}%</p>
    </div>
  );
}
