import { getOrCreateATA } from "../lib/utils";
import { PublicKey } from "@solana/web3.js";

const SOL_DOGE_MINT = new PublicKey("9Ygtvst4rKMUK1jVhqpXFsGzDBkPCGAmugiCg9KgGGA6");

const stakeTokens = async () => {
  const ata = await getAssociatedTokenAddress(SOL_DOGE_MINT, publicKey!);
  const tokenAccount = await connection.getAccountInfo(ata);

  if (!tokenAccount) {
    console.log("⛽ Auto-creating ATA for $SolDoge");
    const tx = new Transaction().add(
      (
        await getOrCreateATA({
          owner: publicKey!,
          mint: SOL_DOGE_MINT,
          payer: publicKey!,
        })
      ).ix
    );
    await sendTransaction(tx, connection);
  }

  // continue with stake instruction...
};
