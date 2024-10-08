import { customMUITextFieldStyles } from '@/app/(routes)/multiops/styles';
import { InputAdornment, TextField, Select, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Decimal } from '@cosmjs/math';
import FileUpload from '../components/FileUpload';
import AddMsgButton from '../components/AddMsgButton';
import useGetAllAssets from '@/custom-hooks/multisig/useGetAllAssets';
import { customSelectStyles } from '../styles';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';

interface SendFormProps {
  fromAddress: string;
  onSend: (payload: Msg) => void;
  currency: Currency;
  availableBalance: number;
  cancelAddMsg: () => void;
  chainID: string;
  isMultisig: boolean;
}

const SendForm = (props: SendFormProps) => {
  const { fromAddress, onSend, cancelAddMsg, chainID, isMultisig } = props;
  const dispatch = useAppDispatch();
  const { getDenomInfo } = useGetChainInfo();
  const { displayDenom: nativeDisplayDenom } = getDenomInfo(chainID);
  const { getAllAssets, getParsedAsset } = useGetAllAssets();
  const { allAssets } = getAllAssets(chainID, true, isMultisig);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      amount: '',
      recipient: '',
      from: fromAddress,
      selectedAsset: '',
    },
  });

  const [fileUploadTxns, setFileUploadTxns] = useState<Msg[]>([]);

  const onSubmit = (data: {
    amount: string;
    recipient: string;
    from: string;
    selectedAsset: string;
  }) => {
    const selectedAsset = allAssets.find(
      (asset) => asset.displayDenom === data.selectedAsset
    );
    if (!selectedAsset) return;

    const amountInAtomics = Decimal.fromUserInput(
      data.amount,
      selectedAsset.decimals
    ).atomics;

    const msgSend = {
      fromAddress: data.from,
      toAddress: data.recipient,
      amount: [
        {
          amount: amountInAtomics,
          denom: selectedAsset.ibcDenom,
        },
      ],
    };

    const msg = {
      typeUrl: '/cosmos.bank.v1beta1.MsgSend',
      value: msgSend,
    };

    onSend(msg);
    reset();
  };

  const handleAddMsgs = (msgs: Msg[]) => {
    for (const msg of msgs) {
      const { assetInfo } = getParsedAsset({
        amount: msg.value?.amount?.[0]?.amount,
        chainID,
        denom: msg.value?.amount?.[0]?.denom,
      });
      if (assetInfo) {
        onSend(msg);
      } else {
        dispatch(
          setError({ type: 'error', message: 'Encountered an invalid denom' })
        );
      }
    }
  };

  const onAddFileUploadTxns = (msgs: Msg[]) => {
    setFileUploadTxns(msgs);
  };

  const onRemoveFileUploadTxns = () => {
    setFileUploadTxns([]);
  };

  useEffect(() => {
    if (allAssets.length && !getValues('selectedAsset').length) {
      const nativeAsset = allAssets.find(
        (asset) => asset.displayDenom === nativeDisplayDenom
      );
      if (nativeAsset) {
        setValue('selectedAsset', nativeAsset?.displayDenom || '');
      } else {
        setValue('selectedAsset', allAssets?.[0]?.displayDenom || '');
      }
    }
  }, [allAssets]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between gap-6 h-full"
    >
      <div className="space-y-6">
        <div className="bg-[#FFFFFF05] rounded-2xl space-y-2">
          <div className="bg-[#FFFFFF05] rounded-2xl px-6 py-4 flex items-center justify-between">
            <div className="text-b1">Send</div>
            <button
              className="secondary-btn"
              onClick={cancelAddMsg}
              type="button"
            >
              Remove
            </button>
          </div>
          <div className="space-y-6 px-6 pb-6">
            <div className="flex-1 space-y-2">
              <div className="text-b1-light">Enter Address</div>
              <Controller
                name="recipient"
                control={control}
                render={({ field }) => (
                  <TextField
                    className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
                    {...field}
                    sx={{
                      ...customMUITextFieldStyles,
                    }}
                    required
                    placeholder="Address"
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
              <div className="text-b1-light">Enter Amount</div>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <TextField
                    className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
                    {...field}
                    sx={{
                      ...customMUITextFieldStyles,
                    }}
                    placeholder="Amount"
                    fullWidth
                    required
                    InputProps={{
                      sx: {
                        input: {
                          color: 'white',
                          fontSize: '14px',
                          padding: 2,
                        },
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <Controller
                            name="selectedAsset"
                            control={control}
                            rules={{
                              required: 'Please select asset',
                            }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                value={field.value || ''}
                                onChange={(event) => {
                                  field.onChange(event);
                                }}
                                displayEmpty
                                sx={{
                                  ...customSelectStyles,
                                  '& .MuiSelect-select': {
                                    color: '#fffffff0',
                                  },
                                }}
                                MenuProps={{
                                  PaperProps: {
                                    sx: {
                                      backgroundColor: '#FFFFFF14',
                                      backdropFilter: 'blur(15px)',
                                      color: '#fffffff0',
                                      borderRadius: '16px',
                                      marginTop: '8px',
                                    },
                                  },
                                }}
                              >
                                <MenuItem value="" disabled>
                                  Select Asset
                                </MenuItem>
                                {allAssets.map((asset) => (
                                  <MenuItem
                                    key={asset.displayDenom}
                                    value={asset.displayDenom}
                                  >
                                    {asset.amountInDenom} {asset.displayDenom}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <div className="text-end text-[12px] h-[18px] text-[#ff5656]">
                {errors?.selectedAsset?.message}
              </div>
            </div>
          </div>
        </div>
        <FileUpload
          fromAddress={fromAddress}
          msgType="Send"
          onUpload={onAddFileUploadTxns}
          onCancel={onRemoveFileUploadTxns}
          msgsCount={fileUploadTxns?.length}
        />
      </div>
      <AddMsgButton
        fileUploadTxns={fileUploadTxns}
        handleAddMsgs={handleAddMsgs}
        onRemoveFileUploadTxns={onRemoveFileUploadTxns}
      />
    </form>
  );
};

export default SendForm;
