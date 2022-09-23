import {
  SigningStargateClient,
  defaultRegistryTypes,
  AminoTypes,
} from "@cosmjs/stargate";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { Registry } from "@cosmjs/proto-signing";
import { MsgClaim } from "./passage/msg_claim";
import { MsgCreateGroup, MsgCreateGroupPolicy, MsgCreateGroupWithPolicy, MsgExec, MsgLeaveGroup, MsgSubmitProposal, MsgUpdateGroupAdmin, MsgUpdateGroupMembers, MsgUpdateGroupMetadata, MsgUpdateGroupPolicyAdmin, MsgUpdateGroupPolicyDecisionPolicy, MsgUpdateGroupPolicyMetadata, MsgVote } from "./group/v1/tx";
import { AirdropAminoConverter } from "../features/airdrop/amino";
import { MsgUnjail } from "./slashing/tx";
import { SlashingAminoConverter } from "../features/slashing/slashing";
import { MsgGrantAllowance } from "cosmjs-types/cosmos/feegrant/v1beta1/tx";
import { AllowedMsgAllowance } from "cosmjs-types/cosmos/feegrant/v1beta1/feegrant";

export async function signAndBroadcastGroupMsg(
  signer,
  msgs,
  fee,
  chainId,
  rpcURL,
  memo = ""
) {
  await window.keplr.enable(chainId);
  const offlineSigner =
    window.getOfflineSigner && window.keplr.getOfflineSigner(chainId);
  let registry = new Registry();
  defaultRegistryTypes.forEach((v) => {
    registry.register(v[0], v[1]);
  });

  registry.register(
    "/cosmos.group.v1.MsgCreateGroupWithPolicy",
    MsgCreateGroupWithPolicy
  );
  registry.register("/cosmos.group.v1.MsgCreateGroup", MsgCreateGroup);

  const client = await SigningStargateClient.connectWithSigner(
    rpcURL,
    offlineSigner,
    {
      registry: registry,
    }
  );

  return await client.signAndBroadcast(signer, msgs, fee, memo);
}

export async function signAndBroadcastUpdateGroupMembers(
  signer,
  msgs,
  fee,
  chainId,
  rpcURL,
  memo = ""
) {
  await window.keplr.enable(chainId);
  const offlineSigner =
    window.getOfflineSigner && window.keplr.getOfflineSigner(chainId);
  let registry = new Registry();
 

  registry.register(
    "/cosmos.group.v1.MsgUpdateGroupMembers",
    MsgUpdateGroupMembers
  );

  const client = await SigningStargateClient.connectWithSigner(
    rpcURL,
    offlineSigner,
    {
      registry: registry,
    }
  );

  return await client.signAndBroadcast(signer, msgs, fee, memo);
}

export async function signAndBroadcastUpdateGroupPolicy(
  signer,
  msgs,
  fee,
  chainId,
  rpcURL,
  memo = ""
) {
  await window.keplr.enable(chainId);
  const offlineSigner =
    window.getOfflineSigner && window.keplr.getOfflineSigner(chainId);
  let registry = new Registry();
 

  registry.register(
    "/cosmos.group.v1.MsgUpdateGroupPolicyDecisionPolicy",
    MsgUpdateGroupPolicyDecisionPolicy
  );

  const client = await SigningStargateClient.connectWithSigner(
    rpcURL,
    offlineSigner,
    {
      registry: registry,
    }
  );

  return await client.signAndBroadcast(signer, msgs, fee, memo);
}

export async function signAndBroadcastUpdateGroupPolicyMetadata(
  signer,
  msgs,
  fee,
  chainId,
  rpcURL,
  memo = ""
) {
  await window.keplr.enable(chainId);
  const offlineSigner =
    window.getOfflineSigner && window.keplr.getOfflineSigner(chainId);
  let registry = new Registry();
 

  registry.register(
    "/cosmos.group.v1.MsgUpdateGroupPolicyMetadata",
    MsgUpdateGroupPolicyMetadata
  );

  const client = await SigningStargateClient.connectWithSigner(
    rpcURL,
    offlineSigner,
    {
      registry: registry,
    }
  );

  return await client.signAndBroadcast(signer, msgs, fee, memo);
}

export async function signAndBroadcastUpdateGroupPolicyAdmin(
  signer,
  msgs,
  fee,
  chainId,
  rpcURL,
  memo = ""
) {
  await window.keplr.enable(chainId);
  const offlineSigner =
    window.getOfflineSigner && window.keplr.getOfflineSigner(chainId);
  let registry = new Registry();
 

  registry.register(
    "/cosmos.group.v1.MsgUpdateGroupPolicyAdmin",
    MsgUpdateGroupPolicyAdmin
  );

  const client = await SigningStargateClient.connectWithSigner(
    rpcURL,
    offlineSigner,
    {
      registry: registry,
    }
  );

  return await client.signAndBroadcast(signer, msgs, fee, memo);
}

export async function signAndBroadcastAddGroupPolicy(
  signer,
  msgs,
  fee,
  chainId,
  rpcURL,
  memo = ""
) {
  await window.keplr.enable(chainId);
  const offlineSigner =
    window.getOfflineSigner && window.keplr.getOfflineSigner(chainId);
  let registry = new Registry();
 

  registry.register(
    "/cosmos.group.v1.MsgCreateGroupPolicy",
    MsgCreateGroupPolicy
  );

  const client = await SigningStargateClient.connectWithSigner(
    rpcURL,
    offlineSigner,
    {
      registry: registry,
    }
  );

  return await client.signAndBroadcast(signer, msgs, fee, memo);
}

export async function signAndBroadcastLeaveGroup(
  signer,
  msgs,
  fee,
  chainId,
  rpcURL,
  memo = ""
) {
  await window.keplr.enable(chainId);
  const offlineSigner =
    window.getOfflineSigner && window.keplr.getOfflineSigner(chainId);
  let registry = new Registry();
 

  registry.register(
    "/cosmos.group.v1.MsgLeaveGroup",
    MsgLeaveGroup
  );

  const client = await SigningStargateClient.connectWithSigner(
    rpcURL,
    offlineSigner,
    {
      registry: registry,
    }
  );

  return await client.signAndBroadcast(signer, msgs, fee, memo);
}

export async function signAndBroadcastGroupProposalVote(
  signer,
  msgs,
  fee,
  chainId,
  rpcURL,
  memo = ""
) {
  await window.keplr.enable(chainId);
  const offlineSigner =
    window.getOfflineSigner && window.keplr.getOfflineSigner(chainId);
  let registry = new Registry();

  const aTypes = new AminoTypes({
    ...MsgVote,
  });

  registry.register(
    "/cosmos.group.v1.MsgVote",
    MsgVote
  );

  const client = await SigningStargateClient.connectWithSigner(
    rpcURL,
    offlineSigner,
    {
      registry: registry,
      aminoTypes: aTypes,
    }
  );

  return await client.signAndBroadcast(signer, msgs, fee, memo);
}

export async function signAndBroadcastGroupProposalExecute(
  signer,
  msgs,
  fee,
  chainId,
  rpcURL,
  memo = ""
) {
  await window.keplr.enable(chainId);
  const offlineSigner =
    window.getOfflineSigner && window.keplr.getOfflineSigner(chainId);
  let registry = new Registry();

  const aTypes = new AminoTypes({
    ...MsgExec,
  });

  registry.register(
    "/cosmos.group.v1.MsgExec",
    MsgExec
  );

  const client = await SigningStargateClient.connectWithSigner(
    rpcURL,
    offlineSigner,
    {
      registry: registry,
      aminoTypes: aTypes,
    }
  );

  return await client.signAndBroadcast(signer, msgs, fee, memo);
}

export async function signAndBroadcastGroupProposal(
  signer,
  msgs,
  fee,
  chainId,
  rpcURL,
  memo = ""
) {
  await window.keplr.enable(chainId);
  const offlineSigner =
    window.getOfflineSigner && window.keplr.getOfflineSigner(chainId);
  let registry = new Registry();

  const aTypes = new AminoTypes({
    ...MsgSubmitProposal,
  });

  defaultRegistryTypes.forEach((v) => {
    registry.register(v[0], v[1]);
  });

  registry.register(
    "/cosmos.group.v1.MsgSubmitProposal",
    MsgSubmitProposal
  );

  const client = await SigningStargateClient.connectWithSigner(
    rpcURL,
    offlineSigner,
    {
      registry: registry,
      aminoTypes: aTypes,
    }
  );

  return await client.signAndBroadcast(signer, msgs, fee, memo);
}

export async function signAndBroadcastUpdateGroupAdmin(
  signer,
  msgs,
  fee,
  chainId,
  rpcURL,
  memo = ""
) {
  await window.keplr.enable(chainId);
  const offlineSigner =
    window.getOfflineSigner && window.keplr.getOfflineSigner(chainId);
  let registry = new Registry();

  const aTypes = new AminoTypes({
    ...MsgUpdateGroupAdmin,
  });

  registry.register(
    "/cosmos.group.v1.MsgUpdateGroupAdmin",
    MsgUpdateGroupAdmin
  );

  const client = await SigningStargateClient.connectWithSigner(
    rpcURL,
    offlineSigner,
    {
      registry: registry,
      aminoTypes: aTypes,
    }
  );

  return await client.signAndBroadcast(signer, msgs, fee, memo);
}

export async function signAndBroadcastUpdateGroupMetadata(
  signer,
  msgs,
  fee,
  chainId,
  rpcURL,
  memo = ""
) {
  await window.keplr.enable(chainId);
  const offlineSigner =
    window.getOfflineSigner && window.keplr.getOfflineSigner(chainId);
  let registry = new Registry();

  const aTypes = new AminoTypes({
    ...MsgUpdateGroupMetadata,
  });

  registry.register(
    "/cosmos.group.v1.MsgUpdateGroupMetadata",
    MsgUpdateGroupMetadata
  );

  const client = await SigningStargateClient.connectWithSigner(
    rpcURL,
    offlineSigner,
    {
      registry: registry,
      aminoTypes: aTypes,
    }
  );

  return await client.signAndBroadcast(signer, msgs, fee, memo);
}

export async function signAndBroadcastClaimMsg(
  signer,
  msgs,
  fee,
  chainID,
  rpcURL,
  memo = ""
) {
  const aTypes = new AminoTypes({
    ...AirdropAminoConverter,
  });

  const result = await getKeplrWalletAmino(chainID);
  const wallet = result[0];
  const account = result[1];

  let registry = new Registry();
  defaultRegistryTypes.forEach((v) => {
    registry.register(v[0], v[1]);
  });

  registry.register("/passage3d.claim.v1beta1.MsgClaim", MsgClaim);

  const cosmJS = await SigningStargateClient.connectWithSigner(rpcURL, wallet, {
    registry: registry,
    aminoTypes: aTypes,
  });

  return await cosmJS.signAndBroadcast(account.address, msgs, fee, memo);
}

export async function signAndBroadcastAmino(
  msgs,
  fee,
  chainID,
  rpcURL,
  memo = ""
) {
  let result = await getKeplrWalletAmino(chainID);
  var wallet = result[0];
  var account = result[1];

  let registry = new Registry();
  defaultRegistryTypes.forEach((v) => {
    registry.register(v[0], v[1]);
  });

  registry.register("/passage3d.claim.v1beta1.MsgClaim", MsgClaim);

  console.log('feee--- ', fee)

  const cosmJS = await SigningStargateClient.connectWithSigner(rpcURL, wallet, {
    registry: registry,
  });

  

  return await cosmJS.signAndBroadcast(account.address, msgs, fee, memo);
}

export async function signAndBroadcastUnjail(
  msgs,
  fee,
  chainID,
  rpcURL,
  memo = ""
) {
  const aTypes = new AminoTypes({
    ...SlashingAminoConverter,
  });

  const result = await getKeplrWalletAmino(chainID);
  const wallet = result[0];
  const account = result[1];

  let registry = new Registry();
  defaultRegistryTypes.forEach((v) => {
    registry.register(v[0], v[1]);
  });

  registry.register("/cosmos.slashing.v1beta1.MsgUnjail", MsgUnjail);

  const cosmJS = await SigningStargateClient.connectWithSigner(rpcURL, wallet, {
    registry: registry,
    aminoTypes: aTypes,
  });

  return await cosmJS.signAndBroadcast(account.address, msgs, fee, memo);
}

export async function signAndBroadcastProto(msgs, fee, rpcURL) {
  const client = await SigningStargateClient.connect(rpcURL);


  const chainId = await client.getChainId();
  let result = await getKeplrWalletDirect(chainId);
  var wallet = result[0];
  var account = result[1];

  let registry = new Registry();
  defaultRegistryTypes.forEach((v) => {
    registry.register(v[0], v[1]);
  });

  registry.register("/cosmos.slashing.v1beta1.MsgUnjail", MsgUnjail);

  const signingClient = await SigningStargateClient.offline(wallet, {
    registry: registry,
  });

  const accountInfo = await client.getAccount(account.address);

  const signed = await signingClient.sign(account.address, msgs, fee, "", {
    accountNumber: accountInfo.accountNumber,
    chainId: chainId,
    sequence: accountInfo.sequence,
  });

  return await client.broadcastTx(
    Uint8Array.from(TxRaw.encode(signed).finish())
  );
}

export async function signAndBroadcastProtoFilterGrant(msgs, fee, rpcURL) {
  const client = await SigningStargateClient.connect(rpcURL);

  const chainId = await client.getChainId();
  let result = await getKeplrWalletDirect(chainId);
  var wallet = result[0];
  var account = result[1];


  let registry = new Registry();
  defaultRegistryTypes.forEach((v) => {
    registry.register(v[0], v[1]);
  });

  // registry.register("/cosmos.feegrant.v1beta1.MsgGrantAllowance", AllowedMsgAllowance);

  const signingClient = await SigningStargateClient.offline(wallet, {
    registry: registry,
  });

  const accountInfo = await client.getAccount(account.address);

  const signed = await signingClient.sign(account.address, msgs, fee, "", {
    accountNumber: accountInfo.accountNumber,
    chainId: chainId,
    sequence: accountInfo.sequence,
  });

  return await client.broadcastTx(
    Uint8Array.from(TxRaw.encode(signed).finish())
  );
}


export function fee(coinMinimalDenom, amount, gas = 280000, feeGranter = null) {
  return {
    amount: [{ amount: String(amount), denom: coinMinimalDenom }],
    gas: String(gas),
    granter: feeGranter,
    payer: feeGranter
  };
}

export async function getKeplrWalletAmino(chainID) {
  await window.keplr.enable(chainID);
  const offlineSigner = window.getOfflineSignerOnlyAmino(chainID);
  const accounts = await offlineSigner.getAccounts();
  return [offlineSigner, accounts[0]];
}

export async function getKeplrWalletDirect(chainID) {
  await window.keplr.enable(chainID);
  const offlineSigner = window.getOfflineSigner(chainID);
  const accounts = await offlineSigner.getAccounts();
  return [offlineSigner, accounts[0]];
}

export function isKeplrInstalled() {
  if (window.keplr === undefined) {
    return false;
  }
  return window?.keplr && window?.getOfflineSigner == null ? false : true;
}
