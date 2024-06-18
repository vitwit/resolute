import { useAppDispatch } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import {
  setVerifyDialogOpen,
  signTransaction,
} from '@/store/features/multisig/multisigSlice';
import { Txn } from '@/types/multisig';
import React from 'react';
import useVerifyAccount from '@/custom-hooks/useVerifyAccount';
import CustomButton from '@/components/common/CustomButton';

interface SignTxnProps {
  address: string;
  txId: number;
  unSignedTxn: Txn;
  isMember: boolean;
  chainID: string;
}

const SignTxn: React.FC<SignTxnProps> = (props) => {
  const { address, isMember, unSignedTxn, chainID } = props;
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const { rpc, address: walletAddress } = getChainInfo(chainID);
  const { isAccountVerified } = useVerifyAccount({
    address: walletAddress,
  });

  const signTheTx = async () => {
    if (!isAccountVerified()) {
      dispatch(setVerifyDialogOpen(true));
      return;
    }
    dispatch(
      signTransaction({
        chainID,
        multisigAddress: address,
        rpc,
        unSignedTxn,
        walletAddress,
      })
    );
  };

  return (
    <CustomButton
      btnText="Sign"
      btnDisabled={!isMember}
      btnOnClick={() => {
        signTheTx();
      }}
      btnStyles="w-[115px]"
    />
  );
};

export default SignTxn;
