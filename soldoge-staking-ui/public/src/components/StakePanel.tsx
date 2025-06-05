import { useWallet } from "@solana/wallet-adapter-react";
import { getProgram } from "../lib/anchor";
import { useState } from "react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { getOrCreateATA } from "../lib/utils";

const SOL_DOGE_MINT = new PublicKey("9Ygtvst4rKMUK1jVhqpXFsGzDBkPCGAmugiCg9KgGGA6");

export default function StakePanel() {
  const { publicKey, sendTransaction, wallet } = useWallet();
  const [amount, setAmount] = useState("");

  const stakeTokens = async () => {
    if (!publicKey || !wallet) return;
    const program = getProgram(wallet);

    const { ata, ix } = await getOrCreateATA({
      owner: publicKey,
      mint: SOL_DOGE_MINT,
      payer: publicKey,
    });

    const tx = new Transaction().add(ix);
    await sendTransaction(tx, program.provider.connection);
    console.log("Staked", amount);
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
