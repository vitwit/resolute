import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './StateHooks';
import { RootState } from '@/store/store';
import { getAuthzBalances, getBalances } from '@/store/features/bank/bankSlice';
import useAddressConverter from './useAddressConverter';

const useInitBalances = ({ chainIDs }: { chainIDs: string[] }) => {
  const dispatch = useAppDispatch();
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const authzAddress = useAppSelector((state) => state.authz.authzAddress);
  const { convertAddress } = useAddressConverter();
  
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

  useEffect(() => {
    if (authzAddress !== '') {
      chainIDs.forEach((chainID) => {
        if (networks.hasOwnProperty(chainID)) {
          const allChainInfo = networks[chainID];
          const chainInfo = allChainInfo.network;
          const address = convertAddress(chainID, authzAddress);
          const basicChainInputs = {
            baseURL: chainInfo.config.rest,
            address,
            chainID,
          };
          dispatch(getAuthzBalances(basicChainInputs));
        }
      });
    }
  }, [chainIDs, authzAddress]);
};

export default useInitBalances;
