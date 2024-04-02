import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useVerifyAccount from '@/custom-hooks/useVerifyAccount';
import { verifyAccount } from '@/store/features/multisig/multisigSlice';
import { RootState } from '@/store/store';
import { TxStatus } from '@/types/enums';
import { CircularProgress } from '@mui/material';
import Image from 'next/image';
import React from 'react';

interface VerifyAccountProps {
  chainID: string;
  walletAddress: string;
}

const VerifyAccount: React.FC<VerifyAccountProps> = (props) => {
  const { chainID, walletAddress } = props;
  const { verifyOwnership } = useVerifyAccount({
    chainID,
    address: walletAddress,
  });
  const handleVerifyAccountEvent = () => {
    verifyOwnership();
  };

  const loading = useAppSelector(
    (state: RootState) => state.multisig.verifyAccountRes.status
  );
  return (
    <div className="verify-account relative">
      <Image
        src="/verify-illustration.png"
        height={200}
        width={275}
        alt="Verify Ownership"
        draggable={false}
      />
      <div className="italic my-6">
        Please verify your account ownership to proceed.
      </div>
      <button
        className="primary-custom-btn verify-btn"
        onClick={() => {
          handleVerifyAccountEvent();
        }}
        disabled={loading === TxStatus.PENDING}
      >
        {loading === TxStatus.PENDING ? (
          <CircularProgress size={20} sx={{ color: 'white' }} />
        ) : (
          'Verify Ownership'
        )}
      </button>
    </div>
  );
};

export default VerifyAccount;
