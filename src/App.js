import React, { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import {
  useWallet,
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";

const SOLANA_NETWORK = "https://api.mainnet-beta.solana.com";
const SOL_DOGE_MINT = new PublicKey("9Ygtvst4rKMUK1jVhqpXFsGzDBkPCGAmugiCg9KgGGA6");

const AppContent = () => {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(0);
  const [staked, setStaked] = useState(() => Number(localStorage.getItem("staked") || 0));
  const [claimed, setClaimed] = useState(() => Number(localStorage.getItem("claimed") || 0));

  const connection = new Connection(SOLANA_NETWORK);

  useEffect(() => {
    if (!publicKey) return;
    (async () => {
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        mint: SOL_DOGE_MINT,
      });
      const amount = tokenAccounts.value[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount || 0;
      setBalance(amount);
    })();
  }, [publicKey]);

  const handleStake = () => {
    const newAmount = staked + 100;
    setStaked(newAmount);
    localStorage.setItem("staked", newAmount);
  };

  const handleClaim = () => {
    const reward = staked * 0.01; // 1% Daily reward (simuliert)
    const totalClaimed = claimed + reward;
    setClaimed(totalClaimed);
    localStorage.setItem("claimed", totalClaimed);
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>SolDoge Staking 🐶</h1>
      <WalletMultiButton />
      {publicKey && (
        <div style={{ marginTop: 20 }}>
          <p><b>Wallet:</b> {publicKey.toBase58()}</p>
          <p><b>SolDoge Balance:</b> {balance}</p>
          <p><b>Gestaked:</b> {staked} SolDoge</p>
          <p><b>Reward:</b> {(staked * 0.01).toFixed(2)} SolDoge</p>
          <p><b>Gesamt Claimed:</b> {claimed.toFixed(2)} SolDoge</p>
          <button onClick={handleStake}>Stake 100</button>
          <button onClick={handleClaim} style={{ marginLeft: 10 }}>Claim</button>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const wallets = [new PhantomWalletAdapter()];
  return (
    <ConnectionProvider endpoint={SOLANA_NETWORK}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AppContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;