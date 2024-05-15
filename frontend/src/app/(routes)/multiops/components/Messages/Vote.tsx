import { msgVoteTypeUrl } from '@/txns/gov/vote';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import AddressField from '../AddressField';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { getProposalsInVoting } from '@/store/features/gov/govSlice';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { get } from 'lodash';
import {
  Autocomplete,
  CircularProgress,
  Paper,
  TextField,
} from '@mui/material';
import { autoCompleteStyles, autoCompleteTextFieldStyles } from '../../styles';
import { TxStatus } from '@/types/enums';
import { shortenName } from '@/utils/util';

interface VoteProps {
  address: string;
  onVote: (payload: Msg) => void;
  currency: Currency;
  chainID: string;
}

interface ProposalOption {
  label: string;
  value: string;
}

interface VoteOption {
  label: string;
  value: number;
}

const voteOptions: VoteOption[] = [
  {
    label: 'Yes',
    value: 1,
  },
  {
    label: 'No',
    value: 3,
  },
  {
    label: 'Abstain',
    value: 2,
  },
  {
    label: 'No With Veto',
    value: 4,
  },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
const renderProposalOption = (props: any, option: ProposalOption) => (
  <li {...props} key={option.value}>
    <div className="flex gap-2 items-center">
      <span className="font-semibold">#{option.value}</span>
      <span className="truncate">{shortenName(option.label, 36)}</span>
    </div>
  </li>
);

/* eslint-disable @typescript-eslint/no-explicit-any */
const renderVoteOption = (props: any, option: VoteOption) => (
  <li {...props} key={option.value}>
    <div className="flex gap-2 items-center">
      <span>{option.label}</span>
    </div>
  </li>
);

const Vote: React.FC<VoteProps> = (props) => {
  const { address, onVote, chainID } = props;
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const { govV1, baseURL, restURLs: baseURLs } = getChainInfo(chainID);
  const proposals = useAppSelector(
    (state) => state.gov.chains?.[chainID]?.active?.proposals
  );
  const proposalsLoading = useAppSelector(
    (state) => state.gov.chains?.[chainID]?.active?.status
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      proposalID: null,
      voteOption: null,
      from: address,
    },
  });

  const [data, setData] = useState<ProposalOption[]>([]);

  const onSubmit = (data: {
    proposalID: null | {
      value: string;
    };
    voteOption: null | {
      value: string;
    };
    from: string;
  }) => {
    const msgVote = {
      voter: data.from,
      option: Number(data.voteOption?.value),
      proposalId: Number(data.proposalID?.value),
    };

    const msg = {
      typeUrl: msgVoteTypeUrl,
      value: msgVote,
    };

    onVote(msg);
  };

  useEffect(() => {
    dispatch(
      getProposalsInVoting({
        baseURL,
        baseURLs,
        chainID,
        govV1,
        voter: address,
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
        <div className="text-[14px] font-extralight">Voter</div>
        <AddressField control={control} name={'from'} />
      </div>
      <div className="space-y-2 mt-12">
        <div className="text-[14px] font-extralight">Select Proposal</div>
        <Controller
          name="proposalID"
          control={control}
          defaultValue={null}
          rules={{ required: 'Proposal is required' }}
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
              renderOption={renderProposalOption}
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
                  ) : proposals.length ? (
                    children
                  ) : (
                    <div className="flex justify-center items-center gap-2 p-4">
                      - No Proposals -
                    </div>
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
        <div className="text-[14px] font-extralight">Select Vote Option</div>
        <Controller
          name="voteOption"
          control={control}
          defaultValue={null}
          rules={{ required: 'Vote option is required' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Autocomplete
              disablePortal
              value={value}
              sx={autoCompleteStyles}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              options={voteOptions}
              onChange={(event, item) => {
                onChange(item);
              }}
              renderOption={renderVoteOption}
              renderInput={(params) => (
                <TextField
                  className="bg-[#FFFFFF0D]"
                  {...params}
                  required
                  placeholder="Select vote option"
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
      <button type="submit" className="add-txn-btn primary-gradient">
        Add
      </button>
    </form>
  );
};

export default Vote;
