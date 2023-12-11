import { AddressPubkey } from '@/types/multisig';
import { createMultisigThresholdPubkey, pubkeyToAddress } from '@cosmjs/amino';

export const isValidPubKey = (pubKey: string): boolean => {
  try {
    pubkeyToAddress(
      {
        type: 'tendermint/PubKeySecp256k1',
        value: pubKey,
      },
      'test'
    );
  } catch (error) {
    return false;
  }
  return true;
};

export const generateMultisigAccount = (
  pubKeysArr: string[],
  threshold: number,
  addressPrefix: string
): MultisigAccountI => {
  const pubkeys = pubKeysArr.map((compressedPubkey) => {
    return {
      type: 'tendermint/PubKeySecp256k1',
      value: compressedPubkey,
    };
  });

  const multisigPubkey = createMultisigThresholdPubkey(pubkeys, threshold);
  const multisigAddress = pubkeyToAddress(multisigPubkey, addressPrefix);

  const pubkeysReq = [];
  for (let i = 0; i < multisigPubkey.value.pubkeys.length; i++) {
    pubkeysReq.push({
      address: pubkeyToAddress(multisigPubkey.value.pubkeys[i], addressPrefix),
      pubkey: multisigPubkey.value.pubkeys[i],
    });
  }

  return {
    address: multisigAddress,
    pubkeys: pubkeysReq,
    threshold: threshold,
  };
};

export interface MultisigAccountI {
  address: string;
  pubkeys: AddressPubkey[];
  threshold: number;
}
