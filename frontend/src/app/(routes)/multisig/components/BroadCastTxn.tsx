import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { setError } from '@/store/features/common/commonSlice';
import {
  resetUpdateTxnState,
  updateTxn,
} from '@/store/features/multisig/multisigSlice';
import { RootState } from '@/store/store';
import { getWalletAmino } from '@/txns/execute';
import { MultisigAddressPubkey, Pubkey, Txn } from '@/types/multisig';
import { getAuthToken } from '@/utils/localStorage';
import { NewMultisigThresholdPubkey } from '@/utils/util';
import { SigningStargateClient, makeMultisignedTx } from '@cosmjs/stargate';
import { fromBase64 } from '@cosmjs/encoding';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import React, { useEffect, useState } from 'react';
import { MultisigTxStatus } from '@/types/enums';
import { FAILED_TO_BROADCAST_ERROR } from '@/utils/errors';
import { CircularProgress } from '@mui/material';
import { CosmjsOfflineSigner } from '@leapwallet/cosmos-snap-provider';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';

interface BroadCastTxnProps {
  txn: Txn;
  multisigAddress: string;
  threshold: number;
  pubKeys: MultisigAddressPubkey[];
  chainID: string;
  isMember: boolean;
}

const BroadCastTxn: React.FC<BroadCastTxnProps> = (props) => {
  const { txn, multisigAddress, pubKeys, threshold, chainID, isMember } = props;
  const dispatch = useAppDispatch();
  const [load, setLoad] = useState(false);
  const { getChainInfo } = useGetChainInfo();
  const { rpc, address: walletAddress } = getChainInfo(chainID);

  const updateTxnRes = useAppSelector(
    (state: RootState) => state.multisig.updateTxnRes
  );

  useEffect(() => {
    if (updateTxnRes.status === 'rejected') {
      dispatch(
        setError({
          type: 'error',
          message: updateTxnRes?.error || FAILED_TO_BROADCAST_ERROR,
        })
      );
    }
  }, [updateTxnRes]);

  useEffect(() => {
    return () => {
      dispatch(resetUpdateTxnState());
    };
  }, []);

  const broadcastTxn = async () => {
    setLoad(true);
    const authToken = getAuthToken(chainID);
    const queryParams = {
      address: walletAddress,
      signature: authToken?.signature || '',
    };

    if (localStorage.getItem('WALLET_NAME') === 'metamask') {
      try {
        const offlineSigner = new CosmjsOfflineSigner(chainID);
        const rpcEndpoint = rpc || ''
        let client;
        try {
          client = await SigningCosmWasmClient.connectWithSigner(
            rpcEndpoint,
            offlineSigner
          );

          const client1 = await SigningStargateClient.connect(rpc);

          const multisigAcc = await client1.getAccount(multisigAddress);
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

          console.log('multisig details============', multisigAcc, pubKeys)

          const mapData = pubKeys || [];
          let pubkeys_list: Pubkey[] = [];

          pubkeys_list = mapData.map((p) => {
            const parsed = p?.pubkey;
            const obj = {
              type: parsed?.type,
              value: parsed?.value,
            };
            return obj;
          });

          const multisigThresholdPK = NewMultisigThresholdPubkey(
            pubkeys_list,
            `${threshold}`
          );

          const txBody = {
            typeUrl: '/cosmos.tx.v1beta1.TxBody',
            value: {
              messages: txn.messages,
              memo: txn.memo,
            },
          };

          const walletAmino = await getWalletAmino(chainID);
          const offlineClient = await SigningStargateClient.offline(walletAmino[0]);
          const txBodyBytes = offlineClient.registry.encode(txBody);

          const signedTx = makeMultisignedTx(
            multisigThresholdPK,
            multisigAcc.sequence,
            txn?.fee,
            txBodyBytes,
            new Map(
              txn?.signatures.map((s) => [s.address, fromBase64(s.signature)])
            )
          );

          console.log('signed Tx---- ', signedTx, multisigThresholdPK, multisigAcc?.sequence, txn?.signatures)

          try {
            const result = await client.broadcastTx(
              Uint8Array.from(TxRaw.encode(signedTx).finish())
            );
            console.log('broadcast completed===== ', result)
          } catch (error) {
            console.log('Error while broadcast', error)
          }
         

          setLoad(false);

          // if (result.code === 0) {
          //   dispatch(
          //     updateTxn({
          //       queryParams: queryParams,
          //       data: {
          //         txId: txn?.id,
          //         address: multisigAddress,
          //         body: {
          //           status: MultisigTxStatus.SUCCESS,
          //           hash: result?.transactionHash || '',
          //           error_message: '',
          //         },
          //       },
          //     })
          //   );
          // } else {
          //   dispatch(
          //     setError({
          //       type: 'error',
          //       message: result?.rawLog || FAILED_TO_BROADCAST_ERROR,
          //     })
          //   );
          //   dispatch(
          //     updateTxn({
          //       queryParams: queryParams,
          //       data: {
          //         txId: txn.id,
          //         address: multisigAddress,
          //         body: {
          //           status: MultisigTxStatus.FAILED,
          //           hash: result?.transactionHash || '',
          //           error_message: result?.rawLog || FAILED_TO_BROADCAST_ERROR,
          //         },
          //       },
          //     })
          //   );
          // }


        } catch (error) {
          console.log('error connect with signer', error)
        }
      } catch (error) {
        console.log('error in sign and broadcast', error)
      }
      // const client = await SigningStargateClient.connect(rpc);

      // const result = await getWalletAmino(chainID);
      // console.log('result============', result)
      // const wallet = result[0];
      // const signingClient = await SigningStargateClient.connectWithSigner(rpc, wallet);

      // const multisigAcc = await client.getAccount(address);
      // if (!multisigAcc) {
      //   dispatch(
      //     setError({
      //       type: 'error',
      //       message: 'multisig account does not exist on chain',
      //     })
      //   );
      //   setLoad(false);
      //   return;
      // }

      // const signerData = {
      //   accountNumber: multisigAcc?.accountNumber,
      //   sequence: multisigAcc?.sequence,
      //   chainId: chainID,
      // };

      // console.log('signer data============', signerData)

      // const msgs = unSignedTxn?.messages || [];
      // let payload;
      // try {

      //   const { signatures } = await signingClient.sign(
      //     walletAddress,
      //     msgs,
      //     unSignedTxn?.fee || { amount: [], gas: '' },
      //     unSignedTxn?.memo || '',
      //     signerData
      //   );


      // } catch (error) {
      //   console.log('error in singing', error)
      // }

    } else {

      try {
        const client = await SigningStargateClient.connect(rpc);

        const multisigAcc = await client.getAccount(multisigAddress);
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

        const mapData = pubKeys || [];
        let pubkeys_list: Pubkey[] = [];

        pubkeys_list = mapData.map((p) => {
          const parsed = p?.pubkey;
          const obj = {
            type: parsed?.type,
            value: parsed?.value,
          };
          return obj;
        });

        const multisigThresholdPK = NewMultisigThresholdPubkey(
          pubkeys_list,
          `${threshold}`
        );

        const txBody = {
          typeUrl: '/cosmos.tx.v1beta1.TxBody',
          value: {
            messages: txn.messages,
            memo: txn.memo,
          },
        };

        const walletAmino = await getWalletAmino(chainID);
        const offlineClient = await SigningStargateClient.offline(walletAmino[0]);
        const txBodyBytes = offlineClient.registry.encode(txBody);

        const signedTx = makeMultisignedTx(
          multisigThresholdPK,
          multisigAcc.sequence,
          txn?.fee,
          txBodyBytes,
          new Map(
            txn?.signatures.map((s) => [s.address, fromBase64(s.signature)])
          )
        );

        const result = await client.broadcastTx(
          Uint8Array.from(TxRaw.encode(signedTx).finish())
        );

        setLoad(false);
        if (result.code === 0) {
          dispatch(
            updateTxn({
              queryParams: queryParams,
              data: {
                txId: txn?.id,
                address: multisigAddress,
                body: {
                  status: MultisigTxStatus.SUCCESS,
                  hash: result?.transactionHash || '',
                  error_message: '',
                },
              },
            })
          );
        } else {
          dispatch(
            setError({
              type: 'error',
              message: result?.rawLog || FAILED_TO_BROADCAST_ERROR,
            })
          );
          dispatch(
            updateTxn({
              queryParams: queryParams,
              data: {
                txId: txn.id,
                address: multisigAddress,
                body: {
                  status: MultisigTxStatus.FAILED,
                  hash: result?.transactionHash || '',
                  error_message: result?.rawLog || FAILED_TO_BROADCAST_ERROR,
                },
              },
            })
          );
        }
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      } catch (error: any) {
        setLoad(false);
        dispatch(
          setError({
            type: 'error',
            message: error?.message || FAILED_TO_BROADCAST_ERROR,
          })
        );

        dispatch(
          updateTxn({
            queryParams: queryParams,
            data: {
              txId: txn?.id,
              address: multisigAddress,
              body: {
                status: MultisigTxStatus.FAILED,
                hash: '',
                error_message: error?.message || FAILED_TO_BROADCAST_ERROR,
              },
            },
          })
        );
      }

    }
  };
  return (
    <button
      className={
        isMember ? 'sign-broadcast-btn' : 'sign-broadcast-btn btn-disabled'
      }
      onClick={() => {
        broadcastTxn();
      }}
      disabled={load || !isMember}
    >
      {load ? (
        <CircularProgress size={20} sx={{ color: 'white' }} />
      ) : (
        'Broadcast'
      )}
    </button>
  );
};

export default BroadCastTxn;
