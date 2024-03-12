import useGetChainInfo from './useGetChainInfo';
import { useAppDispatch, useAppSelector } from './StateHooks';
import { getAddressByPrefix } from '@/utils/address';
import { isFeegrantAvailable } from '@/utils/feegrant';
import { setError } from '@/store/features/common/commonSlice';

const useGetFeegranter = () => {
  const feegranter = useAppSelector((state) => state.feegrant.feegrantAddress);
  const chainFeegrants = useAppSelector((state) => state.feegrant.chains);
  const isFeegrantMode = useAppSelector(
    (state) => state.feegrant.feegrantModeEnabled
  );
  const { getChainInfo } = useGetChainInfo();
  const dispatch = useAppDispatch();

  const getFeegranter = (chainID: string, txnMsg: string) => {
    if (!isFeegrantMode) {
      return '';
    }
    const feegrants = chainFeegrants?.[chainID]?.grantsToMeAddressMapping;
    if (!feegranter?.length) {
      return '';
    }
    const { prefix } = getChainInfo(chainID);
    const feegranterAddress = getAddressByPrefix(feegranter, prefix);
    if (!feegrants?.[feegranterAddress]) {
      return '';
    }
    const feegrant = feegrants?.[feegranterAddress]?.[0];
    if (isFeegrantAvailable(feegrant, txnMsg)) {
      return feegranterAddress;
    } else {
      dispatch(
        setError({
          type: 'info',
          message:
            'You are not having feegrant to this transaction. Fee will be deducted from your account',
        })
      );
    }
    return '';
  };

  return { getFeegranter };
};

export default useGetFeegranter;
