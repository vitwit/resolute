import { SigningStargateClient } from "@cosmjs/stargate";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";

export async function signAndBroadcastAmino(msgs, fee, memo = "", chainID, rpcURL) {
    let result = await getKeplrWalletAmino(chainID);
    var wallet = result[0]
    var account = result[1]
    const cosmJS = await SigningStargateClient.connectWithSigner(
        rpcURL,
        wallet,
    )

    return await cosmJS.signAndBroadcast(account.address, msgs, fee, memo);
}


export async function signAndBroadcastProto(msgs, fee, memo = "", rpcURL) {
        const client = await SigningStargateClient.connect(rpcURL)

        const chainId = await client.getChainId()
        let result = await getKeplrWalletDirect(chainId);
        var wallet = result[0]
        var account = result[1]
        const signingClient = await SigningStargateClient.offline(wallet)

        const accountInfo = await client.getAccount(account.address)

        const signed = await signingClient.sign(account.address, msgs, fee, memo, {
            accountNumber: accountInfo.accountNumber,
            chainId: chainId,
            sequence: accountInfo.sequence,
        });

        return await client.broadcastTx(Uint8Array.from(TxRaw.encode(signed).finish()));
}

export function fee(coinMinimalDenom, amount, gas = 250000, feePayer = "") {
    return { amount: [{ amount: String(amount), denom: coinMinimalDenom }], gas: String(gas), payer: feePayer };
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
    if (window.keplr === undefined) {return false}
    return window?.keplr && window?.getOfflineSigner == null ? false : true
}