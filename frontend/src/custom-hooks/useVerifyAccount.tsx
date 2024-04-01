import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './StateHooks';
import {
  resetVerifyAccountRes,
  setVerifyDialogOpen,
  verifyAccount,
} from '@/store/features/multisig/multisigSlice';
import { setAuthToken } from '@/utils/localStorage';
import { setError } from '@/store/features/common/commonSlice';
import { isVerified } from '@/utils/util';

const useVerifyAccount = ({
  address,
  chainID,
}: {
  chainID: string;
  address: string;
}) => {
  const dispatch = useAppDispatch();
  const verifyAccountRes = useAppSelector(
    (state) => state.multisig.verifyAccountRes
  );
  useEffect(() => {
    if (verifyAccountRes.status === 'idle') {
      setAuthToken({
        chainID: chainID,
        address: address,
        signature: verifyAccountRes.token,
      });
      dispatch(setVerifyDialogOpen(false));
      dispatch(resetVerifyAccountRes());
    } else if (verifyAccountRes.status === 'rejected') {
      dispatch(
        setError({
          type: 'error',
          message: verifyAccountRes.error,
        })
      );
    }
  }, [verifyAccountRes]);

  const useVerifyAccount = (chainID: string, address: string) => {
    dispatch(verifyAccount({ chainID, address }));
  };

  const isAccountVerified = () => {
    const verified = isVerified({ chainID, address });
    return verified;
  };
  return { useVerifyAccount, isAccountVerified };
};

export default useVerifyAccount;
