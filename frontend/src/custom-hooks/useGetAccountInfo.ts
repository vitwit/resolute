import { useAppSelector } from './StateHooks';

export interface BasicAccountInfo {
  pubkey: string;
  sequence: string;
  accountNumber: string;
}
const useGetAccountInfo = (chainID: string) => {
  const authInfo = useAppSelector((state) => state.auth[chainID]);
  const sequence = authInfo?.account.sequence || '-';
  const accountNumber = authInfo?.account.account_number || '-';
  const pubkey = useAppSelector(
    (state) => state.wallet.networks?.[chainID]?.walletInfo?.pubKey
  );
  const accountInfo: BasicAccountInfo = {
    pubkey,
    sequence,
    accountNumber,
  };
  return [accountInfo];
};

export default useGetAccountInfo;
