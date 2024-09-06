import { useEffect } from 'react';
import { useAppDispatch } from './StateHooks';
import {
  getWitvalOasisDelegations,
  getWitvalPolygonDelegatorsCount,
  getWitvalPolygonValidator,
} from '@/store/features/staking/stakeSlice';
import { OASIS_CONFIG, POLYGON_API, POLYGON_CONFIG } from '@/utils/constants';

const useInitAllValidator = () => {
  const dispatch = useAppDispatch();

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
