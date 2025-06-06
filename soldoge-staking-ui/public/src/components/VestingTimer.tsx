import { useEffect, useState } from "react";

export default function VestingTimer({ lastStake }: { lastStake: number }) {
  const [remaining, setRemaining] = useState(0);
  const duration = 7 * 86400;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const diff = duration - (now - lastStake);
      setRemaining(Math.max(0, diff));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastStake]);

  const pct = Math.min(100, ((duration - remaining) / duration) * 100).toFixed(2);

  return (
    <div className="bg-yellow-800 text-white p-3 rounded mt-4">
      <h4 className="font-bold text-sm">🎁 Vesting Progress</h4>
      <p className="text-xs text-gray-300">
        {remaining > 0 ? `⏳ ${remaining}s (${pct}%)` : "✅ Fully Vested"}
      </p>
    </div>
  );
}