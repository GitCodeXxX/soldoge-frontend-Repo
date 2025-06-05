import { useWallet } from "@solana/wallet-adapter-react";
import { getProgram } from "../lib/anchor";

export default function RewardsPanel() {
  const { publicKey, wallet } = useWallet();

  const claimRewards = async () => {
    if (!publicKey || !wallet) return;
    const program = getProgram(wallet);

    console.log("Claiming rewards for", publicKey.toBase58());
    // TODO: invoke `program.methods.claim()` with proper accounts
  };

  return (
    <div className="bg-purple-900 p-4 rounded mt-4">
      <h2 className="text-xl font-bold mb-2">Claim Rewards</h2>
      <button
        onClick={claimRewards}
        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white w-full"
      >
        Claim
      </button>
    </div>
  );
}
