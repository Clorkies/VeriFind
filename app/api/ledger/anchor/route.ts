import { NextRequest } from "next/server";
import { BlockfrostProvider } from "@meshsdk/provider";
import { MeshCardanoHeadlessWallet, AddressType } from "@meshsdk/wallet";
import { Transaction } from "@meshsdk/transaction";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const METADATA_LABEL = 674;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

type LedgerEvent = "item.logged" | "claim.approved" | "item.returned";

const getClientKey = (request: NextRequest) => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
};

const checkRateLimit = (key: string) => {
  const now = Date.now();
  const current = rateLimits.get(key);
  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (current.count >= RATE_LIMIT_MAX) {
    return false;
  }
  current.count += 1;
  return true;
};

const resolveNetworkId = (network: string | undefined) => {
  if (!network) return 0;
  const normalized = network.toLowerCase();
  return normalized === "mainnet" ? 1 : 0;
};

export async function POST(request: NextRequest) {
  const clientKey = getClientKey(request);
  if (!checkRateLimit(clientKey)) {
    return Response.json(
      { error: "Too many requests. Please wait before retrying." },
      { status: 429 },
    );
  }

  let body: {
    event?: LedgerEvent;
    itemId?: string;
    claimId?: string;
    adminId?: string;
  };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.event || !body.itemId || !body.adminId) {
    return Response.json(
      { error: "event, itemId, and adminId are required." },
      { status: 400 },
    );
  }

  if (body.event === "claim.approved" && !body.claimId) {
    return Response.json(
      { error: "claimId is required for claim.approved events." },
      { status: 400 },
    );
  }

  const projectId = process.env.BLOCKFROST_PROJECT_ID;
  const mnemonic = process.env.CARDANO_ADMIN_MNEMONIC;
  const networkId = resolveNetworkId(process.env.CARDANO_NETWORK);

  if (!projectId || !mnemonic) {
    return Response.json(
      {
        error:
          "Cardano credentials are missing. Set BLOCKFROST_PROJECT_ID and CARDANO_ADMIN_MNEMONIC.",
      },
      { status: 500 },
    );
  }

  const provider = new BlockfrostProvider(projectId);
  const wallet = await MeshCardanoHeadlessWallet.fromMnemonic({
    mnemonic: mnemonic.trim().split(/\s+/),
    networkId,
    walletAddressType: AddressType.Base,
    fetcher: provider,
  });
  const changeAddress = await wallet.getChangeAddressBech32();

  const metadata = {
    app: "verifind",
    event: body.event,
    itemId: body.itemId,
    claimId: body.claimId ?? null,
    adminId: body.adminId,
    timestamp: new Date().toISOString(),
  };

  const tx = new Transaction({
    initiator: wallet,
    fetcher: provider,
    submitter: provider,
    evaluator: provider,
    verbose: false,
  })
    .sendLovelace(changeAddress, "2000000")
    .setMetadata(METADATA_LABEL, metadata);

  const unsignedTx = await tx.build();
  const signedTx = await wallet.signTxReturnFullTx(unsignedTx);
  const txHash = await provider.submitTx(signedTx);

  return Response.json({ txHash });
}
