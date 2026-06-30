import useGetChainInfo from './useGetChainInfo';
import { getAddressByPrefix } from '@/utils/address';

const useAddressConverter = () => {
  const { getChainInfo } = useGetChainInfo();
  const convertAddress = (chainID: string, address: string) => {
    const { prefix } = getChainInfo(chainID);
    return getAddressByPrefix(address, prefix);
  };
  return { convertAddress };
};

export default useAddressConverter;
