import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CustomSubmitButton from '@/components/CustomButton';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { multiTxns } from '@/store/features/bank/bankSlice';
import { TxStatus } from '@/types/enums';
import {
  setChangeNetworkDialogOpen,
  setError,
} from '@/store/features/common/commonSlice';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { Box } from '@mui/material';
import { ALL_NETWORKS_GRADIENT, ALL_NETWORKS_ICON } from '@/utils/constants';
import Image from 'next/image';
import { shortenName } from '@/utils/util';
import Messages from '../Messages';
import MemoField from '../single-send/MemoField';
import AmountSummary from './AmountSummary';
import AddMessages from './AddMessages';
import { get } from 'lodash';
import { ALERT_ICON } from '@/constants/image-names';
import TxnLoading from '../txn-loading/TxnLoading';
import { getTotalAmount } from '@/utils/denom';

const MultiSend = ({ chainID }: { chainID: string }) => {
  const dispatch = useAppDispatch();
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const denomInfo = getDenomInfo(chainID);

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [chainLogo, setChainLogo] = useState(ALL_NETWORKS_ICON);
  const [chainGradient, setChainGradient] = useState('');

  const txPendingStatus = useAppSelector((state) => state.bank.tx.status);
  const selectedNetwork = useAppSelector(
    (state) => state.common.selectedNetwork
  );
  const allNetworks = useAppSelector((state) => state.common.allNetworksInfo);
  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);

  useEffect(() => {
    if (txPendingStatus === TxStatus.IDLE) {
      setMsgs([]);
    }
  }, [txPendingStatus]);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      memo: '',
    },
  });

  const addMsgs = (msgs: Msg[]) => {
    setMsgs((prev) => [...prev, ...msgs]);
  };

  const onDelete = (index: number) => {
    setMsgs((msgs) => {
      return [...msgs.slice(0, index), ...msgs.slice(index + 1, msgs.length)];
    });
  };

  const onDeleteAll = () => {
    setMsgs([]);
  };

  const onSubmit = (data: { memo: string }) => {
    if (txPendingStatus === TxStatus.PENDING) {
      dispatch(
        setError({
          type: 'error',
          message: 'A transaction is still pending..',
        })
      );
      return;
    }
    if (msgs.length === 0) {
      dispatch(
        setError({
          type: 'error',
          message: 'No transactions found',
        })
      );

      return;
    }
    const txnInputs: MultiTxnsInputs = {
      basicChainInfo: getChainInfo(chainID),
      msgs,
      memo: data.memo,
      denom: denomInfo.minimalDenom,
      feegranter: '',
    };
    dispatch(multiTxns(txnInputs));
  };

  const changeNetwork = () => {
    dispatch(setChangeNetworkDialogOpen({ open: true, showSearch: false }));
  };

  const txnLoading = txPendingStatus === TxStatus.PENDING;

  useEffect(() => {
    if (selectedNetwork.chainName && isWalletConnected) {
      const chainID = nameToChainIDs[selectedNetwork.chainName];
      setChainLogo(allNetworks[chainID].logos.menu);
      setChainGradient(allNetworks[chainID].config.theme.gradient);
    } else {
      setChainLogo(ALL_NETWORKS_ICON);
    }
  }, [selectedNetwork, isWalletConnected]);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-10 justify-between items-center">
      <div
        className={`w-[600px] md:min-w-[550px] ${txnLoading ? 'opacity-50' : ''}`}
      >
        <div className="single-send-box">
          <Box
            sx={{
              background: chainGradient || ALL_NETWORKS_GRADIENT,
            }}
            className="select-network"
          >
            <div
              onClick={() => changeNetwork()}
              className="flex items-center gap-2 cursor-pointer w-fit"
            >
              <Image className='rounded-full' src={chainLogo} height={40} width={40} alt="" />
              <div className="text-[18px] font-bold capitalize">
                {shortenName(selectedNetwork.chainName, 15) || 'All Networks'}
              </div>
              <Image src="/drop-down-icon.svg" height={24} width={24} alt="" />
            </div>
          </Box>
          <div className="py-10 px-6 flex flex-col justify-between gap-6 min-h-[630px]">
            <form
              className={`flex flex-col justify-between ${msgs?.length ? 'gap-6' : 'gap-10'}`}
              onSubmit={handleSubmit(onSubmit)}
            >
              <AddMessages addMsgs={addMsgs} chainID={chainID} msgs={msgs} />
              <div className="space-y-2">
                <div className="secondary-text">Enter Memo</div>
                <MemoField control={control} />
              </div>
              {msgs?.length ? (
                <div className="space-y-4">
                  <AmountSummary msgs={msgs} />
                  <Messages
                    msgs={msgs}
                    onDelete={onDelete}
                    onDeleteAll={onDeleteAll}
                  />
                </div>
              ) : null}
              <CustomSubmitButton
                pendingStatus={txPendingStatus === TxStatus.PENDING}
              />
            </form>
          </div>
        </div>
      </div>
      <MultiSendLoading chainID={chainID} msgs={msgs} />
    </div>
  );
};

export default MultiSend;

const MultiSendLoading = ({
  chainID,
  msgs,
}: {
  chainID: string;
  msgs: Msg[];
}) => {
  const { getChainInfo } = useGetChainInfo();
  const { address: fromAddress, chainLogo } = getChainInfo(chainID);
  const allNetworks = useAppSelector((state) => state.common.allNetworksInfo);
  const chainColor = get(allNetworks?.[chainID], 'config.theme.primaryColor');

  const { getOriginDenomInfo } = useGetChainInfo();
  const originDenomInfo = msgs?.length
    ? getOriginDenomInfo(msgs?.[0].value?.amount?.[0]?.denom || '')
    : null;
  const totalAmount = originDenomInfo
    ? getTotalAmount(originDenomInfo, msgs)
    : 0;
  const firstAddress = msgs?.[0]?.value?.toAddress || '';

  return (
    <div className="space-y-8 w-full max-w-[600px] md:px-10">
      <TxnLoading
        fromAddress={fromAddress}
        toChainLogo={chainLogo}
        fromChainColor={chainColor}
        toChainColor={chainColor}
        fromChainLogo={chainLogo}
        toAddress={firstAddress}
        msgsCount={msgs.length}
        isSingle={false}
      />
      <div className="px-6 py-4 rounded-2xl bg-[#FFFFFF14] text-[14px] space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-[2px]">
            <Image src={ALERT_ICON} width={24} height={24} alt="" />
            <div className="text-[#FFC13C]">Important</div>
          </div>
          <div className="text-[#FFFFFFad]">Multi Transfer</div>
        </div>
        <div className="flex gap-[26px]">
          <div></div>
          <div className="text-[#ffffff80]">
            {msgs?.length ? (
              <span>
                You are sending{' '}
                {totalAmount ? (
                  <span className="font-medium">
                    {totalAmount} {originDenomInfo?.originDenom}
                  </span>
                ) : (
                  <span>tokens</span>
                )}{' '}
                to <span className="font-medium">{msgs.length} addresses</span>
              </span>
            ) : (
              <>
                Provide all the required fields to continue with the
                transaction.
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
