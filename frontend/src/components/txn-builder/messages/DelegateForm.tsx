import { customMUITextFieldStyles } from '@/app/(routes)/multiops/styles';
import { InputAdornment, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import CustomAutoComplete from '../components/CustomAutoComplete';
import useStaking from '@/custom-hooks/txn-builder/useStaking';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { getAllValidators } from '@/store/features/staking/stakeSlice';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { TxStatus } from '@/types/enums';
import { Decimal } from '@cosmjs/math';
import { formatCoin } from '@/utils/util';
import FileUpload from '../components/FileUpload';
import AddMsgButton from '../components/AddMsgButton';

interface DelegateFormProps {
  chainID: string;
  fromAddress: string;
  onDelegate: (payload: Msg) => void;
  currency: Currency;
  availableBalance: number;
  cancelAddMsg: () => void;
}

const DelegateForm = (props: DelegateFormProps) => {
  const {
    fromAddress,
    chainID,
    currency,
    onDelegate,
    availableBalance,
    cancelAddMsg,
  } = props;
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const { restURLs: baseURLs } = getChainInfo(chainID);
  const { getValidators } = useStaking();
  const { validatorsList } = getValidators({ chainID });
  const [selectedOption, setSelectedOption] = useState<ValidatorOption | null>(
    null
  );
  const validatorsLoading = useAppSelector(
    (state) => state.staking.chains?.[chainID]?.validators.status
  );
  const { handleSubmit, control, setValue, reset } = useForm({
    defaultValues: {
      amount: '',
      validator: '',
      delegator: fromAddress,
    },
  });

  const [fileUploadTxns, setFileUploadTxns] = useState<Msg[]>([]);

  const handleValidatorChange = (option: ValidatorOption | null) => {
    setValue('validator', option?.address || '');
    setSelectedOption(option);
  };

  useEffect(() => {
    if (chainID) {
      dispatch(getAllValidators({ chainID, baseURLs }));
    }
  }, []);

  const onSubmit = (data: {
    amount: string;
    validator: string;
    delegator: string;
  }) => {
    if (data.validator) {
      const baseAmount = Decimal.fromUserInput(
        data.amount,
        Number(currency?.coinDecimals)
      ).atomics;
      const msgDelegate = {
        delegatorAddress: data.delegator,
        validatorAddress: data.validator,
        amount: {
          amount: baseAmount,
          denom: currency?.coinMinimalDenom,
        },
      };

      onDelegate({
        typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
        value: msgDelegate,
      });
      reset();
      handleValidatorChange(null);
    }
  };

  const handleAddMsgs = (msgs: Msg[]) => {
    for (const msg of msgs) {
      onDelegate(msg);
    }
  };

  const onAddFileUploadTxns = (msgs: Msg[]) => {
    setFileUploadTxns(msgs);
  };

  const onRemoveFileUploadTxns = () => {
    setFileUploadTxns([]);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between h-full"
    >
      <div className="space-y-6">
        <div className="bg-[#FFFFFF05] rounded-2xl space-y-2">
          <div className="bg-[#FFFFFF05] rounded-2xl px-6 py-4 flex items-center justify-between">
            <div className="text-b1">Delegate</div>
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
              <div className="text-b1-light">Select Validator</div>
              <CustomAutoComplete
                dataLoading={validatorsLoading === TxStatus.PENDING}
                handleChange={handleValidatorChange}
                options={validatorsList}
                selectedOption={selectedOption}
                name="Select Validator"
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
                    required
                    placeholder="Amount"
                    fullWidth
                    InputProps={{
                      sx: {
                        input: {
                          color: 'white',
                          fontSize: '14px',
                          padding: 2,
                        },
                      },
                      endAdornment: (
                        <div className="text-small-light">
                          <InputAdornment
                            position="start"
                            sx={{ color: '#ffffff80' }}
                          >
                            {'Available:'}{' '}
                            {formatCoin(availableBalance, currency.coinDenom)}{' '}
                          </InputAdornment>
                        </div>
                      ),
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <FileUpload
          fromAddress={fromAddress}
          msgType="Delegate"
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

export default DelegateForm;
