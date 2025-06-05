import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, Idl } from "@project-serum/anchor";
import idl from "./soldoge_idl.json"; // Copy from `target/idl/soldoge_staking.json`

export const PROGRAM_ID = new PublicKey("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkgEoYy3z2i5A");
export const connection = new Connection("https://api.devnet.solana.com");

export function getProvider(wallet: any) {
  return new AnchorProvider(connection, wallet, { commitment: "confirmed" });
}

export function getProgram(wallet: any) {
  return new Program(idl as Idl, PROGRAM_ID, getProvider(wallet));
}
