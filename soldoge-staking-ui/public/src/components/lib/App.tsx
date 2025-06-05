import ConnectWallet from "./components/ConnectWallet";
import StakePanel from "./components/StakePanel";
import RewardsPanel from "./components/RewardsPanel";
import APYStats from "./components/APYStats";
import VestingTimer from "./components/VestingTimer";

function App() {
  const fakeLastStake = Math.floor(Date.now() / 1000) - 3 * 86400; // simulate 3 days ago

  return (
    <div className="bg-black min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">$SolDoge Staking Terminal</h1>
      <ConnectWallet />
      <APYStats />
      <StakePanel />
      <RewardsPanel />
      <VestingTimer lastStake={fakeLastStake} />
    </div>
  );
}

export default App;
