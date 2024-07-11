import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from './StateHooks';
import {
  getAllValidators,
  getWitvalOasisDelegations,
  getWitvalPolygonDelegatorsCount,
  getWitvalPolygonValidator,
} from '@/store/features/staking/stakeSlice';
import useGetAllChainsInfo from './useGetAllChainsInfo';
import { OASIS_CONFIG, POLYGON_API, POLYGON_CONFIG } from '@/utils/constants';

const useInitAllValidator = () => {
  const networks = useAppSelector((state) => state.common.allNetworksInfo);
  const dispatch = useAppDispatch();
  const chainIDs = Object.keys(networks);
  const { getAllChainInfo } = useGetAllChainsInfo();
  const networksCount = chainIDs.length;
  const [dataFetched, setDataFetched] = useState(false);
  const fetchedChains = useRef<{ [key: string]: boolean }>({});

  const allChainsFetched = chainIDs.every(
    (chainID) => fetchedChains.current[chainID]
  );

  useEffect(() => {
    if (networksCount > 0 && !dataFetched && !allChainsFetched) {
      chainIDs.forEach((chainID) => {
        if (!fetchedChains.current?.[chainID]) {
          const { restURLs } = getAllChainInfo(chainID);
          dispatch(
            getAllValidators({
              baseURLs: restURLs,
              chainID: chainID,
            })
          );
          fetchedChains.current[chainID] = true;
        }
      });
      if (allChainsFetched) {
        setDataFetched(true);
      }
    }
  }, [chainIDs, networksCount]);

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
    dispatch(
      getWitvalOasisDelegations({
        baseURL: OASIS_CONFIG.baseURL,
        operatorAddress: 'oasis1qzc687uuywnel4eqtdn6x3t9hkdvf6sf2gtv4ye9',
      })
    );
  }, []);
};

export default useInitAllValidator;
