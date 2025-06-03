import React, { useEffect, useState } from "react";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import {
  useWallet,
  WalletProvider
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton
} from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter
} from "@solana/wallet-adapter-wallets";
import {
  AnchorProvider,
  Program,
  web3,
  BN
} from "@project-serum/anchor";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import idl from "./idl.json";

require("@solana/wallet-adapter-react-ui/styles.css");

const programID = new PublicKey("Ccy8Qws1jsWvxmtMpdunNkRk7cPen9xGHo9V9Z7KnGM");
const SOL_DOGE_MINT = new PublicKey("9Ygtvst4rKMUK1jVhqpXFsGzDBkPCGAmugiCg9KgGGA6");
const network = "https://api.devnet.solana.com";
const opts = { preflightCommitment: "processed" };

function App() {
  const wallet = useWallet();
  const [program, setProgram] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(connection, wallet, opts);
    const program = new Program(idl, programID, provider);
    setProvider(provider);
    setProgram(program);
  }, [wallet]);

  const stake = async () => {
    if (!program || !wallet.publicKey) return;

    const amount = new BN(1000); // Beispiel: 1000 SDOGE

    const [userStakePDA] = await PublicKey.findProgramAddress(
      [Buffer.from("user-stake"), wallet.publicKey.toBuffer()],
      programID
    );

    const userTokenAccount = await getAssociatedTokenAddress(
      SOL_DOGE_MINT,
      wallet.publicKey
    );

    const vaultTokenAccount = await getAssociatedTokenAddress(
      SOL_DOGE_MINT,
      programID,
      true
    );

    const tx = await program.methods
      .stake(amount)
      .accounts({
        staker: wallet.publicKey,
        userStake: userStakePDA,
        fromTokenAccount: userTokenAccount,
        vaultTokenAccount: vaultTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId
      })
      .rpc();

    console.log("Stake transaction signature", tx);
  };

  const claim = async () => {
    if (!program || !wallet.publicKey) return;

    const [userStakePDA] = await PublicKey.findProgramAddress(
      [Buffer.from("user-stake"), wallet.publicKey.toBuffer()],
      programID
    );

    const userTokenAccount = await getAssociatedTokenAddress(
      SOL_DOGE_MINT,
      wallet.publicKey
    );

    const vaultTokenAccount = await getAssociatedTokenAddress(
      SOL_DOGE_MINT,
      programID,
      true
    );

    const [vaultAuthority] = await PublicKey.findProgramAddress(
      [Buffer.from("vault")],
      programID
    );

    const tx = await program.methods
      .claim()
      .accounts({
        userStake: userStakePDA,
        rewardVault: vaultTokenAccount,
        userTokenAccount: userTokenAccount,
        vaultAuthority: vaultAuthority,
        stakeState: programID,
        tokenProgram: TOKEN_PROGRAM_ID,
        staker: wallet.publicKey
      })
      .rpc();

    console.log("Claim transaction signature", tx);
  };

  return (
    <div style={{ padding: 24 }}>
      <WalletMultiButton />
      <h2>SolDoge Staking</h2>
      <button onClick={stake} disabled={!wallet.connected}>
        Stake
      </button>
      <button onClick={claim} disabled={!wallet.connected}>
        Claim
      </button>
    </div>
  );
}

const wallets = [new PhantomWalletAdapter()];
const WrappedApp = () => (
  <WalletProvider wallets={wallets} autoConnect>
    <WalletModalProvider>
      <App />
    </WalletModalProvider>
  </WalletProvider>
);

export default WrappedApp;
