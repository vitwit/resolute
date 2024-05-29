import { useAppDispatch } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { setError } from '@/store/features/common/commonSlice';
import {
  setVerifyDialogOpen,
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

  const signTheTx = async () => {
    if (!isAccountVerified()) {
      dispatch(setVerifyDialogOpen(true));
      return;
    }
    setLoad(true);
    window.wallet.defaultOptions = {
      sign: {
        preferNoSetMemo: true,
        preferNoSetFee: true,
        disableBalanceCheck: true,
      },
    };
    try {
      const client = await SigningStargateClient.connect(rpc);

      const result = await getWalletAmino(chainID);
      const wallet = result[0];
      const signingClient = await SigningStargateClient.offline(wallet);

      const multisigAcc = await client.getAccount(address);
      if (!multisigAcc) {
        dispatch(
          setError({
            type: 'error',
            message: 'multisig account does not exist on chain',
          })
        );
        setLoad(false);
        return;
      }

      const signerData = {
        accountNumber: multisigAcc?.accountNumber,
        sequence: multisigAcc?.sequence,
        chainId: chainID,
      };

      const msgs = unSignedTxn?.messages || [];

      const { signatures } = await signingClient.sign(
        walletAddress,
        msgs,
        unSignedTxn?.fee || { amount: [], gas: '' },
        unSignedTxn?.memo || '',
        signerData
      );

      const payload = {
        signer: walletAddress,
        txId: txId || NaN,
        address: address,
        signature: toBase64(signatures[0]),
      };

      const authToken = getAuthToken(COSMOS_CHAIN_ID);
      dispatch(
        signTx({
          data: payload,
          // below object's data in passed as query params to api request
          queryParams: {
            address: walletAddress,
            signature: authToken?.signature || '',
          },
        })
      );
      setLoad(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setLoad(false);
        dispatch(setError({ type: 'error', message: error.message }));
      } else {
        dispatch(setError({ type: 'error', message: ERR_UNKNOWN }));
        console.log(ERR_UNKNOWN);
      }
    }
  };

  return (
    <CustomButton
      btnText="Sign"
      btnDisabled={load || !isMember}
      btnLoading={load}
      btnOnClick={() => {
        signTheTx();
      }}
      btnStyles="w-[115px]"
    />
  );
};

export default SignTxn;
