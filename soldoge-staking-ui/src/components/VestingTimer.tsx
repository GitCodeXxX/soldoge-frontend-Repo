import { useEffect, useState } from "react";

export default function VestingTimer({ lastStake }: { lastStake: number }) {
  const [remaining, setRemaining] = useState(0);
  const duration = 7 * 86400;

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const elapsed = now - lastStake;
      const timeLeft = duration - elapsed;
      setRemaining(timeLeft > 0 ? timeLeft : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [lastStake]);

  const pct = Math.min(100, ((duration - remaining) / duration) * 100).toFixed(2);

  return (
    <div className="bg-yellow-800 text-white mt-4 p-3 rounded">
      <h4 className="text-sm font-bold">🎁 Vesting Progress</h4>
      <div className="text-xs text-gray-300">
        {remaining > 0
          ? `⏳ ${remaining}s remaining (${pct}%)`
          : "✅ Fully Vested — Rewards claimable"}
      </div>
    </div>
  );
}
