import { createMultisigThresholdPubkey, pubkeyToAddress } from "@cosmjs/amino";

export const createMultiSig = async (pubKeysArr, threshold, addressPrefix, chainId) => {
    const pubkeys = pubKeysArr.map((compressedPubkey) => {
        return {
            type: "tendermint/PubKeySecp256k1",
            value: compressedPubkey,
        };
    });

    const multisigPubkey = createMultisigThresholdPubkey(pubkeys, Number(threshold));
    const multisigAddress = pubkeyToAddress(multisigPubkey, addressPrefix);

    // save multisig to fauna
    const multisig = {
        address: multisigAddress,
        pubkeyJSON: JSON.stringify(multisigPubkey),
        chainId,
    };

    localStorage.setItem('multisig', JSON.stringify(multisig))
}