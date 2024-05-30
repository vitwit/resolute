import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import {
  setVerifyDialogOpen,
  signTransaction,
} from '@/store/features/multisig/multisigSlice';
import { Txn } from '@/types/multisig';
import React, { useState } from 'react';
import useVerifyAccount from '@/custom-hooks/useVerifyAccount';
import CustomButton from '@/components/common/CustomButton';
import { TxStatus } from '@/types/enums';

interface SignTxnProps {
  address: string;
  txId: number;
  unSignedTxn: Txn;
  isMember: boolean;
  chainID: string;
}

const SignTxn: React.FC<SignTxnProps> = (props) => {
  const { address, isMember, txId, unSignedTxn, chainID } = props;
  const dispatch = useAppDispatch();
  const [load, setLoad] = useState(false);
  const { getChainInfo } = useGetChainInfo();
  const { rpc, address: walletAddress } = getChainInfo(chainID);
  const { isAccountVerified } = useVerifyAccount({
    address: walletAddress,
  });

  const createSignRes = useAppSelector((state) => state.multisig.signTxRes);

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
      btnDisabled={
        load || createSignRes.status === TxStatus.PENDING || !isMember
      }
      btnLoading={load || createSignRes.status === TxStatus.PENDING}
      btnOnClick={() => {
        signTheTx();
      }}
      btnStyles="w-[115px]"
    />
  );
};

export default SignTxn;
