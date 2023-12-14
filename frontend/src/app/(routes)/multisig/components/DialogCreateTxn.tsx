import {
  CLOSE_ICON_PATH,
  DELEGATE_TYPE_URL,
  MULTISIG_TX_TYPES,
  REDELEGATE_TYPE_URL,
  SEND_TYPE_URL,
  UNDELEGATE_TYPE_URL,
} from '@/utils/constants';
import {
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Send from './txns/Send';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { parseBalance } from '@/utils/denom';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { paginationComponentStyles } from '../../staking/styles';
import { Controller, useForm } from 'react-hook-form';
import { getAuthToken } from '@/utils/localStorage';
import { fee } from '@/txns/execute';
import {
  createTxn,
  resetCreateTxnState,
} from '@/store/features/multisig/multisigSlice';
import Delegate from './txns/Delegate';
import { resetError, setError } from '@/store/features/common/commonSlice';
import { createTxnTextFieldStyles, selectTxnStyles } from '../styles';
import SendMessage from './msgs/SendMessage';
import DelegateMessage from './msgs/DelegateMessage';
import UndelegateMessage from './msgs/UndelegateMessage';
import RedelegateMessage from './msgs/RedelegateMessage';
import SelectTransactionType from './SelectTransactionType';

interface DialogCreateTxnProps {
  open: boolean;
  onClose: () => void;
  chainID: string;
  address: string;
  walletAddress: string;
}

const PER_PAGE = 5;

const DialogCreateTxn: React.FC<DialogCreateTxnProps> = (props) => {
  const { open, onClose, chainID, address, walletAddress } = props;
  const [isFileUpload, setIsFileUpload] = useState<boolean>(false);
  const [txType, setTxType] = useState('Send');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [slicedMsgs, setSlicedMsgs] = useState<Msg[]>([]);
  const [availableBalance, setAvailableBalance] = useState(0);

  const dispatch = useAppDispatch();

  const balance = useAppSelector(
    (state: RootState) => state.multisig.balance.balance
  );
  const createRes = useAppSelector(
    (state: RootState) => state.multisig.createTxnRes
  );

  const handleClose = () => {
    onClose();
  };

  const onSelect = (value: boolean) => {
    setIsFileUpload(value);
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setTxType(event.target.value);
  };

  const { getDenomInfo, getChainInfo } = useGetChainInfo();
  const { feeAmount } = getChainInfo(chainID);
  const { decimals, displayDenom, minimalDenom } = getDenomInfo(chainID);
  const currency = {
    coinDenom: displayDenom,
    coinDecimals: decimals,
    coinMinimalDenom: minimalDenom,
  };

  useEffect(() => {
    if (balance) {
      setAvailableBalance(
        parseBalance(
          [balance],
          currency.coinDecimals,
          currency.coinMinimalDenom
        )
      );
    }
  }, [balance]);

  useEffect(() => {
    if (messages.length < PER_PAGE) {
      setSlicedMsgs(messages);
    } else {
      setCurrentPage(1);
      setSlicedMsgs(messages?.slice(0, 1 * PER_PAGE));
    }
  }, [messages]);

  useEffect(() => {
    if (createRes?.status === 'rejected') {
      dispatch(
        setError({
          type: 'error',
          message: createRes?.error,
        })
      );
    } else if (createRes?.status === 'idle') {
      handleClose();
      dispatch(
        setError({
          type: 'success',
          message: 'Transaction created',
        })
      );
    }
  }, [createRes]);

  useEffect(() => {
    return () => {
      dispatch(resetError());
      dispatch(resetCreateTxnState());
    };
  }, []);

  const renderMessage = (
    msg: Msg,
    index: number,
    currency: Currency,
    onDelete: (index: number) => void
  ) => {
    switch (msg.typeUrl) {
      case SEND_TYPE_URL:
        return SendMessage({ msg, index, currency, onDelete });
      case DELEGATE_TYPE_URL:
        return DelegateMessage({ msg, index, currency, onDelete });
      case UNDELEGATE_TYPE_URL:
        return UndelegateMessage({ msg, index, currency, onDelete });
      case REDELEGATE_TYPE_URL:
        return RedelegateMessage({ msg, index, currency, onDelete });
      default:
        return '';
    }
  };

  const onDeleteMsg = (index: number) => {
    const arr = messages.filter((_, i) => i !== index);
    setMessages(arr);
  };

  const { handleSubmit, control } = useForm({
    defaultValues: {
      msgs: [],
      gas: 900000,
      memo: '',
      fees: feeAmount * 10 ** currency.coinDecimals,
    },
  });

  const onSubmit = (data: {
    msgs: never[];
    gas: number;
    memo: string;
    fees: number;
  }) => {
    const feeObj = fee(
      currency.coinMinimalDenom,
      data.fees.toString(),
      data.gas
    );
    const authToken = getAuthToken(chainID);
    dispatch(
      createTxn({
        data: {
          address: address,
          chain_id: chainID,
          messages: messages,
          fee: feeObj,
          memo: data.memo,
          gas: data.gas,
        },
        queryParams: {
          address: walletAddress,
          signature: authToken?.signature || '',
        },
      })
    );
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleClose()}
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: 'linear-gradient(90deg, #1F184E 27.66%, #8B3DA7 99.91%)',
        },
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] min-h-[610px] text-white">
          <div className="px-10 py-6 flex justify-end">
            <div
              onClick={() => {
                handleClose();
              }}
            >
              <Image
                className="cursor-pointer"
                src={CLOSE_ICON_PATH}
                width={24}
                height={24}
                alt="Close"
              />
            </div>
          </div>
          <div className="mt-6 mb-[72px] pl-6 pr-10 text-white flex h-full gap-6">
            <div className="flex-1 px-6 h-full border-r-[0.5px] border-[#ffffff2e]">
              <div className="text-[20px] font-bold">Create Transaction</div>
              <SelectTransactionType
                onSelect={onSelect}
                isFileUpload={isFileUpload}
              />
              {isFileUpload ? null : (
                <>
                  <FormControl
                    fullWidth
                    className="mb-6"
                    sx={{
                      '& .MuiFormLabel-root': {
                        display: 'none',
                      },
                    }}
                  >
                    <InputLabel className="text-white" id="tx-type">
                      Select Transaction
                    </InputLabel>
                    <Select
                      labelId="tx-type"
                      className="bg-[#FFFFFF1A] rounded-2xl"
                      id="tx-type"
                      value={txType}
                      label="Select Transaction"
                      onChange={(e) => handleTypeChange(e)}
                      sx={selectTxnStyles}
                    >
                      <MenuItem value={MULTISIG_TX_TYPES.send}>Send</MenuItem>
                      <MenuItem value={MULTISIG_TX_TYPES.delegate}>
                        Delegate
                      </MenuItem>
                      <MenuItem value={MULTISIG_TX_TYPES.redelegate}>
                        Redelegate
                      </MenuItem>
                      <MenuItem value={MULTISIG_TX_TYPES.undelegate}>
                        Undelegate
                      </MenuItem>
                    </Select>
                  </FormControl>
                  {txType === MULTISIG_TX_TYPES.send && (
                    <Send
                      address={address}
                      onSend={(payload) => {
                        setMessages([...messages, payload]);
                      }}
                      currency={currency}
                      availableBalance={availableBalance}
                    />
                  )}
                  {txType === MULTISIG_TX_TYPES.delegate && (
                    <Delegate
                      chainID={chainID}
                      address={address}
                      onDelegate={(payload) => {
                        setMessages([...messages, payload]);
                      }}
                      currency={currency}
                      availableBalance={availableBalance}
                    />
                  )}
                </>
              )}
            </div>
            <div className="flex-1 h-full">
              <div className="text-[20px] font-bold mb-6">Messages</div>
              {messages.length ? (
                <div className="flex flex-col justify-between gap-6">
                  <div>
                    <div className="space-y-4 min-h-[196px] pb-4 border-b-[0.5px] border-[#ffffff2e]">
                      {slicedMsgs.map((msg, index) => {
                        return (
                          <div key={index + PER_PAGE * (currentPage - 1)}>
                            {renderMessage(
                              msg,
                              index + PER_PAGE * (currentPage - 1),
                              currency,
                              onDeleteMsg
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {messages.length > 0 ? (
                      <div className="mt-2 flex justify-end">
                        <Pagination
                          sx={paginationComponentStyles}
                          count={Math.ceil(messages.length / PER_PAGE)}
                          shape="circular"
                          onChange={(_, v) => {
                            setCurrentPage(v);
                            setSlicedMsgs(
                              messages?.slice((v - 1) * PER_PAGE, v * PER_PAGE)
                            );
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-4">
                      <Controller
                        name="gas"
                        control={control}
                        rules={{ required: 'Gas is required' }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            className="bg-[#FFFFFF1A] rounded-2xl mb-6"
                            {...field}
                            sx={createTxnTextFieldStyles}
                            error={!!error}
                            size="small"
                            helperText={error ? error.message : null}
                            type="number"
                            required
                            placeholder="Gas"
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
                      <Controller
                        name="memo"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            className="bg-[#FFFFFF1A] rounded-2xl mb-6"
                            {...field}
                            sx={createTxnTextFieldStyles}
                            placeholder="Memo"
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

                    <button className="create-txn-form-btn mt-6">
                      {createRes.status === 'pending'
                        ? 'Please wait...'
                        : 'Create'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex justify-center mt-20">
                  <Image
                    src="/empty-messages-image.png"
                    width={200}
                    height={200}
                    alt="No Messages"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateTxn;
