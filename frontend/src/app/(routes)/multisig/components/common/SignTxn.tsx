import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import {
  setVerifyDialogOpen,
  signTransaction,
} from '@/store/features/multisig/multisigSlice';
import { Txn } from '@/types/multisig';
import React from 'react';
import useVerifyAccount from '@/custom-hooks/useVerifyAccount';
import CustomButton from '@/components/common/CustomButton';
import { useRouter } from 'next/navigation';

interface SignTxnProps {
  address: string;
  txId: number;
  unSignedTxn: Txn;
  isMember: boolean;
  chainID: string;
  isOverview?: boolean;
}

const SignTxn: React.FC<SignTxnProps> = (props) => {
  const { address, isMember, unSignedTxn, chainID, isOverview } = props;
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const { address: walletAddress, rpcURLs, chainName } = getChainInfo(chainID);
  const { isAccountVerified } = useVerifyAccount({
    address: walletAddress,
  });
  const router = useRouter();

  const txnsCount = useAppSelector((state) => state.multisig.txns.Count);
  const getCount = (option: string) => {
    let count = 0;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    txnsCount &&
      txnsCount.forEach((t: any) => {
        if (t?.computed_status?.toLowerCase() === option.toLowerCase()) {
          count = t?.count;
        }
      });

    return count;
  };
  const toBeBroadcastedCount = getCount('to-broadcast');

  const signTheTx = async () => {
    if (!isAccountVerified()) {
      dispatch(setVerifyDialogOpen(true));
      return;
    }
    dispatch(
      signTransaction({
        chainID,
        multisigAddress: address,
        unSignedTxn,
        walletAddress,
        rpcURLs,
        toBeBroadcastedCount,
      })
    );
  };

  return (
    <CustomButton
      btnText="Sign"
      btnDisabled={!isMember}
      btnOnClick={() => {
        if (isOverview) {
          router.push(`/multisig/${chainName}/${address}`);
        } else {
          signTheTx();
        }
      }}
      btnStyles="w-[115px]"
    />
  );
};

export default SignTxn;
