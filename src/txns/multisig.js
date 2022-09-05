import { createMultisigThresholdPubkey, pubkeyToAddress } from "@cosmjs/amino";

export const isValidPubKey = (pubKey) => {
  try {
    pubkeyToAddress(
      {
        type: "tendermint/PubKeySecp256k1",
        value: pubKey,
      },
      "test"
    );
  } catch (error) {
    return false;
  }
  return true;
};

export const createMultisig = (
  pubKeysArr,
  threshold,
  addressPrefix,
  chainId
) => {
  const pubkeys = pubKeysArr.map((compressedPubkey) => {
    return {
      type: "tendermint/PubKeySecp256k1",
      value: compressedPubkey,
    };
  });

  const multisigPubkey = createMultisigThresholdPubkey(
    pubkeys,
    Number(threshold)
  );
  const multisigAddress = pubkeyToAddress(multisigPubkey, addressPrefix);

  multisigPubkey.value.pubkeys = multisigPubkey.value.pubkeys.map((pubkey) => {
    pubkey.address = pubkeyToAddress(pubkey, addressPrefix);
    return pubkey;
  });

  const multisig = {
    address: multisigAddress,
    pubkeyJSON: multisigPubkey,
    chainId,
  };

  return multisig;
};
