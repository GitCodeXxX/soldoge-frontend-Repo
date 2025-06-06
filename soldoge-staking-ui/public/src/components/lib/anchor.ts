import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, Idl } from "@project-serum/anchor";
import idl from "./soldoge_idl.json";

export const PROGRAM_ID = new PublicKey("Your_Program_ID_Here"); // Replace this

export const connection = new Connection("https://api.devnet.solana.com");

export function getProvider(wallet: any) {
  return new AnchorProvider(connection, wallet, {
    commitment: "confirmed"
  });
}

export function getProgram(wallet: any) {
  return new Program(idl as Idl, PROGRAM_ID, getProvider(wallet));
}