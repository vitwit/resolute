import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { setError } from '@/store/features/common/commonSlice';
import {
  setVerifyDialogOpen,
  signTransaction,
  signTx,
} from '@/store/features/multisig/multisigSlice';
import { getWalletAmino } from '@/txns/execute';
import { Txn } from '@/types/multisig';
import { getAuthToken } from '@/utils/localStorage';
import { SigningStargateClient } from '@cosmjs/stargate';
import { toBase64 } from '@cosmjs/encoding';
import React, { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { ERR_UNKNOWN } from '@/utils/errors';
import useVerifyAccount from '@/custom-hooks/useVerifyAccount';
import { COSMOS_CHAIN_ID } from '@/utils/constants';
import CustomButton from '@/components/common/CustomButton';
import { TxStatus } from '@/types/enums';

interface SignTxnProps {
  address: string;
  txId: number;
  unSignedTxn: Txn;
  isMember: boolean;
  chainID: string;
}

declare let window: WalletWindow;

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
