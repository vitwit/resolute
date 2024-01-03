import TopNav from '@/components/TopNav';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
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
  const dispatch = useAppDispatch();
  const handleVerifyAccountEvent = () => {
    dispatch(verifyAccount({ chainID, address: walletAddress }));
  };
  const loading = useAppSelector(
    (state: RootState) => state.multisig.verifyAccountRes.status
  );
  return (
    <div className="verify-account relative">
      <div className="w-fit absolute top-6 right-6">
        <TopNav />
      </div>
      <Image
        src="/verify-illustration.png"
        height={290}
        width={400}
        alt="Verify Ownership"
        draggable={false}
      />
      <div className="empty-screen-text">
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
