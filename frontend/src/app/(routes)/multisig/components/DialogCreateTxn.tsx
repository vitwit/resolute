import {
  CLOSE_ICON_PATH,
  DELEGATE_TYPE_URL,
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
import { shortenAddress } from '@/utils/util';
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

interface DialogCreateTxnProps {
  open: boolean;
  onClose: () => void;
  chainID: string;
  address: string;
  walletAddress: string;
}

interface SelectTransactionTypeProps {
  isFileUpload: boolean;
  onSelect: (value: boolean) => void;
}

interface RenderMsgProps {
  msg: Msg;
  onDelete: (index: number) => void;
  currency: Currency;
  index: number;
}

const PER_PAGE = 5;
const TYPE_SEND = 'Send';
const TYPE_DELEGATE = 'Delegate';
const TYPE_UNDELEGATE = 'Undelegate';
const TYPE_REDELEGATE = 'Redelegate';

const textFieldStyles = {
  '& .MuiTypography-body1': {
    color: 'white',
    fontSize: '12px',
    fontWeight: 200,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
};

const SelectTransactionType = ({
  isFileUpload,
  onSelect,
}: SelectTransactionTypeProps) => {
  return (
    <div className="my-6 flex gap-6 text-white">
      <div
        className="custom-radio-button-label"
        onClick={() => onSelect(false)}
      >
        <div className="custom-ratio-button">
          {!isFileUpload ? (
            <div className="custom-radio-button-checked"></div>
          ) : null}
        </div>
        <div className="text-[14px] font-medium">Add Manually</div>
      </div>
      <div className="custom-radio-button-label" onClick={() => onSelect(true)}>
        <div className="custom-ratio-button">
          {isFileUpload ? (
            <div className="custom-radio-button-checked"></div>
          ) : null}
        </div>
        <div className="text-[14px] font-medium">File Upload</div>
      </div>
    </div>
  );
};

const DialogCreateTxn = ({
  open,
  onClose,
  chainID,
  address,
  walletAddress,
}: DialogCreateTxnProps) => {
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
  const { feeAmount, feeCurrencies } = getChainInfo(chainID);
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
      case SEND_TYPE_URL: {
        return RenderSendMessage({ msg, index, currency, onDelete });
      }
      case DELEGATE_TYPE_URL:
        return RenderDelegateMessage({ msg, index, currency, onDelete });
      case UNDELEGATE_TYPE_URL:
        return RenderUnDelegateMessage({ msg, index, currency, onDelete });
      case REDELEGATE_TYPE_URL:
        return RenderReDelegateMessage({ msg, index, currency, onDelete });
      default:
        return '';
    }
  };

  const onDeleteMsg = (index: number) => {
    const arr = messages.filter((_, i) => i !== index);
    setMessages(arr);
  };

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      msgs: [],
      gas: 900000,
      memo: '',
      fees: feeAmount * 10 ** currency.coinDecimals,
    },
  });

  const onSubmit = (data: any) => {
    const feeObj = fee(currency.coinMinimalDenom, data.fees, data.gas);
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
                      sx={{
                        '& .MuiOutlinedInput-input': {
                          color: 'white',
                        },
                        '& .MuiOutlinedInput-root': {
                          padding: '0px !important',
                          border: 'none',
                        },
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none !important',
                        },
                        '& .MuiTypography-body1': {
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 200,
                        },
                      }}
                    >
                      <MenuItem value={TYPE_SEND}>Send</MenuItem>
                      <MenuItem value={TYPE_DELEGATE}>Delegate</MenuItem>
                      <MenuItem value={TYPE_REDELEGATE}>Redelegate</MenuItem>
                      <MenuItem value={TYPE_UNDELEGATE}>Undelegate</MenuItem>
                    </Select>
                  </FormControl>
                  {txType === 'Send' ? (
                    <Send
                      chainID={chainID}
                      address={address}
                      onSend={(payload) => {
                        setMessages([...messages, payload]);
                      }}
                      currency={currency}
                      availableBalance={availableBalance}
                    />
                  ) : null}
                  {txType === 'Delegate' ? (
                    <Delegate
                      chainID={chainID}
                      address={address}
                      onDelegate={(payload) => {
                        setMessages([...messages, payload]);
                      }}
                      currency={currency}
                      availableBalance={availableBalance}
                    />
                  ) : null}
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
                            sx={textFieldStyles}
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
                            sx={textFieldStyles}
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
                    <div>
                      <FeeComponent
                        onSetFeeChange={(v) => {
                          setValue(
                            'fees',
                            Number(v) * 10 ** currency.coinDecimals
                          );
                        }}
                        gasPriceStep={feeCurrencies[0].gasPriceStep}
                        coinDenom={currency.coinDenom}
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

export const RenderSendMessage = ({
  msg,
  index,
  currency,
  onDelete,
}: RenderMsgProps) => {
  return (
    <div className="flex justify-between items-center text-[14px] font-extralight">
      <div className="flex gap-2">
        <Image
          className="bg-[#FFFFFF1A] rounded-lg"
          src="/solid-arrow-icon.svg"
          height={24}
          width={24}
          alt=""
        />
        <div className="truncate max-w-[280px]">
          <span>Send&nbsp;</span>
          <span>
            {parseBalance(
              msg.value.amount,
              currency.coinDecimals,
              currency.coinMinimalDenom
            )}
            &nbsp;
            {currency.coinDenom}&nbsp;
          </span>
          <span>to&nbsp;</span>
          <span>{shortenAddress(msg.value.toAddress, 21)}</span>
        </div>
      </div>
      {onDelete ? (
        <span className="cursor-pointer" onClick={() => onDelete(index)}>
          <Image
            src="/delete-cross-icon.svg"
            height={16}
            width={16}
            alt="Remove"
          />
        </span>
      ) : null}
    </div>
  );
};

export const RenderDelegateMessage = ({
  msg,
  index,
  currency,
  onDelete,
}: RenderMsgProps) => {
  return (
    <div className="flex justify-between items-center text-[14px] font-extralight">
      <div className="flex gap-2">
        <Image
          className="bg-[#FFFFFF1A] rounded-lg"
          src="/solid-arrow-icon.svg"
          height={24}
          width={24}
          alt=""
        />
        <div className="truncate max-w-[280px]">
          <span>Delegate&nbsp;</span>
          <span>
            {parseBalance(
              msg.value.amount,
              currency.coinDecimals,
              currency.coinMinimalDenom
            )}
            &nbsp;
            {currency.coinDenom}&nbsp;
          </span>
          <span>to&nbsp;</span>
          <span>{shortenAddress(msg.value.validatorAddress, 21)}</span>
        </div>
      </div>
      {onDelete ? (
        <span className="cursor-pointer" onClick={() => onDelete(index)}>
          <Image
            src="/delete-cross-icon.svg"
            height={16}
            width={16}
            alt="Remove"
          />
        </span>
      ) : null}
    </div>
  );
};

export const RenderUnDelegateMessage = ({
  msg,
  index,
  currency,
  onDelete,
}: RenderMsgProps) => {
  return (
    <div>
      <div>
        <span>#{index + 1}&nbsp;&nbsp;</span>
        <span>Undelegate&nbsp;</span>
        <span>
          {parseBalance(
            [msg.value.amount],
            currency.coinDecimals,
            currency.coinMinimalDenom
          )}
          {currency.coinDenom}&nbsp;
        </span>
        <span>from&nbsp;</span>
        <span>{shortenAddress(msg.value?.validatorAddress || '', 21)}</span>
      </div>
      {onDelete ? <span onClick={() => onDelete(index)}>x</span> : null}
    </div>
  );
};

export const RenderReDelegateMessage = ({
  msg,
  index,
  currency,
  onDelete,
}: RenderMsgProps) => {
  return (
    <div>
      <div>
        <span>#{index + 1}&nbsp;&nbsp;</span>
        <span>Redelegate&nbsp;</span>
        <span>
          {parseBalance(
            [msg.value.amount],
            currency.coinDecimals,
            currency.coinMinimalDenom
          )}
          {currency.coinDenom}&nbsp;
        </span>
        <span>from&nbsp;</span>
        <span>{shortenAddress(msg.value.validatorSrcAddress, 21)}&nbsp;</span>
        <span>to&nbsp;</span>
        <span>{shortenAddress(msg.value.validatorDstAddress, 21)}</span>
      </div>
      {onDelete ? <span onClick={() => onDelete(index)}>x</span> : null}
    </div>
  );
};

const feeComponentIcons: Record<string, string> = {
  low: '/low-fee-icon.svg',
  high: '/high-fee-icon.svg',
  average: '/average-fee-icon.svg',
};

const FeeComponent = ({
  onSetFeeChange,
  gasPriceStep,
  coinDenom,
}: {
  onSetFeeChange: (value: number) => void;
  gasPriceStep: GasPrice | undefined;
  coinDenom: string;
}) => {
  const [active, setActive] = useState('average');
  const handleFeeChange = (value: string) => {
    setActive(value);
  };
  return (
    <div className="space-y-4">
      <div className="text-[14px] font-light">Fee</div>
      <div className="flex gap-4">
        {gasPriceStep
          ? Object.entries(gasPriceStep).map(([key, value], index) => (
              <div
                key={index}
                className="flex-1"
                onClick={() => {
                  handleFeeChange(key);
                  onSetFeeChange(value);
                }}
              >
                <FeeComponentButton
                  icon={feeComponentIcons[key]}
                  value={value}
                  name={key}
                  denom={coinDenom}
                  active={active}
                />
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

const FeeComponentButton = ({
  icon,
  name,
  value,
  denom,
  active,
}: {
  icon: string;
  name: string;
  value: number;
  denom: string;
  active: string;
}) => {
  return (
    <div
      className={
        active === name ? `fee-component-btn fee-selected` : `fee-component-btn`
      }
    >
      <div className="flex gap-2 items-center">
        <Image src={icon} height={24} width={24} alt={name} />
        <div className="text-[14px] font-light text-capitalize">{name}</div>
      </div>
      <div className="flex gap-2 items-center">
        <div className="font-bold text-[16px]">{value}</div>
        <div className="text-[12px] font-light text-[#FFFFFF80]">{denom}</div>
      </div>
    </div>
  );
};
