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
import { COSMOS_CHAIN_ID } from '@/utils/constants';
import { getAddressByPrefix } from '@/utils/address';

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
  const cosmosAddresss = getAddressByPrefix(address, 'cosmos');
  useEffect(() => {
    if (verifyAccountRes.status === 'idle') {
      setAuthToken({
        chainID: COSMOS_CHAIN_ID,
        address: cosmosAddresss,
        signature: verifyAccountRes.token,
      });
      dispatch(setVerifyDialogOpen(false));
      dispatch(
        setError({
          type: 'success',
          message: 'Verified, You can now perform actions',
        })
      );
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

  const verifyOwnership = () => {
    dispatch(
      verifyAccount({ chainID: COSMOS_CHAIN_ID, address: cosmosAddresss })
    );
  };

  const isAccountVerified = () => {
    const verified = isVerified({
      chainID: COSMOS_CHAIN_ID,
      address: cosmosAddresss,
    });
    return verified;
  };
  return { verifyOwnership, isAccountVerified };
};

export default useVerifyAccount;
