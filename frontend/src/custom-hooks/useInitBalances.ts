import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './StateHooks';
import { RootState } from '@/store/store';
import { getBalances } from '@/store/features/bank/bankSlice';

const useInitBalances = ({ chainIDs }: { chainIDs: string[] }) => {
  const dispatch = useAppDispatch();
  const networks = useAppSelector((state: RootState) => state.wallet.networks);

  useEffect(() => {
    chainIDs.forEach((chainID) => {
      if (networks.hasOwnProperty(chainID)) {
        const allChainInfo = networks[chainID];
        const chainInfo = allChainInfo.network;
        const address = allChainInfo?.walletInfo?.bech32Address;
        const basicChainInputs = {
          baseURL: chainInfo.config.rest,
          address,
          chainID,
        };
        dispatch(getBalances(basicChainInputs));
      }
    });
  }, [chainIDs]);
};

export default useInitBalances;
