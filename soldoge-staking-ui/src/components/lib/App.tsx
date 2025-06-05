import React from "react";
import ConnectWallet from "./components/ConnectWallet";
import StakePanel from "./components/StakePanel";
import RewardsPanel from "./components/RewardsPanel";
import APYStats from "./components/APYStats";
import VestingTimer from "./components/VestingTimer";

function App() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-6">$SolDoge Staking Terminal 🐶</h1>
      <ConnectWallet />
      <APYStats />
      <StakePanel />
      <RewardsPanel />
      <VestingTimer lastStake={yourLastStakeUnix} />
    </div>
  );
}
