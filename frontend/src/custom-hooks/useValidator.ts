import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./StateHooks";
import { RootState } from '@/store/store';
import useGetChainInfo from "./useGetChainInfo";
import { getValidator } from "@/store/features/staking/stakeSlice";

const useValidator = () => {
  const dispatch = useAppDispatch();

  const isWalletConnected = useAppSelector((state: RootState) => state.wallet.connected);
  const { getChainInfo } = useGetChainInfo();
  const stakeData = useAppSelector((state: RootState) => state.staking.chains);

  const fetchValidator = useCallback((valoperAddress: string, chainID: string) => {
    if (isWalletConnected && valoperAddress && chainID) {
      const { restURLs } = getChainInfo(chainID);
      dispatch(getValidator({ baseURLs: restURLs, chainID, valoperAddress }));
    }
  }, []);

  const getValidatorDetails = useCallback((valoperAddress: string, chainID: string) => {
    return stakeData[chainID]?.validator[valoperAddress];
  }, [stakeData]);

  return {
    fetchValidator,
    getValidatorDetails,
  };
};

export default useValidator;
