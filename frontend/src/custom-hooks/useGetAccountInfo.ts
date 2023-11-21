import { useAppSelector } from './StateHooks';

export interface BasicAccountInfo {
  pubkey: string;
  sequence: string;
  accountNumber: string;
}
const useGetAccountInfo = (chainID: string) => {
  // todo: auth slice
  const pubkey = useAppSelector(
    (state) => state.wallet.networks[chainID].walletInfo.pubKey
  );
  const accountInfo: BasicAccountInfo = {
    pubkey,
    sequence: '-',
    accountNumber: '-',
  };
  return [accountInfo];
};

export default useGetAccountInfo;
