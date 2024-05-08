import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { useState } from 'react';
import useGetChainInfo from './useGetChainInfo';
import { DUMMY_WALLET_MNEMONIC } from '@/utils/constants';

export const useDummyWallet = () => {
  const { getChainInfo } = useGetChainInfo();
  // const [dummyWallet, setDummyWallet] = useState<DirectSecp256k1HdWallet>();
  // const [dummyAddress, setDummyAddress] = useState('');
  const getDummyWallet = async ({ chainID }: { chainID: string }) => {
    console.log(DUMMY_WALLET_MNEMONIC);
    const { prefix } = getChainInfo(chainID);
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
      DUMMY_WALLET_MNEMONIC,
      {
        prefix,
      }
    );

    // setDummyWallet(wallet);

    const allAccounts = await wallet.getAccounts();
    const { address } = allAccounts[0];
    // setDummyAddress(address);
    console.log('==-=-==');
    console.log(wallet, address);

    return { dummyWallet: wallet, dummyAddress: address };
  };
  return { getDummyWallet };
};
