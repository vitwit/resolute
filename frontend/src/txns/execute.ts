import { OfflineAminoSigner, OfflineDirectSigner } from '@keplr-wallet/types';

import {
  SigningStargateClient,
  defaultRegistryTypes,
  AminoTypes,
} from "@cosmjs/stargate";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { Registry } from "@cosmjs/proto-signing";
import { MsgClaim } from "./passage/msg_claim";
import { MsgUnjail } from "./slashing/tx";

declare let window: WalletWindow;

export async function signAndBroadcastAmino(
  msgs: any[],
  fee: any,
  chainID: string,
  rpcURL: string,
  memo: string = ""
): Promise<any> {
  let result = await getWalletAmino(chainID);
  var wallet = result[0];
  var account = result[1];

  let registry = new Registry();
  defaultRegistryTypes.forEach((v: any) => {
    registry.register(v[0], v[1]);
  });

  registry.register("/passage3d.claim.v1beta1.MsgClaim", MsgClaim);

  const cosmJS = await SigningStargateClient.connectWithSigner(rpcURL, wallet, {
    registry: registry,
  });

  return await cosmJS.signAndBroadcast(account.address, msgs, fee, memo);
}

export async function signAndBroadcastProto(
  msgs: any[],
  fee: any,
  rpcURL: string
): Promise<any> {
  const client = await SigningStargateClient.connect(rpcURL);

  const chainId = await client.getChainId();
  let result = await getWalletDirect(chainId);
  var wallet = result[0];
  var account = result[1];

  let registry = new Registry();
  defaultRegistryTypes.forEach((v: any) => {
    registry.register(v[0], v[1]);
  });

  registry.register("/cosmos.slashing.v1beta1.MsgUnjail", MsgUnjail);

  const signingClient = await SigningStargateClient.offline(wallet, {
    registry: registry,
  });

  const accountInfo: any = await client.getAccount(account.address);

  const signed = await signingClient.sign(account.address, msgs, fee, "", {
    accountNumber: accountInfo.accountNumber,
    chainId: chainId,
    sequence: accountInfo.sequence,
  });

  return await client.broadcastTx(
    Uint8Array.from(TxRaw.encode(signed).finish())
  );
}

export function fee(
  coinMinimalDenom: string,
  amount: string,
  gas: number = 280000,
  feeGranter: string = ""
): any {
  return {
    amount: [{ amount: String(amount), denom: coinMinimalDenom }],
    gas: String(gas),
    granter: feeGranter,
  };
}

export async function getWalletAmino(chainID: string): Promise<any> {
  await window.wallet.enable(chainID);
  const offlineSigner = window.wallet.getOfflineSignerOnlyAmino(chainID);
  const accounts = await offlineSigner.getAccounts();
  return [offlineSigner, accounts[0]];
}

export async function getWalletDirect(
  chainID: string
): Promise<[OfflineAminoSigner & OfflineDirectSigner, string]> {
  await window.wallet.enable(chainID);
  const offlineSigner = window.wallet.getOfflineSigner(chainID);
  const accounts = await offlineSigner.getAccounts();
  return [offlineSigner, accounts[0]];
}

export function isWalletInstalled(): boolean {
  if (window.wallet === undefined) {
    return false;
  }
  return window?.wallet && window?.getOfflineSigner == null ? false : true;
}
