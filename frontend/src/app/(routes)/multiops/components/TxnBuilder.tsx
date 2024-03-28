'use client';
import React, { useEffect, useState } from 'react';
import SelectTransactionType from './SelectTransactionType';
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import {
  MULTIOPS_MSG_TYPES,
  MULTIOPS_NOTE,
  NO_MESSAGES_ILLUSTRATION,
} from '@/utils/constants';
import { selectTxnStyles, sendTxnTextFieldStyles } from '../styles';
import Send from './Messages/Send';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { parseBalance } from '@/utils/denom';
import { getBalances } from '@/store/features/bank/bankSlice';
import MessagesList from './MessagesList';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import {
  resetTx,
  txExecuteMultiMsg,
} from '@/store/features/multiops/multiopsSlice';
import { TxStatus } from '@/types/enums';
import Delegate from './Messages/Delegate';
import Undelegate from './Messages/Undelegate';
import Redelegate from './Messages/Redelegate';
import Vote from './Messages/Vote';
import Deposit from './Messages/Deposit';
import FileUpload from './FileUpload';
import { setError } from '@/store/features/common/commonSlice';
import {
  parseDelegateMsgsFromContent,
  parseDepositMsgsFromContent,
  parseReDelegateMsgsFromContent,
  parseSendMsgsFromContent,
  parseUnDelegateMsgsFromContent,
  parseVoteMsgsFromContent,
} from '@/utils/parseMsgs';
import SelectMsgType from './SelectMsgType';

const TxnBuilder = ({ chainID }: { chainID: string }) => {
  const dispatch = useAppDispatch();
  const [isFileUpload, setIsFileUpload] = useState<boolean>(false);
  const [msgType, setMsgType] = useState('Send');
  const [messages, setMessages] = useState<Msg[]>([]);
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const basicChainInfo = getChainInfo(chainID);
  const {
    address,
    baseURL,
    restURLs: baseURLs,
    feeAmount,
    prefix,
    rest,
    rpc,
  } = basicChainInfo;

  const txStatus = useAppSelector((state) => state.multiops.tx.status);

  const onSelect = (value: boolean) => {
    setMessages([]);
    setIsFileUpload(value);
  };
  const handleMsgTypeChange = (event: SelectChangeEvent<string>) => {
    setMsgType(event.target.value);
  };
  const balance = useAppSelector(
    (state) => state.bank.balances?.[chainID]?.list
  );
  const [availableBalance, setAvailableBalance] = useState(0);

  const { decimals, displayDenom, minimalDenom } = getDenomInfo(chainID);
  const currency = {
    coinDenom: displayDenom,
    coinDecimals: decimals,
    coinMinimalDenom: minimalDenom,
  };

  const onDeleteMsg = (index: number) => {
    const arr = messages.filter((_, i) => i !== index);
    setMessages(arr);
  };

  const { handleSubmit, control } = useForm({
    defaultValues: {
      gas: 900000,
      memo: '',
      fees: feeAmount * 10 ** currency.coinDecimals,
    },
  });

  const onSubmit = (data: { gas: number; memo: string; fees: number }) => {
    dispatch(
      txExecuteMultiMsg({
        basicChainInfo,
        aminoConfig: basicChainInfo.aminoConfig,
        denom: currency.coinMinimalDenom,
        feeAmount: data.fees,
        feegranter: '',
        memo: data.memo,
        msgs: messages,
        prefix,
        rest,
        rpc,
        gas: data.gas,
        address,
      })
    );
  };

  const onFileContents = (content: string, type: string) => {
    let isValid = false;
    switch (type) {
      case MULTIOPS_MSG_TYPES.send: {
        const [parsedTxns, error] = parseSendMsgsFromContent(address, content);
        if (error) {
          dispatch(
            setError({
              type: 'error',
              message: error,
            })
          );
        } else {
          setMessages((prev) => [...prev, ...parsedTxns]);
          isValid = true;
        }
        break;
      }
      case MULTIOPS_MSG_TYPES.delegate: {
        const [parsedTxns, error] = parseDelegateMsgsFromContent(
          address,
          content
        );
        if (error) {
          dispatch(
            setError({
              type: 'error',
              message: error,
            })
          );
        } else {
          setMessages((prev) => [...prev, ...parsedTxns]);
          isValid = true;
        }
        break;
      }
      case MULTIOPS_MSG_TYPES.redelegate: {
        const [parsedTxns, error] = parseReDelegateMsgsFromContent(
          address,
          content
        );
        if (error) {
          dispatch(
            setError({
              type: 'error',
              message: error,
            })
          );
        } else {
          setMessages((prev) => [...prev, ...parsedTxns]);
          isValid = true;
        }
        break;
      }
      case MULTIOPS_MSG_TYPES.undelegate: {
        const [parsedTxns, error] = parseUnDelegateMsgsFromContent(
          address,
          content
        );
        if (error) {
          dispatch(
            setError({
              type: 'error',
              message: error,
            })
          );
        } else {
          setMessages((prev) => [...prev, ...parsedTxns]);
          isValid = true;
        }
        break;
      }
      case MULTIOPS_MSG_TYPES.vote: {
        const [parsedTxns, error] = parseVoteMsgsFromContent(address, content);
        if (error) {
          dispatch(
            setError({
              type: 'error',
              message: error,
            })
          );
        } else {
          setMessages((prev) => [...prev, ...parsedTxns]);
          isValid = true;
        }
        break;
      }
      case MULTIOPS_MSG_TYPES.deposit: {
        const [parsedTxns, error] = parseDepositMsgsFromContent(
          address,
          content
        );
        if (error) {
          dispatch(
            setError({
              type: 'error',
              message: error,
            })
          );
        } else {
          setMessages((prev) => [...prev, ...parsedTxns]);
          isValid = true;
        }
        break;
      }
      default:
        setMessages([]);
    }
    return isValid;
  };

  useEffect(() => {
    if (balance) {
      setAvailableBalance(
        parseBalance(balance, currency.coinDecimals, currency.coinMinimalDenom)
      );
    }
  }, [balance]);

  useEffect(() => {
    if (address && chainID) {
      dispatch(
        getBalances({
          address,
          baseURL,
          baseURLs,
          chainID,
        })
      );
    }
  }, [address]);

  useEffect(() => {
    dispatch(resetTx());
  }, []);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="text-[18px]">Create Transaction</div>
          {/* TODO: Add description */}
          <div className="text-[14px] font-extralight">
            Multiops allows you to create single transaction with multiple
            messages of same or different type.
          </div>
        </div>
        <div className="border-b-[1px] border-[#ffffff33]">
          <SelectTransactionType
            onSelect={onSelect}
            isFileUpload={isFileUpload}
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex-1 flex gap-2">
          <div className="w-1/3 pr-4">
            {isFileUpload ? (
              <div className="flex flex-col h-full">
                <SelectMsgType
                  handleMsgTypeChange={handleMsgTypeChange}
                  msgType={msgType}
                />
                <FileUpload
                  onFileContents={onFileContents}
                  resetMessages={() => setMessages([])}
                  msgType={msgType}
                  messagesCount={messages.length}
                />
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <SelectMsgType
                  handleMsgTypeChange={handleMsgTypeChange}
                  msgType={msgType}
                />
                <div className="flex-1">
                  {msgType === MULTIOPS_MSG_TYPES.send ? (
                    <Send
                      address={address}
                      onSend={(payload) => {
                        setMessages([...messages, payload]);
                      }}
                      availableBalance={availableBalance}
                      currency={currency}
                      feeAmount={feeAmount}
                    />
                  ) : null}
                  {msgType === MULTIOPS_MSG_TYPES.delegate ? (
                    <Delegate
                      address={address}
                      availableBalance={availableBalance}
                      chainID={chainID}
                      currency={currency}
                      onDelegate={(payload) => {
                        setMessages([...messages, payload]);
                      }}
                      baseURLs={baseURLs}
                      feeAmount={feeAmount}
                    />
                  ) : null}
                  {msgType === MULTIOPS_MSG_TYPES.undelegate ? (
                    <Undelegate
                      address={address}
                      chainID={chainID}
                      currency={currency}
                      onUndelegate={(payload) => {
                        setMessages([...messages, payload]);
                      }}
                      baseURLs={baseURLs}
                      feeAmount={feeAmount}
                    />
                  ) : null}
                  {msgType === MULTIOPS_MSG_TYPES.redelegate ? (
                    <Redelegate
                      address={address}
                      chainID={chainID}
                      currency={currency}
                      onRedelegate={(payload) => {
                        setMessages([...messages, payload]);
                      }}
                      baseURLs={baseURLs}
                      feeAmount={feeAmount}
                    />
                  ) : null}
                  {msgType === MULTIOPS_MSG_TYPES.vote ? (
                    <Vote
                      address={address}
                      chainID={chainID}
                      currency={currency}
                      onVote={(payload) => {
                        setMessages([...messages, payload]);
                      }}
                    />
                  ) : null}
                  {msgType === MULTIOPS_MSG_TYPES.deposit ? (
                    <Deposit
                      address={address}
                      availableBalance={availableBalance}
                      chainID={chainID}
                      currency={currency}
                      onDeposit={(payload) => {
                        setMessages([...messages, payload]);
                      }}
                      feeAmount={feeAmount}
                    />
                  ) : null}
                </div>
              </div>
            )}
          </div>
          <div className="h-full w-[1px] bg-[#ffffff33]"></div>
          <div className="flex-1 pl-4">
            <div className="h-full">
              <div className="flex justify-between">
                <div className="font-extralight text-[14px]">
                  Messages {messages.length ? <>({messages.length})</> : null}
                </div>
                {messages.length ? (
                  <div
                    className="clear-all"
                    onClick={() => {
                      setMessages([]);
                    }}
                  >
                    Clear All
                  </div>
                ) : null}
              </div>
              <div className="h-full">
                {messages.length ? (
                  <div className="space-y-4">
                    <MessagesList
                      messages={messages}
                      currency={currency}
                      onDeleteMsg={onDeleteMsg}
                    />
                    <div>
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                        id="multiops-form"
                      >
                        <div className="flex gap-6">
                          <div className="flex-1 space-y-2">
                            <div className="text-[14px] font-extralight">
                              Enter Gas
                            </div>
                            <Controller
                              name="gas"
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  className="bg-[#FFFFFF0D]"
                                  {...field}
                                  sx={{
                                    ...sendTxnTextFieldStyles,
                                  }}
                                  placeholder="Enter gas"
                                  fullWidth
                                  InputProps={{
                                    sx: {
                                      input: {
                                        color: 'white',
                                        fontSize: '14px',
                                        padding: 2,
                                      },
                                    },
                                  }}
                                />
                              )}
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="text-[14px] font-extralight">
                              Enter Memo (optional)
                            </div>
                            <Controller
                              name="memo"
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  className="bg-[#FFFFFF0D]"
                                  {...field}
                                  sx={{
                                    ...sendTxnTextFieldStyles,
                                  }}
                                  placeholder="Enter memo"
                                  fullWidth
                                  InputProps={{
                                    sx: {
                                      input: {
                                        color: 'white',
                                        fontSize: '14px',
                                        padding: 2,
                                      },
                                    },
                                  }}
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div className="font-extralight text-[14px] italic w-[50%]">
                          {MULTIOPS_NOTE}
                        </div>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <Image
                      src={NO_MESSAGES_ILLUSTRATION}
                      width={200}
                      height={177}
                      alt="No Messages"
                      draggable={false}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
          <button
            type="submit"
            form="multiops-form"
            className="w-full text-[12px] font-medium primary-gradient rounded-lg h-10 flex justify-center items-center"
            disabled={txStatus === TxStatus.PENDING}
          >
            {txStatus === TxStatus.PENDING ? (
              <div className="flex-center-center gap-2">
                <CircularProgress size={12} sx={{ color: 'white' }} />
                <span>
                  Loading<span className="dots-flashing"></span>{' '}
                </span>
              </div>
            ) : (
              'Execute Transaction'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TxnBuilder;
