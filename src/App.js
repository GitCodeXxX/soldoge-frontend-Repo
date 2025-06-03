import React, { useEffect, useMemo, useState } from "react";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  SystemProgram,
} from "@solana/web3.js";
import {
  Program,
  AnchorProvider,
  web3,
  utils,
  BN,
} from "@project-serum/anchor";
import idl from "./idl.json";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  WalletAdapterNetwork,
} from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import "@solana/wallet-adapter-react-ui/styles.css";

const programID = new PublicKey("Ccy8Qws1jsWvxmtMpdunNkRk7cPen9xGHo9V9Z7KnGM");
const SOL_DOGE_MINT = new PublicKey("9Ygtvst4rKMUK1jVhqpXFsGzDBkPCGAmugiCg9KgGGA6");
const network = WalletAdapterNetwork.Devnet;
const opts = {
  preflightCommitment: "processed",
};

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [program, setProgram] = useState(null);
  const connection = useMemo(() => new Connection(clusterApiUrl(network), "processed"), []);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  const getProvider = async () => {
    const anchorProvider = new AnchorProvider(connection, window.solana, opts);
    const program = new Program(idl, programID, anchorProvider);
    setProvider(anchorProvider);
    setProgram(program);
  };

  useEffect(() => {
    getProvider();
  }, []);

  const stakeTokens = async (amount) => {
    const staker = provider.wallet.publicKey;
    const [userStakePDA] = await PublicKey.findProgramAddressSync(
      [Buffer.from("user-stake"), staker.toBuffer()],
      programID
    );

    const fromTokenAccount = await getAssociatedTokenAddress(SOL_DOGE_MINT, staker);
    const vaultTokenAccount = await getAssociatedTokenAddress(SOL_DOGE_MINT, programID, true);

    await program.methods
      .stake(new BN(amount))
      .accounts({
        staker,
        userStake: userStakePDA,
        fromTokenAccount,
        vaultTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    alert("✅ Stake erfolgreich!");
  };

  const claimRewards = async () => {
    const staker = provider.wallet.publicKey;
    const [userStakePDA] = await PublicKey.findProgramAddressSync(
      [Buffer.from("user-stake"), staker.toBuffer()],
      programID
    );

    const rewardVault = await getAssociatedTokenAddress(SOL_DOGE_MINT, programID, true);
    const userTokenAccount = await getAssociatedTokenAddress(SOL_DOGE_MINT, staker);
    const [vaultAuthority] = await PublicKey.findProgramAddressSync(
      [Buffer.from("vault-authority")],
      programID
    );
    const [stakeStatePDA] = await PublicKey.findProgramAddressSync(
      [Buffer.from("stake-state")],
      programID
    );

    await program.methods
      .claim()
      .accounts({
        userStake: userStakePDA,
        rewardVault,
        userTokenAccount,
        vaultAuthority,
        stakeState: stakeStatePDA,
        tokenProgram: TOKEN_PROGRAM_ID,
        staker,
      })
      .rpc();

    alert("🎉 Belohnungen erfolgreich beansprucht!");
  };

  return (
    <ConnectionProvider endpoint={clusterApiUrl(network)}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div style={{ padding: 40 }}>
            <h1>🐶 SolDoge Staking DApp</h1>
            <WalletMultiButton />
            {provider && (
              <>
                <br />
                <button onClick={() => stakeTokens(1000000)}>📥 1 SolDoge staken</button>
                <br /><br />
                <button onClick={claimRewards}>💰 Belohnung abholen</button>
              </>
            )}
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;