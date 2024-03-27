import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { getProposalsInDeposit } from '@/store/features/gov/govSlice';
import { shortenName } from '@/utils/util';
import { get } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import AddressField from '../AddressField';
import {
  Autocomplete,
  CircularProgress,
  Paper,
  TextField,
} from '@mui/material';
import { autoCompleteStyles, autoCompleteTextFieldStyles } from '../../styles';
import { TxStatus } from '@/types/enums';
import AmountInputField from '../AmountInputField';
import { GovDepositMsg } from '@/txns/gov/deposit';
import { Decimal } from '@cosmjs/math';

interface DepositProps {
  address: string;
  onDeposit: (payload: Msg) => void;
  currency: Currency;
  chainID: string;
  availableBalance: number;
  feeAmount: number;
}

interface ProposalOption {
  label: string;
  value: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const renderOption = (props: any, option: ProposalOption) => (
  <li {...props} key={option.value}>
    <div className="flex gap-2 items-center">
      <span className="font-semibold truncate">#{option.value}</span>
      <span>{shortenName(option.label, 40)}</span>
    </div>
  </li>
);

const Deposit: React.FC<DepositProps> = (props) => {
  const { address, availableBalance, chainID, currency, feeAmount, onDeposit } =
    props;
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const { govV1, baseURL, restURLs: baseURLs } = getChainInfo(chainID);

  const [data, setData] = useState<ProposalOption[]>([]);

  const proposals = useAppSelector(
    (state) => state.gov.chains?.[chainID]?.deposit?.proposals
  );
  const proposalsLoading = useAppSelector(
    (state) => state.gov.chains?.[chainID]?.deposit?.status
  );
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      proposalID: null,
      amount: '',
      from: address,
    },
  });

  const onSubmit = (data: {
    proposalID: null | {
      value: string;
    };
    amount: string;
    from: string;
  }) => {
    const amountInAtomics = Decimal.fromUserInput(
      data.amount.toString(),
      Number(currency.coinDecimals)
    ).atomics;

    const msg = GovDepositMsg(
      Number(data.proposalID?.value),
      data.from,
      Number(amountInAtomics),
      currency.coinMinimalDenom
    );
    console.log(msg);
    onDeposit(msg);
  };

  useEffect(() => {
    dispatch(
      getProposalsInDeposit({
        baseURL,
        baseURLs,
        chainID,
        govV1,
      })
    );
  }, [chainID]);

  useEffect(() => {
    const proposalsData: ProposalOption[] = [];
    proposals?.forEach((proposal) => {
      const proposalTitle =
        get(proposal, 'content.title', get(proposal, 'title')) ||
        get(proposal, 'content.@type', get(proposal, 'message[0].@type', ''));
      proposalsData.push({
        value: get(proposal, 'proposal_id') || get(proposal, 'id', ''),
        label: shortenName(proposalTitle, 40),
      });
    });
    setData(proposalsData);
  }, [proposals]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between"
    >
      <div className="space-y-2">
        <div className="text-[14px] font-extralight">Address</div>
        <AddressField control={control} name={'from'} />
      </div>
      <div className="space-y-2 mt-12">
        <div className="text-[14px] font-extralight">Select Proposal</div>
        <Controller
          name="proposalID"
          control={control}
          defaultValue={null}
          rules={{ required: 'Validator is required' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Autocomplete
              disablePortal
              value={value}
              sx={autoCompleteStyles}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              options={data}
              onChange={(event, item) => {
                onChange(item);
              }}
              renderOption={renderOption}
              renderInput={(params) => (
                <TextField
                  className="bg-[#FFFFFF0D]"
                  {...params}
                  required
                  placeholder="Select proposal"
                  error={!!error}
                  sx={autoCompleteTextFieldStyles}
                />
              )}
              PaperComponent={({ children }) => (
                <Paper
                  style={{
                    background:
                      'linear-gradient(178deg, #241B61 1.71%, #69448D 98.35%, #69448D 98.35%)',
                    color: 'white',
                    borderRadius: '8px',
                    padding: 1,
                  }}
                >
                  {proposalsLoading === TxStatus.PENDING ? (
                    <div className="flex justify-center items-center gap-2 p-4">
                      <CircularProgress color="inherit" size={16} />
                      <div className="font-light italic text-[14px]">
                        Fetching proposals{' '}
                        <span className="dots-flashing"></span>{' '}
                      </div>
                    </div>
                  ) : (
                    children
                  )}
                </Paper>
              )}
            />
          )}
        />
        <div className="error-box">
          <span
            className={
              !!errors.proposalID
                ? 'error-chip opacity-80'
                : 'error-chip opacity-0'
            }
          >
            {errors.proposalID?.message}
          </span>
        </div>
      </div>
      <div className="space-y-2 mt-[14px]">
        <div className="flex justify-between text-[14px] font-extralight">
          <div>Enter Amount</div>
          <div>
            Available Balance: <span>{availableBalance}</span>{' '}
            {currency.coinDenom}
          </div>
        </div>
        <div>
          <AmountInputField
            availableBalance={availableBalance}
            control={control}
            displayDenom={currency.coinDenom}
            feeAmount={feeAmount}
            setValue={setValue}
          />
          <div className="error-box">
            <span
              className={
                !!errors.amount
                  ? 'error-chip opacity-80'
                  : 'error-chip opacity-0'
              }
            >
              {errors.amount?.message}
            </span>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="mt-[14px] w-full text-[12px] font-medium primary-gradient rounded-lg h-8 flex justify-center items-center"
      >
        Add
      </button>
    </form>
  );
};

export default Deposit;
