import React from 'react';
import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

import '@solana/wallet-adapter-react-ui/styles.css';

const network = 'devnet';
const endpoint = clusterApiUrl(network);
const wallets = [new PhantomWalletAdapter()];

export default function App() {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div style={{ padding: '2rem' }}>
            <h1>SolDoge Staking dApp 🐶</h1>
            <WalletMultiButton />
            {/* TODO: staking ui here */}
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
