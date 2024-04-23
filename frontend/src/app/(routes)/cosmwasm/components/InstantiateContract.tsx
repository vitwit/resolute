import { CircularProgress, SelectChangeEvent, TextField } from '@mui/material';
import React, { useState } from 'react';
import { Control, Controller, useForm } from 'react-hook-form';
import { customTextFieldStyles } from '../styles';
import useContracts from '@/custom-hooks/useContracts';
import AttachFunds from './AttachFunds';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { getFormattedFundsList } from '@/utils/util';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { txInstantiateContract } from '@/store/features/cosmwasm/cosmwasmSlice';
import { TxStatus } from '@/types/enums';

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
  const dispatch = useAppDispatch();
  const { instantiateContract } = useContracts();

  const txInstantiateStatus = useAppSelector(
    (state) => state.cosmwasm.chains?.[chainID]?.txInstantiate?.status
  );

  const { handleSubmit, control, setValue, getValues } =
    useForm<InstatiateContractInputs>({
      defaultValues: {
        codeId: '',
        label: '',
        adminAddress: '',
        message: '',
      },
    });

  // Attach funds logic
  const [attachFundType, setAttachFundType] = useState('no-funds');
  const { getDenomInfo } = useGetChainInfo();
  const { decimals, minimalDenom, chainName } = getDenomInfo(chainID);
  const [funds, setFunds] = useState<FundInfo[]>([
    {
      amount: '',
      denom: minimalDenom,
      decimals: decimals,
    },
  ]);
  const [fundsInput, setFundsInput] = useState('');

  const handleAttachFundTypeChange = (event: SelectChangeEvent<string>) => {
    setAttachFundType(event.target.value);
  };

  const onSubmit = (data: InstatiateContractInputs) => {
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

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(getValues('message'));
      const formattedJSON = JSON.stringify(parsed, undefined, 4);
      setValue('message', formattedJSON);
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      console.log(error);
    }
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
                className="font-bold underline underline-offset-[3px] cursor-pointer"
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
            <div className="bg-[#ffffff0d] p-4 rounded-2xl flex-1">
              <div className="relative h-full border-[1px] rounded-2xl border-[#ffffff1e] hover:border-[#ffffff50]">
                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={7}
                      required
                      InputProps={{
                        sx: {
                          input: {
                            color: 'white',
                            fontSize: '14px',
                            padding: 2,
                          },
                        },
                      }}
                      sx={{
                        '& .MuiTypography-body1': {
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 200,
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '& .MuiOutlinedInput-root': {
                          border: 'none',
                          borderRadius: '16px',
                          color: 'white',
                        },
                        '& .Mui-focused': {
                          border: 'none',
                          borderRadius: '16px',
                        },
                      }}
                    />
                  )}
                />
                <button
                  onClick={formatJSON}
                  type="button"
                  className="border-[1px] border-[#FFFFFF33] rounded-full p-2 text-[12px] font-extralight top-4 right-4 absolute"
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

const CustomTextField = ({
  control,
  name,
  placeHolder,
  rules,
  required,
}: {
  control: Control<any, any>;
  rules?: any;
  name: string;
  placeHolder: string;
  required: boolean;
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <TextField
          className="rounded-lg bg-[#ffffff0D]"
          {...field}
          required={required}
          fullWidth
          placeholder={placeHolder}
          sx={customTextFieldStyles}
        />
      )}
    />
  );
};

const InstatiateButton = ({ loading }: { loading: boolean }) => {
  return (
    <button
      type="submit"
      className="primary-gradient text-[12px] font-medium px-3 py-[6px] rounded-lg h-10 w-full"
    >
      {loading ? (
        <CircularProgress size={18} sx={{ color: 'white' }} />
      ) : (
        'Instantiate'
      )}
    </button>
  );
};
