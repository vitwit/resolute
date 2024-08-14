import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch } from './StateHooks';
import {
  getGrantsByMe,
  getGrantsToMe,
} from '@/store/features/authz/authzSlice';
import useGetChainInfo from './useGetChainInfo';

const useInitAuthz = ({ chainIDs, shouldFetch }: { chainIDs: string[], shouldFetch: boolean; }) => {
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const networksCount = useMemo(() => chainIDs?.length, [chainIDs]);
  const [dataFetched, setDataFetched] = useState(false);
  const fetchedChains = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (networksCount > 0 && !dataFetched && shouldFetch) {

      chainIDs.forEach((chainID) => {
        if (!fetchedChains.current[chainID]) {
          const { address, baseURL, restURLs } = getChainInfo(chainID);
          const authzInputs = {
            baseURLs: restURLs,
            address,
            baseURL,
            chainID,
          };
          dispatch(getGrantsByMe(authzInputs));
          dispatch(getGrantsToMe(authzInputs));
          fetchedChains.current[chainID] = true;
        }

      });

      setDataFetched(true);
    }
  }, [chainIDs, networksCount, dataFetched, getChainInfo, dispatch]);
};

export default useInitAuthz;
