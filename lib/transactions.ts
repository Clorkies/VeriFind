import { BlockfrostProvider } from "@meshsdk/provider";
import { MeshTxBuilder } from "@meshsdk/transaction";
import type { MeshCardanoBrowserWallet } from "@meshsdk/wallet";

export type Recipient = {
  address: string;
  amount: string;
};

const POSITIVE_INTEGER = /^\d+$/;

export async function sendLovelace(
  wallet: MeshCardanoBrowserWallet,
  recipient: Recipient,
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID;
  if (!apiKey) {
    throw new Error(
      "Blockfrost API key is not configured. Set NEXT_PUBLIC_BLOCKFROST_PROJECT_ID in your environment.",
    );
  }

  const address = recipient.address.trim();
  const amount = recipient.amount.trim();

  if (!address) {
    throw new Error("Recipient address is required.");
  }
  if (!POSITIVE_INTEGER.test(amount) || BigInt(amount) <= BigInt(0)) {
    throw new Error("Amount must be a positive integer (lovelace).");
  }

  const provider = new BlockfrostProvider(apiKey);
  const txBuilder = new MeshTxBuilder({
    fetcher: provider,
    verbose: true,
  });

  const utxos = await wallet.getUtxosMesh();
  const changeAddress = await wallet.getChangeAddressBech32();

  const unsignedTx = await txBuilder
    .txOut(address, [{ unit: "lovelace", quantity: amount }])
    .changeAddress(changeAddress)
    .selectUtxosFrom(utxos)
    .complete();

  const signedTx = await wallet.signTxReturnFullTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);

  return txHash;
}
