import { SigningStargateClient, defaultRegistryTypes } from "@cosmjs/stargate";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { Registry } from '@cosmjs/proto-signing';
import { MsgClaim } from "./msg_claim";

export async function signAndBroadcastCustomMsg(signer, msgs, fee, chainId, rpcURL, memo="") {
    await window.keplr.enable(chainId);
    const offlineSigner = window.getOfflineSigner && window.keplr.getOfflineSigner(chainId);
        let registry = new Registry()
        defaultRegistryTypes.forEach((v) => {
            registry.register(v[0], v[1])
        })

        registry.register("/passage3d.claim.v1beta1.MsgClaim", MsgClaim)

        const client = await SigningStargateClient.connectWithSigner(
            rpcURL,
            offlineSigner,
            {
                registry: registry
            }
        );


        return await client.signAndBroadcast(
            signer,
            msgs,
            fee,
            memo,
        )
}

export async function signAndBroadcastAmino(msgs, fee, chainID, rpcURL, memo="") {
    let result = await getKeplrWalletAmino(chainID);
    var wallet = result[0]
    var account = result[1]

    let registry = new Registry()
    defaultRegistryTypes.forEach((v) => {
        registry.register(v[0], v[1])
    })

    registry.register("/passage3d.claim.v1beta1.MsgClaim", MsgClaim)

    const cosmJS = await SigningStargateClient.connectWithSigner(
        rpcURL,
        wallet,
        {
            registry: registry
        }
    )

    return await cosmJS.signAndBroadcast(account.address, msgs, fee, memo);
}


export async function signAndBroadcastProto(msgs, fee, rpcURL) {
    const client = await SigningStargateClient.connect(rpcURL)

    const chainId = await client.getChainId()
    let result = await getKeplrWalletDirect(chainId);
    var wallet = result[0]
    var account = result[1]
    const signingClient = await SigningStargateClient.offline(wallet)

    const accountInfo = await client.getAccount(account.address)

    const signed = await signingClient.sign(account.address, msgs, fee, "", {
        accountNumber: accountInfo.accountNumber,
        chainId: chainId,
        sequence: accountInfo.sequence,
    });

    return await client.broadcastTx(Uint8Array.from(TxRaw.encode(signed).finish()));
}

export function fee(coinMinimalDenom, amount, gas = 250000) {
    return { amount: [{ amount: String(amount), denom: coinMinimalDenom }], gas: String(gas) };
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
    if (window.keplr === undefined) { return false }
    return window?.keplr && window?.getOfflineSigner == null ? false : true
}