import { axiosGetRequestWrapper } from '@/utils/RequestWrapper';
import { useState } from 'react';

const useGetPubkey = () => {
  const [pubkeyLoading, setPubkeyLoading] = useState(false);
  const getPubkey = async (address: string, baseURLs: string[]) => {
    try {
      setPubkeyLoading(true);
      const { status, data } = await axiosGetRequestWrapper(
        baseURLs,
        `/cosmos/auth/v1beta1/accounts/${address}`,
        2
      );

      if (status === 200) {
        return data.account.pub_key.key || '';
      } else {
        return '';
      }
    } catch (error) {
      console.log(error);
      return '';
    } finally {
      setPubkeyLoading(false);
    }
  };
  return {
    pubkeyLoading,
    getPubkey,
  };
};

export default useGetPubkey;
