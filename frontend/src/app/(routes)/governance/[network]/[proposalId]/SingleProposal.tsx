import React, { useEffect, useState } from 'react';
import '../../style.css';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { useRemark } from 'react-remark';
import { RootState } from '@/store/store';
import { getPoolInfo } from '@/store/features/staking/stakeSlice';
import {
  getProposal,
  getGovTallyParams,
  getProposalTally,
  getDepositParams,
} from '@/store/features/gov/govSlice';
import { get } from 'lodash';
import { getLocalTime, getTimeDifferenceToFutureDate } from '@/utils/dataTime';
import Vote from '../../gov-dashboard/Vote';
import ProposalProjection from '../../ProposalProjection';
import { Tooltip } from '@mui/material';
import DialogDeposit from '../../popups/DialogDeposit';
import CustomButton from '@/components/common/CustomButton';
import SingleProposalLoading from '../../loaders/SingleProposalLoading';
import { useRouter } from 'next/navigation';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { formatAmount } from '@/utils/util';
import DepositCollected from '../../utils-components/DepositCollected';
import { PROPOSAL_STATUS_VOTING_PERIOD } from '@/utils/constants';
import { TxStatus } from '@/types/enums';

const emptyTallyResult = {
  yes: '',
  abstain: '',
  no: '',
  no_with_veto: '',
  proposal_id: '',
};

interface SingleProposalProps {
  chainID: string;
  proposalID: string;
}

const SingleProposal: React.FC<SingleProposalProps> = ({
  chainID,
  proposalID,
}) => {
  const [showFullText, setShowFullText] = useState(false);
  const [proposalMarkdown, setProposalMarkdown] = useRemark();
  const [contentLength, setContentLength] = useState(0);
  const [quorumPercent, setQuorumPercent] = useState<string>('0');
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const {
    restURLs: baseURLs,
    baseURL,
    govV1,
    chainName,
    chainLogo,
  } = getChainInfo(chainID);

  const proposalInfo = useAppSelector(
    (state: RootState) => state.gov.proposalDetails
  );
  const isStatusVoting =
    get(proposalInfo, 'status') === PROPOSAL_STATUS_VOTING_PERIOD;
  const poolInfo = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.pool
  );
  const tallyParams = useAppSelector(
    (state: RootState) =>
      state.gov.chains[chainID]?.tallyParams.params.tally_params
  );
  const quorumRequired = (parseFloat(tallyParams?.quorum) * 100).toFixed(1);
  const tallyResult = useAppSelector(
    (state: RootState) =>
      state.gov.chains[chainID]?.tally?.proposalTally?.[proposalID]
  );
  const proposalStatus = useAppSelector(
    (state) => state.gov.proposalInfo.status
  );

  const totalVotes = ['yes', 'no', 'abstain', 'no_with_veto'].reduce(
    (sum, key) =>
      sum +
      Number(get(tallyResult, key, get(tallyResult, `${key}_count`)) || 0),
    0
  );
  const { decimals, displayDenom } = getDenomInfo(chainID);

  const fetchProposalData = () => {
    dispatch(
      getProposal({
        chainID,
        baseURLs,
        baseURL,
        proposalId: Number(proposalID),
        govV1,
      })
    );
    dispatch(
      getProposalTally({
        chainID,
        baseURLs,
        baseURL,
        proposalId: Number(proposalID),
        govV1,
      })
    );
    dispatch(getPoolInfo({ chainID, baseURLs }));
    dispatch(getDepositParams({ chainID, baseURLs, baseURL }));
    dispatch(getGovTallyParams({ chainID, baseURL, baseURLs }));
  };

  const handleToggleText = () => setShowFullText(!showFullText);

  useEffect(() => {
    const proposalDescription = get(
      proposalInfo,
      'content.description',
      get(proposalInfo, 'summary', '')
    );
    setContentLength(proposalDescription.length);
    setProposalMarkdown(proposalDescription.replace(/\\n/g, '\n'));
  }, [proposalInfo]);

  useEffect(() => {
    fetchProposalData();
  }, []);

  useEffect(() => {
    if (poolInfo?.bonded_tokens) {
      const value = totalVotes / parseInt(poolInfo.bonded_tokens);
      setQuorumPercent((value * 100).toFixed(1));
    }
  }, [poolInfo, totalVotes]);

  const getVotesPercentage = (votesCount: number) => {
    return votesCount && totalVotes
      ? ((votesCount / totalVotes) * 100).toFixed(2)
      : '0';
  };

  const data = [
    {
      value: getVotesPercentage(
        Number(get(tallyResult, 'yes', get(tallyResult, 'yes_count')))
      ),
      count: Number(get(tallyResult, 'yes', get(tallyResult, 'yes_count'))),
      color: 'linear-gradient(90deg, #2ba472 0%, rgba(43, 164, 114, 0.5) 100%)',
      label: 'Yes',
    },
    {
      value: getVotesPercentage(
        Number(get(tallyResult, 'no', get(tallyResult, 'no_count')))
      ),
      count: Number(get(tallyResult, 'no', get(tallyResult, 'no_count'))),
      color: 'linear-gradient(90deg, #d92101 0%, rgba(217, 33, 1, 0.5) 100%)',
      label: 'No',
    },
    {
      value: getVotesPercentage(
        Number(get(tallyResult, 'abstain', get(tallyResult, 'abstain_count')))
      ),
      count: Number(
        get(tallyResult, 'abstain', get(tallyResult, 'abstain_count'))
      ),
      color: 'linear-gradient(90deg, #ffc13c 0%, rgba(255, 193, 60, 0.5) 100%)',
      label: 'Abstain',
    },
    {
      value: getVotesPercentage(
        Number(
          get(
            tallyResult,
            'no_with_veto',
            get(tallyResult, 'no_with_veto_count')
          )
        )
      ),
      count: Number(
        get(tallyResult, 'no_with_veto', get(tallyResult, 'no_with_veto_count'))
      ),
      color: 'linear-gradient(90deg, #da561e 0%, rgba(218, 86, 30, 0.5) 100%)',
      label: 'Veto',
    },
  ];

  const isProposal2daysgo = () => {
    const targetDate = new Date(get(proposalInfo, 'voting_end_time'));
    const currentDate = new Date();
    const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000;

    const timeDifference = targetDate.getTime() - currentDate.getTime();
    return timeDifference <= twoDaysInMilliseconds && timeDifference > 0;
  };

  const proposalTallyStatus = useAppSelector(
    (state) => state.gov.chains?.[chainID]?.tally.status
  );

  return (
    <>
      {proposalStatus === 'pending' ? (
        <SingleProposalLoading />
      ) : (
        <>
          {/* Banner */}
          {isProposal2daysgo() ? (
            <div className="fixed w-full bg-[#ffc13c] gap-2 px-6 py-3 ml-[-40px] flex items-center">
              <Image
                src="/infoblack.svg"
                width={24}
                height={24}
                alt="info-icon"
                draggable={false}
              />
              <p className="text-[#1C1C1D] text-sm font-semibold leading-[normal]">
                Important
              </p>
              <p className="text-[#1C1C1D] text-sm font-normal leading-[normal]">
                Voting ends in{' '}
                {getTimeDifferenceToFutureDate(
                  get(proposalInfo, 'voting_end_time')
                )}
              </p>
            </div>
          ) : null}

          <div className="flex items-start gap-10 pt-20 w-full h-full">
            <div className="flex items-start gap-10 w-full h-full">
              <div className="flex flex-col flex-1 justify-between h-full">
                <div className="flex flex-col gap-6">
                  <div className="secondary-btn" onClick={() => router.back()}>
                    Go back
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between w-full">
                      <p className="text-[#ffffffad] text-[28px] font-bold leading-[normal]">
                        {/* Aave v3.1 Cantina competitione */}
                        {get(
                          proposalInfo,
                          'proposal_id',
                          get(proposalInfo, 'id')
                        )}
                        . &nbsp;&nbsp;&nbsp;
                        {get(
                          proposalInfo,
                          'content.title',
                          get(proposalInfo, 'title', '-')
                        ) || get(proposalInfo, 'content.@type', '')}
                      </p>
                      {isStatusVoting ? (
                        <div className="active-badge text-[#ffffffad] text-sm font-normal leading-[normal]">
                          Active
                        </div>
                      ) : (
                        <div className="deposit-badge text-[#ffffffad] text-sm font-normal leading-[normal]">
                          Deposit
                        </div>
                      )}
                    </div>
                    <div className="flex gap-6 w-full">
                      <div className="flex gap-1 items-center">
                        {isStatusVoting ? (
                          <>
                            <p className="text-[rgba(255,255,255,0.50)] text-xs font-extralight leading-[normal]">
                              Voting
                            </p>
                            <p className="text-[#ffffffad] text-sm font-normal leading-[normal]">
                              ends in{' '}
                              {getTimeDifferenceToFutureDate(
                                get(proposalInfo, 'voting_end_time')
                              )}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-[rgba(255,255,255,0.50)] text-xs font-extralight leading-[normal]">
                              Deposit
                            </p>
                            <p className="text-[#ffffffad] text-sm font-normal leading-[normal]">
                              ends in{' '}
                              {getTimeDifferenceToFutureDate(
                                get(proposalInfo, 'deposit_end_time')
                              )}
                            </p>
                          </>
                        )}
                      </div>
                      <div className="flex gap-1 items-center">
                        <p className="text-[rgba(255,255,255,0.50)] text-xs font-extralight leading-[normal]">
                          on
                        </p>
                        <Image
                          src={chainLogo}
                          width={20}
                          height={20}
                          alt="Network-logo"
                          draggable={false}
                        />
                        <p className="text-[#ffffffad] text-sm font-normal leading-[normal] capitalize">
                          {chainName}
                        </p>
                      </div>
                    </div>
                    <div className="divider-line"></div>
                  </div>

                  <div className="text-[#ffffffad]  flex flex-col justify-between relative z-0">
                    <p
                      style={{
                        padding: 8,
                        whiteSpace: 'pre-line',
                      }}
                      className={`proposal-description-markdown h-[36vh] secondary-text ${contentLength > 900 ? (showFullText ? 'overflow-scroll' : 'overflow-hidden') : 'overflow-scroll'}`}
                    >
                      {proposalMarkdown}
                    </p>

                    {contentLength > 900 ? (
                      showFullText ? (
                        <p
                          onClick={handleToggleText}
                          className="cursor-pointer justify-center text-b1 underline flex space-x-1 items-center"
                        >
                          Show Less
                          <Image
                            src="/up.svg"
                            width={24}
                            height={24}
                            alt="Less-icon"
                          />
                        </p>
                      ) : (
                        <div className="h-30 w-full absolute bottom-0  bg-transparent z-10">
                          <div
                            onClick={handleToggleText}
                            className="cursor-pointer justify-center w-full bottom-14 absolute flex z-10 text-b1 underline space-x-1"
                          >
                            Continue Reading{' '}
                            <Image
                              src="/down.svg"
                              width={24}
                              height={24}
                              alt="more-icon"
                              className="ml-2"
                            />
                          </div>
                          <div className="backdrop-blur-sm w-full absolute bottom-0 h-32 bg-transparent">
                            {' '}
                          </div>
                        </div>
                      )
                    ) : null}
                  </div>

                  <div className="cast-vote-grid mt-10">
                    {isStatusVoting ? (
                      <>
                        {/* <div className="flex px-6 py-4 rounded-2xl bg-[#FFFFFF05] justify-between w-full">
                          <p className="text-b1">Cast your vote</p>
                          <p className="text-xs font-extralight leading-[18px]">
                            Voting ends in{' '}
                            {getTimeDifferenceToFutureDate(
                              get(proposalInfo, 'voting_end_time')
                            )}
                          </p>
                        </div> */}

                        <Vote
                          proposalId={proposalID}
                          chainID={chainID}
                          colCount={2}
                        />
                      </>
                    ) : (
                      <>
                        <CustomButton
                          btnText={
                            true ? 'Deposit' : 'Connect Wallet to Deposit'
                          }
                          btnOnClick={() => {
                            setDepositDialogOpen(true);
                          }}
                          btnStyles="items-center w-full"
                        />
                        <DialogDeposit
                          chainID={chainID}
                          endTime={get(proposalInfo, 'deposit_end_time', '-')}
                          onClose={() => setDepositDialogOpen(false)}
                          open={depositDialogOpen}
                          proposalId={proposalID}
                          proposalTitle={
                            get(
                              proposalInfo,
                              'content.title',
                              get(proposalInfo, 'title', '-')
                            ) || get(proposalInfo, 'content.@type', '')
                          }
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* RightSide View */}
              <div
                className={`flex flex-col h-[calc(100vh-144px)] overflow-y-scroll gap-6 ${isStatusVoting ? 'justify-between' : ''}`}
              >
                {isStatusVoting ? (
                  <ProposalProjection
                    quorumReached={
                      parseFloat(quorumPercent) >= parseFloat(quorumRequired)
                    }
                    quorumPercent={quorumPercent}
                    quorumRequired={quorumRequired}
                    totalVotes={totalVotes}
                    tallyResult={tallyResult || emptyTallyResult}
                    chainID={chainID}
                  />
                ) : (
                  <DepositCollected
                    proposalInfo={proposalInfo}
                    chainID={chainID}
                  />
                )}

                <div className="flex flex-col gap-6 p-6 rounded-2xl bg-[#FFFFFF05]">
                  <div className="flex flex-col gap-2">
                    <p className="text-b1">Proposal Timeline</p>
                    <div className="divider-line"></div>
                  </div>
                  <div className="">
                    <div className="flex gap-4">
                      <div className="flex flex-col justify-center items-center">
                        <Image
                          src="/radio-plain.svg"
                          width={12}
                          height={12}
                          alt="Proposal-Created"
                          draggable={false}
                        />
                        <div className="vertical-line "></div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Tooltip
                          title={getLocalTime(get(proposalInfo, 'submit_time'))}
                          placement="top"
                        >
                          <p className="text-[#FFFFFF80] text-[10px]">
                            {getTimeDifferenceToFutureDate(
                              get(proposalInfo, 'submit_time'),
                              true
                            )}{' '}
                            ago
                          </p>
                        </Tooltip>
                        <p className="text-xs font-normal leading-[normal] text-[#ffffffad]">
                          Proposal Created
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col justify-center items-center">
                        <Image
                          src="/radio-clr.svg"
                          width={16}
                          height={16}
                          alt="Proposal-Created"
                          draggable={false}
                        />
                        <div className="vertical-line"></div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Tooltip
                          title={
                            isStatusVoting
                              ? getLocalTime(
                                  get(proposalInfo, 'voting_start_time', '-')
                                )
                              : getLocalTime(
                                  get(proposalInfo, 'submit_time', '-')
                                )
                          }
                          placement="top"
                        >
                          <p className="text-[#FFFFFF80] text-[10px]">
                            {isStatusVoting
                              ? getTimeDifferenceToFutureDate(
                                  get(proposalInfo, 'voting_start_time', '-'),
                                  true
                                )
                              : getTimeDifferenceToFutureDate(
                                  get(proposalInfo, 'submit_time', '-'),
                                  true
                                )}{' '}
                            ago
                          </p>
                        </Tooltip>
                        <p className="text-[#ffffffad] text-xs font-normal leading-[normal]">
                          {isStatusVoting ? 'Voting ' : 'Deposit Time '}
                          started
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col">
                        <Image
                          src="/radio-plain.svg"
                          width={12}
                          height={12}
                          alt="Proposal-Created"
                          draggable={false}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Tooltip
                          title={
                            isStatusVoting
                              ? getLocalTime(
                                  get(proposalInfo, 'voting_end_time', '-')
                                )
                              : getLocalTime(
                                  get(proposalInfo, 'deposit_end_time', '-')
                                )
                          }
                          placement="top"
                        >
                          <p className="text-[#FFFFFF80] text-[10px]">
                            in{' '}
                            {isStatusVoting
                              ? getTimeDifferenceToFutureDate(
                                  get(proposalInfo, 'voting_end_time', '-')
                                )
                              : getTimeDifferenceToFutureDate(
                                  get(proposalInfo, 'deposit_end_time', '-')
                                )}
                          </p>
                        </Tooltip>
                        <p className="text-[#ffffffad] text-xs font-normal leading-[normal]">
                          {isStatusVoting ? 'Voting' : 'Deposit Time '} ends
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {isStatusVoting ? (
                  proposalTallyStatus === TxStatus.PENDING ? (
                    <div className="w-[380px] h-[342px] animate-pulse bg-[#252525] rounded-2xl"></div>
                  ) : (
                    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-[#FFFFFF05]">
                      <div className="flex flex-col gap-2">
                        <p className="text-[#ffffffad] text-sm font-normal leading-[normal]">
                          Current Status
                        </p>
                        <div className="divider-line"></div>
                      </div>
                      {data.map((v) => (
                        <div key={v.label} className="flex flex-col gap-2">
                          <div className="flex gap-1 items-center">
                            <p className="text-[#ffffffad] text-xs font-normal leading-[normal]">
                              {formatAmount(
                                Number((v.count / 10 ** decimals).toFixed(0))
                              )}{' '}
                              {displayDenom}
                            </p>
                            <p className="text-[#FFFFFF80] italic text-[10px]">
                              Voted {v.label}
                            </p>
                          </div>
                          <div className="flex space-x-2 items-center">
                            <div className="bg-[#FFFFFF0D] w-full rounded-full relative">
                              <div
                                style={{
                                  width: `${v.value}%`,
                                  background: v.color,
                                }}
                                className="h-2 rounded-full"
                              ></div>
                            </div>

                            <p className="text-[#ffffffad] text-xs font-normal leading-[normal]">
                              {v.value?.split('.')[0]}
                              {Number(v.value) > 0 ? (
                                <span className="text-[10px]">
                                  .{v.value?.split('.')[1]}
                                </span>
                              ) : null}
                              %
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SingleProposal;
