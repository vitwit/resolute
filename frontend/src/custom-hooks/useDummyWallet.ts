import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import useGetChainInfo from './useGetChainInfo';
import { DUMMY_WALLET_MNEMONIC } from '@/utils/constants';

export const useDummyWallet = () => {
  const { getChainInfo } = useGetChainInfo();
  const getDummyWallet = async ({ chainID }: { chainID: string }) => {
    const { prefix } = getChainInfo(chainID);
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
      DUMMY_WALLET_MNEMONIC,
      {
        prefix,
      }
    );
    const allAccounts = await wallet.getAccounts();
    const { address } = allAccounts[0];

    return { dummyWallet: wallet, dummyAddress: address };
  };
  return { getDummyWallet };
};
