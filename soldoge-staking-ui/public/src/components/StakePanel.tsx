import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";

export default function StakePanel() {
  const { publicKey } = useWallet();
  const [amount, setAmount] = useState("");

  const stakeTokens = async () => {
    if (!publicKey) return alert("Please connect wallet first.");
    alert(`(Demo) Staking ${amount} $SolDoge from ${publicKey.toBase58()}`);
  };

  return (
    <div className="bg-gray-800 p-4 rounded mt-4">
      <h2 className="text-xl font-bold mb-2">Stake $SolDoge</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="w-full p-2 rounded text-black"
      />
      <button
        onClick={stakeTokens}
        className="bg-green-600 hover:bg-green-700 mt-2 px-4 py-2 rounded text-white w-full"
      >
        Stake
      </button>
    </div>
  );
}