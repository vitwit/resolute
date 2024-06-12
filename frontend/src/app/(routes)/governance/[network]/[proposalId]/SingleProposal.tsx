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

const SingleProposal: React.FC<SingleProposalProps> = ({ chainID, proposalID }) => {
    const [showFullText, setShowFullText] = useState(false);
    const [proposalMarkdown, setProposalMarkdown] = useRemark();
    const [quorumPercent, setQuorumPercent] = useState<string>('0');
    const [depositDialogOpen, setDepositDialogOpen] = useState(false);

    const dispatch = useAppDispatch();

    const proposalInfo = useAppSelector((state: RootState) => state.gov.proposalDetails);
    const networkLogo = useAppSelector((state: RootState) => state.wallet.networks[chainID]?.network.logos.menu);
    const isStatusVoting = get(proposalInfo, 'status') === 'PROPOSAL_STATUS_VOTING_PERIOD';
    const networks = useAppSelector((state: RootState) => state.wallet.networks);
    const poolInfo = useAppSelector((state: RootState) => state.staking.chains[chainID]?.pool);
    const tallyParams = useAppSelector((state: RootState) => state.gov.chains[chainID]?.tallyParams.params.tally_params);
    const quorumRequired = (parseFloat(tallyParams?.quorum) * 100).toFixed(1);
    const tallyResult = useAppSelector((state: RootState) => state.gov.chains[chainID]?.tally?.proposalTally?.[proposalID]);

    const totalVotes = [
        'yes',
        'no',
        'abstain',
        'no_with_veto'
    ].reduce((sum, key) => sum + Number(get(tallyResult, key, get(tallyResult, `${key}_count`)) || 0), 0);

    const fetchProposalData = () => {
        const chainInfo = networks[chainID]?.network;
        if (!chainInfo) return;

        const baseURLs = chainInfo.config.restURIs;
        const baseURL = chainInfo.config.rest;
        const govV1 = chainInfo.govV1;

        dispatch(getProposal({ chainID, baseURLs, baseURL, proposalId: Number(proposalID), govV1 }));
        dispatch(getProposalTally({ chainID, baseURLs, baseURL, proposalId: Number(proposalID), govV1 }));
        dispatch(getPoolInfo({ chainID, baseURLs }));
        dispatch(getDepositParams({ chainID, baseURLs, baseURL }));
        dispatch(getGovTallyParams({ chainID, baseURL, baseURLs }));
    };

    const handleToggleText = () => setShowFullText(!showFullText);

    useEffect(() => {
        const proposalDescription = get(proposalInfo, 'content.description', get(proposalInfo, 'summary', ''));
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
        return votesCount && totalVotes ? ((votesCount / totalVotes) * 100).toFixed(2) : '0';
    };

    const data = [
        { value: getVotesPercentage(Number(get(tallyResult, 'yes', get(tallyResult, 'yes_count')))), count: Number(get(tallyResult, 'yes', get(tallyResult, 'yes_count'))), color: '#4AA29C', label: 'Yes' },
        { value: getVotesPercentage(Number(get(tallyResult, 'no', get(tallyResult, 'no_count')))), count: Number(get(tallyResult, 'no', get(tallyResult, 'no_count'))), color: '#E57575', label: 'No' },
        { value: getVotesPercentage(Number(get(tallyResult, 'abstain', get(tallyResult, 'abstain_count')))), count: Number(get(tallyResult, 'abstain', get(tallyResult, 'abstain_count'))), color: '#EFFF34', label: 'Abstain' },
        { value: getVotesPercentage(Number(get(tallyResult, 'no_with_veto', get(tallyResult, 'no_with_veto_count')))), count: Number(get(tallyResult, 'no_with_veto', get(tallyResult, 'no_with_veto_count'))), color: '#5885AF', label: 'Veto' }
    ];

    const isProposal2daysgo = () => {
        const targetDate = new Date(get(proposalInfo, 'voting_end_time'));
        const currentDate = new Date();
        const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000;

        const timeDifference = targetDate.getTime() - currentDate.getTime();
        return timeDifference <= twoDaysInMilliseconds && timeDifference > 0;
    };

    return (
        <>
            {/* Banner */}
            {
                isProposal2daysgo() ? <div className="fixed w-full bg-[#ffc13c] gap-2 px-6 py-3 flex items-center">
                    <Image src="/infoblack.svg" width={24} height={24} alt="info-icon" />
                    <p className="text-[#1C1C1D] text-sm font-semibold leading-[normal]">
                        Important
                    </p>
                    <p className="text-[#1C1C1D] text-sm font-normal leading-[normal]">
                        Voting ends in {getTimeDifferenceToFutureDate(get(proposalInfo, 'voting_end_time'))}
                    </p>
                </div> : null
            }


            <div className="flex items-start gap-10 pt-20 pb-0 px-10 w-full h-full">
                <div className="flex items-start gap-20 w-full h-full">
                    <div className="flex flex-col flex-1 justify-between h-full">
                        <div className="flex flex-col gap-6">
                            <div className="secondary-btn">Go back</div>
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between w-full">
                                    <p className="text-white text-[28px] font-bold leading-[normal]">
                                        {/* Aave v3.1 Cantina competitione */}
                                        {get(proposalInfo, 'proposal_id', get(proposalInfo, 'id'))}.

                                        &nbsp;&nbsp;&nbsp;

                                        {get(
                                            proposalInfo,
                                            'content.title',
                                            get(proposalInfo, 'title', '-')
                                        ) || get(proposalInfo, 'content.@type', '')}
                                    </p>
                                    <div className="active-btn text-white text-sm font-normal leading-[normal]">
                                        Active
                                    </div>
                                </div>
                                <div className="flex gap-6 w-full">
                                    {/* <div className="flex gap-2">
                                        <p className="text-[rgba(255,255,255,0.50)] text-xs font-extralight leading-[normal]">
                                            By
                                        </p>
                                        <p className="text-white text-sm font-normal leading-[normal]">
                                            0x2cc1...c54Df1
                                        </p>
                                    </div> */}
                                    <div className="flex gap-2">
                                        {
                                            isStatusVoting ? <>
                                                <p className="text-[rgba(255,255,255,0.50)] text-xs font-extralight leading-[normal]">
                                                    Voting
                                                </p>
                                                <p className="text-white text-sm font-normal leading-[normal]">
                                                    Ends in {getTimeDifferenceToFutureDate(get(proposalInfo, 'voting_end_time'))}
                                                </p>
                                            </> : null
                                        }


                                    </div>
                                    <div className="flex gap-2">
                                        <p className="text-[rgba(255,255,255,0.50)] text-xs font-extralight leading-[normal]">
                                            on
                                        </p>
                                        <Image
                                            src={networkLogo}
                                            width={20}
                                            height={20}
                                            alt="Network-logo"
                                        />
                                        <p className="text-white text-sm font-normal leading-[normal]">
                                            {chainID}
                                        </p>
                                    </div>
                                </div>
                                <div className="divider-line"></div>
                            </div>

                            <div className="text-white h-[40vh]  flex flex-col justify-between relative">
                                <p
                                    className={`h-[40vh] ${showFullText ? 'overflow-scroll' : 'overflow-hidden'}`}
                                >
                                    {/* {ProposalSummary} */}
                                    {proposalMarkdown}
                                </p>

                                {showFullText ? (
                                    <p
                                        onClick={handleToggleText}
                                        className="cursor-pointer text-white justify-center text-sm font-normal leading-[normal] underline flex space-x-1 items-center"
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
                                    <div className="h-32 w-full relative flex">
                                        <div
                                            onClick={handleToggleText}
                                            className="cursor-pointer justify-center w-full bottom-14 absolute flex z-10 text-lg font-normal leading-[normal] underline  space-x-1  "
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
                                        <div className="blur w-full absolute bottom-0  h-32"> </div>
                                    </div>
                                    
                                )}
                            </div>
                            <div className="cast-vote-grid ">
                            {
                                isStatusVoting ? <>
                                    <div className="flex px-6 py-4 rounded-2xl bg-[#FFFFFF05] justify-between w-full">
                                        <p className="text-white text-xs not-italic font-normal leading-[18px]">
                                            Caste your vote
                                        </p>
                                        <p className="text-white text-xs font-extralight leading-[18px]">
                                            Voting ends in {getTimeDifferenceToFutureDate(get(proposalInfo, 'voting_end_time'))}
                                        </p>
                                    </div>

                                    <Vote proposalId={proposalID} chainID={chainID} />
                                </> : <>
                                    <CustomButton
                                        btnText={
                                            true ? 'Deposit' : 'Connect Wallet to Deposit'
                                        }
                                        btnOnClick={() => {
                                            setDepositDialogOpen(true)
                                        }}
                                        btnStyles='items-center'
                                    />
                                    <DialogDeposit
                                        chainID={chainID}
                                        endTime={get(proposalInfo, 'deposit_end_time', '-')}
                                        onClose={() => setDepositDialogOpen(false)}
                                        open={depositDialogOpen}
                                        proposalId={proposalID}
                                        proposalTitle={get(
                                            proposalInfo,
                                            'content.title',
                                            get(proposalInfo, 'title', '-')
                                        ) || get(proposalInfo, 'content.@type', '')}
                                    />
                                </>
                            }
                        </div>

                        </div>

                      


                    </div>

                    {/* RightSide View */}
                    <div className="flex flex-col justify-between h-full gap-5">
                        <div className="flex flex-col gap-6 p-6 rounded-2xl bg-[#FFFFFF05]">
                            <div className="flex flex-col gap-2">
                                <p className="text-white">Proposal Timeline</p>
                                <div className="divider-line"></div>
                            </div>
                            <div className="flex space-x-2 justify-center">
                                <ProposalProjection
                                    quorumReached={
                                        parseFloat(quorumPercent) >=
                                        parseFloat(quorumRequired)
                                    }
                                    quorumPercent={quorumPercent}
                                    quorumRequired={quorumRequired}
                                    totalVotes={totalVotes}
                                    tallyResult={tallyResult || emptyTallyResult}
                                />
                            </div>
                            <div className="flex gap-4 w-full">
                                <div className="flex justify-center items-center gap-2 px-4 py-2 rounded-[100px] bg-[#FFFFFF05] w-[158px]">
                                    <p className="text-white text-xs font-bold leading-[normal]">
                                        {quorumPercent} %
                                    </p>
                                    <p className="text-[rgba(255,255,255,0.50)] text-[10px] font-extralight leading-[normal]">
                                        Turnout
                                    </p>
                                </div>
                                <div className="flex justify-center items-center gap-2 px-4 py-2 rounded-[100px] bg-[#FFFFFF05] w-[158px]">
                                    <p className="text-white text-xs font-bold leading-[normal]">
                                        {quorumRequired}%
                                    </p>
                                    <p className="text-[rgba(255,255,255,0.50)] text-[10px] font-extralight leading-[normal]">
                                        Quorum
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 p-6 rounded-2xl bg-[#FFFFFF05]">
                            <div className="flex flex-col gap-2">
                                <p className="text-white">Proposal Timeline</p>
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
                                        />
                                        <div className="vertical-line "></div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Tooltip title={getLocalTime(get(proposalInfo, 'submit_time'))} placement='top'>
                                            <p className="text-[#FFFFFF80]">
                                                {getTimeDifferenceToFutureDate(
                                                    get(proposalInfo, 'submit_time'),
                                                    true
                                                )} ago
                                            </p>
                                        </Tooltip>
                                        <p className="text-white text-xs font-normal leading-[normal]">
                                            Proposal Created
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col justify-center items-center">
                                        <Image
                                            src="/radio-clr.svg"
                                            width={12}
                                            height={12}
                                            alt="Proposal-Created"
                                        />
                                        <div className="vertical-line"></div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Tooltip title={
                                            isStatusVoting ?
                                                getLocalTime(get(proposalInfo, 'voting_start_time', '-')) :
                                                getLocalTime(get(proposalInfo, 'submit_time', '-'))} placement="top">
                                            <p className="text-[#FFFFFF80]">
                                                {
                                                    isStatusVoting ?
                                                        getTimeDifferenceToFutureDate(
                                                            get(proposalInfo, 'voting_start_time', '-'),
                                                            true
                                                        ) : getTimeDifferenceToFutureDate(
                                                            get(proposalInfo, 'submit_time', '-'),
                                                            true
                                                        )
                                                } ago
                                            </p>
                                        </Tooltip>
                                        <p className="text-white text-xs font-normal leading-[normal]">
                                            {
                                                isStatusVoting ? 'Voting ' : 'Deposit Time '
                                            }
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
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Tooltip title={
                                            isStatusVoting ?
                                                getLocalTime(get(proposalInfo, 'voting_end_time', '-')) :
                                                getLocalTime(get(proposalInfo, 'deposit_end_time', '-'))} placement="top">
                                            <p className="text-[#FFFFFF80]">
                                                in {isStatusVoting ? getTimeDifferenceToFutureDate(
                                                    get(proposalInfo, 'voting_end_time', '-')
                                                ) : getTimeDifferenceToFutureDate(
                                                    get(proposalInfo, 'deposit_end_time', '-')
                                                )}
                                            </p>
                                        </Tooltip>
                                        <p className="text-white text-xs font-normal leading-[normal]">
                                            {
                                                isStatusVoting ? 'Voting' : 'Deposit Time '
                                            } ends
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 p-6 rounded-2xl bg-[#FFFFFF05]">
                            <div className="flex flex-col gap-2">
                                <p className="text-white text-sm font-normal leading-[normal]">
                                    Current Status
                                </p>
                                <div className="divider-line"></div>
                            </div>
                            {
                                data.map(v => (
                                    <div key={v.label} className="flex flex-col gap-2">
                                        <div className="flex gap-1 items-center">
                                            <p className="text-white text-xs font-normal leading-[normal]">
                                                {v.count}
                                            </p>
                                            <p className="secondary-text">Voted {v.label}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <div className="bg-[#FFFFFF0D] w-full h-[10px] rounded-full">
                                                <div className="bg-[#f0f0f3] h-[10px] w-[4px] absolute  flex left-[224px]"></div>
                                                <div
                                                    style={{ width: `${v.value}%` }}
                                                    className={`${v.label.toLocaleLowerCase()}-bg h-2 rounded-l-full `}
                                                ></div>
                                            </div>
                                            <Image
                                                src="/tick.png"
                                                width={12}
                                                height={12}
                                                alt="tick-icon"
                                            />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleProposal;