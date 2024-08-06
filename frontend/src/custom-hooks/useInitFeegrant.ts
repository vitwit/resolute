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
const useInitFeegrant = ({ chainIDs }: { chainIDs: string[] }) => {
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
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
          const { address, baseURL, restURLs } = getChainInfo(chainID);
          const feegrantInputs = {
            baseURLs: restURLs,
            address,
            baseURL,
            chainID,
          };
          dispatch(getGrantsByMe(feegrantInputs));
          dispatch(getGrantsToMe(feegrantInputs));
        }
      });
      if (allChainsFetched) {
        setDataFetched(true);
      }
    }
  }, [chainIDs, networksCount]);
};

export default useInitFeegrant;
