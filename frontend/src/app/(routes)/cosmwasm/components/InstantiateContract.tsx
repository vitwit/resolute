import { CircularProgress, SelectChangeEvent, TextField } from '@mui/material';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import useContracts from '@/custom-hooks/useContracts';
import AttachFunds from './AttachFunds';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { getFormattedFundsList } from '@/utils/util';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { txInstantiateContract } from '@/store/features/cosmwasm/cosmwasmSlice';
import { TxStatus } from '@/types/enums';
import CustomTextField from './CustomTextField';
import { queryInputStyles } from '../styles';
import { setError } from '@/store/features/common/commonSlice';

interface InstantiateContractI {
  chainID: string;
  walletAddress: string;
  restURLs: string[];
}
interface InstatiateContractInputs {
  codeId: string;
  label: string;
  adminAddress: string;
  message: string;
}

const InstantiateContract = (props: InstantiateContractI) => {
  const { chainID, walletAddress, restURLs } = props;

  // ------------------------------------------//
  // ---------------DEPENDENCIES---------------//
  // ------------------------------------------//
  const dispatch = useAppDispatch();
  const { instantiateContract } = useContracts();
  const { getDenomInfo } = useGetChainInfo();
  const { decimals, minimalDenom, chainName } = getDenomInfo(chainID);

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

  // ------------------------------------------------//
  // -----------------FORM HOOKS---------------------//
  // ------------------------------------------------//
  const { handleSubmit, control, setValue, getValues } =
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
    if (isNaN(parsedCodeId)) {
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
    <form className="h-full pb-10" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-10">
        <div className="space-y-2">
          <div className="font-extralight text-[14px]">Code ID</div>
          <CustomTextField
            name="codeId"
            placeHolder="Enter Code ID"
            rules={{ required: 'Code ID is required' }}
            control={control}
            required={true}
          />
        </div>
        <div className="flex gap-6 w-full">
          <div className="space-y-2 w-1/2">
            <div className="font-extralight text-[14px]">Label</div>
            <CustomTextField
              name="label"
              placeHolder="Enter Label"
              rules={{ required: 'Label is required' }}
              control={control}
              required={true}
            />
          </div>
          <div className="space-y-2 w-1/2">
            <div className="font-extralight text-[14px] flex justify-between gap-6">
              <span>Admin Address</span>
              <span
                onClick={() => {
                  setValue('adminAddress', walletAddress);
                }}
                className="styled-underlined-text"
              >
                Assign Me
              </span>
            </div>
            <CustomTextField
              name="adminAddress"
              placeHolder="Enter Admin Address"
              rules={undefined}
              control={control}
              required={false}
            />
          </div>
        </div>
        <div className="flex gap-6">
          <div className="w-1/2 space-y-2">
            <div className="text-[14px] font-extralight">Attach Funds</div>
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
          <div className="flex flex-col gap-2 w-1/2">
            <div className="font-extralight text-[14px]">
              Instantiate Message
            </div>
            <div className="instantiate-input-wrapper">
              <div className="instantiate-input">
                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      placeholder={JSON.stringify(
                        { sample_query: {} },
                        undefined,
                        2
                      )}
                      rows={7}
                      InputProps={{
                        sx: {
                          input: {
                            color: 'white',
                            fontSize: '14px',
                            padding: 2,
                          },
                        },
                      }}
                      sx={queryInputStyles}
                    />
                  )}
                />
                <button
                  onClick={formatInstantiationMessage}
                  type="button"
                  className="format-json-btn"
                >
                  Format JSON
                </button>
              </div>
            </div>
          </div>
        </div>
        <InstatiateButton loading={txInstantiateStatus === TxStatus.PENDING} />
      </div>
    </form>
  );
};

export default InstantiateContract;

const InstatiateButton = ({ loading }: { loading: boolean }) => {
  return (
    <button type="submit" className="primary-gradient instantiate-btn">
      {loading ? (
        <CircularProgress size={18} sx={{ color: 'white' }} />
      ) : (
        'Instantiate'
      )}
    </button>
  );
};
