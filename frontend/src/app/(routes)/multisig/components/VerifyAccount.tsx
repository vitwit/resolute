import TopNav from '@/components/TopNav';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { verifyAccount } from '@/store/features/multisig/multisigSlice';
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
  return (
    <div className="verify-account relative">
      <div className="w-fit absolute top-6 right-6">
        <TopNav />
      </div>
      <Image src='/verify-illustration.png' height={290} width={400} alt="Verify Ownership" />
      <div className="text-[20px]">
        Please verify your account ownership to proceed.
      </div>
      <button
        className="verify-btn"
        onClick={() => {
          handleVerifyAccountEvent();
        }}
      >
        Verify Ownership
      </button>
    </div>
  );
};

export default VerifyAccount;
