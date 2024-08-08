import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from './StateHooks';
import useGetChainInfo from './useGetChainInfo';
import {
  getGrantsByMe,
  getGrantsToMe,
} from '@/store/features/feegrant/feegrantSlice';

/**
 * This custom hook is used to dispatch the feegrantsByMe and feegrantsToMe
 *
 */
const useInitFeegrant = ({
  chainIDs,
  shouldFetch,
}: {
  chainIDs: string[];
  shouldFetch: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const networksCount = chainIDs.length;
  const [dataFetched, setDataFetched] = useState(false);
  const fetchedChains = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (networksCount > 0 && !dataFetched && shouldFetch) {
      let allFetched = true;

      chainIDs.forEach((chainID) => {
        if (!fetchedChains.current[chainID]) {
          const { address, baseURL, restURLs } = getChainInfo(chainID);
          const feegrantInputs = {
            baseURLs: restURLs,
            address,
            baseURL,
            chainID,
          };
          dispatch(getGrantsByMe(feegrantInputs));
          dispatch(getGrantsToMe(feegrantInputs));
          fetchedChains.current[chainID] = true; // Mark this chain as fetched
        }
        if (!fetchedChains.current[chainID]) {
          allFetched = false;
        }
      });

      if (allFetched) {
        setDataFetched(true);
      }
    }
  }, [chainIDs, networksCount, dataFetched, getChainInfo, dispatch]);

  return null;
};

export default useInitFeegrant;
