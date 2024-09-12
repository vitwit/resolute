import { SelectChangeEvent, TextField } from '@mui/material';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import useContracts from '@/custom-hooks/useContracts';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { getFormattedFundsList } from '@/utils/util';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { txInstantiateContract } from '@/store/features/cosmwasm/cosmwasmSlice';
import { TxStatus } from '@/types/enums';
import { setError } from '@/store/features/common/commonSlice';
import CustomTextField from './CustomTextField';
import AttachFunds from '../single-contract/AttachFunds';
import { multiSendInputFieldStyles } from '@/app/(routes)/transfers/styles';
import CustomButton from '@/components/common/CustomButton';
import Image from 'next/image';

interface InstatiateContractInputs {
  codeId: string;
  label: string;
  adminAddress: string;
  message: string;
}

const InstantiateContract = ({ chainID }: { chainID: string }) => {
  // ------------------------------------------//
  // ---------------DEPENDENCIES---------------//
  // ------------------------------------------//
  const dispatch = useAppDispatch();
  const { instantiateContract } = useContracts();
  const { getDenomInfo, getChainInfo } = useGetChainInfo();
  const { decimals, minimalDenom } = getDenomInfo(chainID);
  const { restURLs, chainName, address: walletAddres } = getChainInfo(chainID);

  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const [attachFundType, setAttachFundType] = useState('no-funds');
  const [funds, setFunds] = useState<FundInfo[]>([
    {
      amount: '',
      denom: minimalDenom,
      decimals: decimals,
    },
  ]);
  const [fundsInput, setFundsInput] = useState('');

  const txInstantiateStatus = useAppSelector(
    (state) => state.cosmwasm.chains?.[chainID]?.txInstantiate?.status
  );
  const showAuthzAlert = useAppSelector(
    (state) => state.authz.authzAlert.display
  );

  // ------------------------------------------------//
  // -----------------FORM HOOKS---------------------//
  // ------------------------------------------------//
  const { handleSubmit, control, setValue, getValues, watch } =
    useForm<InstatiateContractInputs>({
      defaultValues: {
        codeId: '',
        label: '',
        adminAddress: '',
        message: '',
      },
    });

  // ------------------------------------------------//
  // -----------------CHANGE HANDLER-----------------//
  // ------------------------------------------------//
  const handleAttachFundTypeChange = (event: SelectChangeEvent<string>) => {
    setAttachFundType(event.target.value);
  };

  // ----------------------------------------------------//
  // -----------------CUSTOM VALIDATIONS-----------------//
  // ----------------------------------------------------//
  const validateJSONInput = (
    input: string,
    setInput: (value: string) => void,
    errorMessagePrefix: string
  ): boolean => {
    try {
      if (!input?.length) {
        dispatch(
          setError({
            type: 'error',
            message: `Please enter ${errorMessagePrefix}`,
          })
        );
        return false;
      }
      const parsed = JSON.parse(input);
      const formattedJSON = JSON.stringify(parsed, undefined, 4);
      setInput(formattedJSON);
      return true;
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      dispatch(
        setError({
          type: 'error',
          message: `Invalid JSON input: (${errorMessagePrefix}) ${error?.message || ''}`,
        })
      );
      return false;
    }
  };

  const formatInstantiationMessage = () => {
    return validateJSONInput(
      getValues('message'),
      (value: string) => {
        setValue('message', value);
      },
      'Instatiation Message'
    );
  };

  const validateFunds = () => {
    return validateJSONInput(
      fundsInput,
      (value: string) => {
        setFundsInput(value);
      },
      'Attach Funds List'
    );
  };

  // ------------------------------------------//
  // ---------------TRANSACTION----------------//
  // ------------------------------------------//
  const onSubmit = (data: InstatiateContractInputs) => {
    const parsedCodeId = Number(data.codeId);
    if (Number.isNaN(parsedCodeId)) {
      dispatch(
        setError({
          type: 'error',
          message: 'Invalid Code ID',
        })
      );
      return;
    }

    if (!formatInstantiationMessage()) return;
    if (attachFundType === 'json' && !validateFunds()) return;

    const attachedFunds = getFormattedFundsList(
      funds,
      fundsInput,
      attachFundType
    );

    dispatch(
      txInstantiateContract({
        chainID,
        codeId: Number(data.codeId),
        instantiateContract,
        label: data.label,
        msg: data.message,
        baseURLs: restURLs,
        admin: data.adminAddress ? data.adminAddress : undefined,
        funds: attachedFunds,
      })
    );
  };

  return (
    <div
      className={`flex flex-col gap-10 justify-between ${showAuthzAlert ? 'min-h-[calc(100vh-380px)]' : 'min-h-[calc(100vh-325px)]'}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} id="instantiate-contract">
        <div className="flex gap-10">
          <div className="w-[50%] space-y-6">
            <div className="">
              <p className="form-label-text">Code ID</p>
              <CustomTextField
                control={control}
                name="codeId"
                placeHolder="Code ID"
                required={true}
              />
            </div>
            <div className="">
              <div className="flex w-full justify-between">
                <p className="form-label-text">Admin Address</p>
                <div
                  className="flex gap-1 cursor-pointer items-center"
                  onClick={() => {
                    if (watch('adminAddress') === walletAddres) {
                      setValue('adminAddress', '');
                    } else {
                      setValue('adminAddress', walletAddres);
                    }
                  }}
                >
                  {watch('adminAddress') === walletAddres ? (
                    <Image
                      src="/after-check.svg"
                      width={20}
                      height={20}
                      alt="after-check-icon"
                    />
                  ) : (
                    <Image
                      src="/before-check.svg"
                      width={20}
                      height={20}
                      alt="before-check-icon"
                    />
                  )}
                  <p className="text-b1">Assign me</p>
                </div>
              </div>
              <CustomTextField
                control={control}
                name="adminAddress"
                placeHolder="Admin Address"
                required={true}
              />
            </div>
            <div className="">
              <p className="form-label-text">Label</p>
              <CustomTextField
                control={control}
                name="label"
                placeHolder="Label"
                required={true}
              />
            </div>
            <div className="">
              <div className="form-label-text">Attach Funds</div>
              <AttachFunds
                handleAttachFundTypeChange={handleAttachFundTypeChange}
                attachFundType={attachFundType}
                chainName={chainName}
                funds={funds}
                setFunds={setFunds}
                fundsInputJson={fundsInput}
                setFundsInputJson={setFundsInput}
              />
            </div>
          </div>
          <div className="w-[50%]">
            <p className="form-label-text">Instantiate message</p>
            <div className="relative">
              <Controller
                name="message"
                control={control}
                render={({ field }) => (
                  <TextField
                    multiline
                    fullWidth
                    {...field}
                    className="text-[#fffffff0]"
                    rows={12}
                    sx={{
                      ...multiSendInputFieldStyles,
                      ...{ height: '190px' },
                    }}
                    placeholder=""
                    autoFocus={true}
                  />
                )}
              />
              <button
                type="button"
                onClick={formatInstantiationMessage}
                className="format-json-btn"
              >
                Format JSON
              </button>
            </div>
          </div>
        </div>
      </form>
      <CustomButton
        btnText="Instantiate"
        btnDisabled={txInstantiateStatus === TxStatus.PENDING}
        btnLoading={txInstantiateStatus === TxStatus.PENDING}
        btnStyles="w-full"
        form="instantiate-contract"
        btnType="submit"
      />
    </div>
  );
};

export default InstantiateContract;
