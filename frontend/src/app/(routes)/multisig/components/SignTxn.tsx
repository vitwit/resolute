import { useAppDispatch } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { setError } from '@/store/features/common/commonSlice';
import { signTx } from '@/store/features/multisig/multisigSlice';
import { getWalletAmino } from '@/txns/execute';
import { Txn } from '@/types/multisig';
import { getAuthToken } from '@/utils/localStorage';
import { SigningStargateClient } from '@cosmjs/stargate';
import { toBase64 } from '@cosmjs/encoding';
import React, { useState } from 'react';
import { CircularProgress } from '@mui/material';

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

  const signTheTx = async () => {
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

      const authToken = getAuthToken(chainID);
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
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      setLoad(false);
      dispatch(setError({ type: 'error', message: error.message }));
    }
  };

  return (
    <button
      className={
        isMember ? 'sign-broadcast-btn' : 'sign-broadcast-btn btn-disabled'
      }
      onClick={() => {
        signTheTx();
      }}
      disabled={!isMember}
    >
      {load ? <CircularProgress size={24} /> : 'Sign'}
    </button>
  );
};

export default SignTxn;
