import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

export async function getOrCreateATA({ owner, mint, payer }: {
  owner: PublicKey;
  mint: PublicKey;
  payer: PublicKey;
}) {
  const ata = await getAssociatedTokenAddress(mint, owner);
  const ix = createAssociatedTokenAccountInstruction(
    payer, ata, owner, mint, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID
  );
  return { ata, ix };
}
