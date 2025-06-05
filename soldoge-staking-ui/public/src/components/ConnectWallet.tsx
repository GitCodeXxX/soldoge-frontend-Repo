import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function ConnectWallet() {
  return (
    <div className="mb-4">
      <WalletMultiButton />
    </div>
  );
}
