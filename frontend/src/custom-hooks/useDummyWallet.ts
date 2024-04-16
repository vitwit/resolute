import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { useEffect, useState } from 'react';
import useGetChainInfo from './useGetChainInfo';
import { DUMMY_WALLET_MNEMONIC } from '@/utils/constants';

export const useDummyWallet = () => {
  const { getChainInfo } = useGetChainInfo();
  const [dummyWallet, setDummyWallet] = useState<DirectSecp256k1HdWallet>();
  const [dummyAddress, setDummyAddress] = useState('');
  const getDummyWallet = async ({ chainID }: { chainID: string }) => {
    console.log(DUMMY_WALLET_MNEMONIC)
    const { prefix } = getChainInfo(chainID);
    if (DUMMY_WALLET_MNEMONIC) {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        DUMMY_WALLET_MNEMONIC,
        {
          prefix,
        }
      );

      setDummyWallet(wallet);

      const { address } = (await wallet.getAccounts())[0];
      setDummyAddress(address);
    }
    return { dummyWallet, dummyAddress };
  };
  return { getDummyWallet };
};
