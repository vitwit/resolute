import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './StateHooks';
import {
  getAllValidators,
  getWitvalPolygonDelegatorsCount,
  getWitvalPolygonValidator,
} from '@/store/features/staking/stakeSlice';
import useGetAllChainsInfo from './useGetAllChainsInfo';
import { POLYGON_API, POLYGON_CONFIG } from '@/utils/constants';

const useInitAllValidator = () => {
  const networks = useAppSelector((state) => state.common.allNetworksInfo);
  const dispatch = useAppDispatch();
  const chainIDs = Object.keys(networks);
  const { getAllChainInfo } = useGetAllChainsInfo();

  useEffect(() => {
    chainIDs.forEach((chainID) => {
      const { restURLs } = getAllChainInfo(chainID);
      dispatch(
        getAllValidators({
          baseURLs: restURLs,
          chainID: chainID,
        })
      );
    });
  }, []);

  useEffect(() => {
    dispatch(
      getWitvalPolygonValidator({
        baseURL: POLYGON_API,
        id: 50,
      })
    );
    dispatch(
      getWitvalPolygonDelegatorsCount({
        baseURL: POLYGON_CONFIG.baseURL,
        id: 50,
      })
    );
  }, []);
};

export default useInitAllValidator;
