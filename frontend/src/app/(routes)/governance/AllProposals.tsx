'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { RootState } from '@/store/store';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import {
  Chains,
  getProposalsInDeposit,
  getProposalsInVoting,
} from '@/store/features/gov/govSlice';
import './style.css';
import { get } from 'lodash';
import { getTimeDifferenceToFutureDate } from '@/utils/dataTime';
import messages from '@/utils/messages.json';
import { CircularProgress } from '@mui/material';

type handleOpenOverview = () => void;
type handleSetCurrentOverviewId = (id: number, chainID: string) => void;

const AllProposals = ({
  isRightBarOpen,
  chainIDs,
  status,
  handleOpenOverview,
  handleSetCurrentOverviewId,
  currentOverviewId,
  handleProposalSelected,
  isSelected,
  overviewPropChainID,
}: {
  isRightBarOpen: boolean;
  chainIDs: string[];
  status: string;
  handleOpenOverview: handleOpenOverview;
  handleSetCurrentOverviewId: handleSetCurrentOverviewId;
  currentOverviewId: number;
  handleProposalSelected: (value: boolean) => void;
  isSelected: boolean;
  overviewPropChainID: string;
}) => {
  const dispatch = useAppDispatch();
  const [selectedChainsProposals, setSelectedChainsProposals] =
    useState<Chains>({});

  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const activeProposalsLoading = useAppSelector(
    (state: RootState) => state.gov.activeProposalsLoading
  );
  const depositProposalsLoading = useAppSelector(
    (state: RootState) => state.gov.depositProposalsLoading
  );
  const getChainName = (chainID: string) => {
    let chain: string = '';
    Object.keys(nameToChainIDs).forEach((chainName) => {
      if (nameToChainIDs[chainName] === chainID) chain = chainName;
    });
    return chain;
  };

  const chainsProposals = useAppSelector(
    (state: RootState) => state.gov.chains
  );

  let allProposalsLength = 0;

  if (selectedChainsProposals) {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    Object.entries(selectedChainsProposals).map(
      ([_chainName, chainProposal]) => {
        allProposalsLength += get(
          chainProposal,
          `${status === 'deposit' ? 'deposit' : 'active'}.proposals.length`
        );
      }
    );
  }

  useEffect(() => {
    chainIDs.forEach((chainID) => {
      const allChainInfo = networks[chainID];
      const chainInfo = allChainInfo.network;
      const address = allChainInfo?.walletInfo?.bech32Address;
      const govV1 = allChainInfo?.network?.govV1;
      const basicChainInputs = {
        baseURLs: chainInfo.config.restURIs,
        baseURL: chainInfo.config.rest,
        voter: address,
        chainID,
        govV1,
      };

      dispatch(getProposalsInVoting(basicChainInputs));
      dispatch(
        getProposalsInDeposit({
          baseURLs: chainInfo.config.restURIs,
          baseURL: chainInfo.config.rest,
          chainID,
          govV1,
        })
      );
    });
  }, []);

  useEffect(() => {
    chainIDs.forEach((chainID) =>
      setSelectedChainsProposals((selectedChainsProposals) => {
        selectedChainsProposals[chainID] = chainsProposals[chainID];
        return selectedChainsProposals;
      })
    );
  }, [chainsProposals]);

  return (
    <div className="main-page">
      {(
        status === 'active'
          ? activeProposalsLoading === 0 && allProposalsLength === 0
          : depositProposalsLoading === 0 && allProposalsLength === 0
      ) ? (
        <div className="space-y-4 w-full">
          <div className="flex justify-between">
            <div className="flex space-x-2 flex-1">
              <div className="flex flex-col flex-1 justify-center items-center mt-[100px] space-y-4">
                <Image
                  src="/gov-illustration.png"
                  width={400}
                  height={235.5}
                  alt="no action proposals"
                  className="disable-draggable"
                />
                <p className="text-white text-center text-base italic font-extralight leading-[normal] flex justify-center opacity-50 ">
                  {messages.noProposals}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {Object.entries(selectedChainsProposals).map(
        ([chainID, chainProposal]) => {
          const chainLogo = networks[chainID]?.network?.logos?.menu || '';
          return (
            <>
              {get(
                chainProposal,
                `${
                  status === 'deposit' ? 'deposit' : 'active'
                }.proposals.length`
              ) ? (
                <div className="space-y-4 w-full">
                  <div className="flex justify-between">
                    <div className="flex space-x-2">
                      <Image
                        className="rounded-full"
                        src={chainLogo}
                        width={32}
                        height={32}
                        alt="Networks-Logo"
                      />
                      <p className="proposal-text-medium text-capitalize">
                        {getChainName(chainID)}
                      </p>
                    </div>
                  </div>
                  <div className="divider-line"></div>

                  <div className="space-y-2">
                    {get(
                      chainProposal,
                      `${status === 'deposit' ? 'deposit' : 'active'}.proposals`
                    ).map((proposal, index) => (
                      <div
                        onClick={() => {
                          handleOpenOverview();
                          handleSetCurrentOverviewId(
                            parseInt(
                              get(
                                proposal,
                                'proposal_id',
                                get(proposal, 'id', '')
                              )
                            ),
                            chainID
                          );
                          handleProposalSelected(true);
                        }}
                        className={
                          isSelected &&
                          currentOverviewId.toString() ===
                            get(
                              proposal,
                              'proposal_id',
                              get(proposal, 'id', '')
                            ) &&
                          overviewPropChainID === chainID
                            ? 'proposal proposal-selected'
                            : 'proposal'
                        }
                        key={index}
                      >
                        <div className="flex justify-between items-center w-full">
                          <div className="space-x-2 flex items-center cursor-pointer">
                            <div
                              className={
                                isSelected &&
                                currentOverviewId.toString() ===
                                  get(
                                    proposal,
                                    'proposal_id',
                                    get(proposal, 'id', '')
                                  ) &&
                                overviewPropChainID === chainID
                                  ? 'proposal-id'
                                  : 'proposal-id proposal-id-static'
                              }
                            >
                              <p className="text-white text-xs font-extralight leading-[14px] text-[10px]">
                                {get(
                                  proposal,
                                  'proposal_id',
                                  get(proposal, 'id', '')
                                )}
                              </p>
                            </div>

                            <p className="proposal-text-normal">
                              {get(
                                proposal,
                                'content.title',
                                get(proposal, 'title')
                              ) ||
                                get(
                                  proposal,
                                  'content.@type',
                                  get(proposal, 'messages[0].@type')
                                )}
                            </p>
                          </div>
                          <div className="flex space-x-6"></div>
                          {!isRightBarOpen && (
                            <div className="flex space-x-6">
                              <div className="flex space-x-1">
                                <Image
                                  src="/timer-icon.svg"
                                  width={24}
                                  height={24}
                                  alt="Timer-Icon"
                                />
                                {status === 'deposit' ? (
                                  <p className="proposal-text-small w-[164px]">
                                    Deposit ends in{' '}
                                    {getTimeDifferenceToFutureDate(
                                      get(proposal, 'deposit_end_time')
                                    )}
                                  </p>
                                ) : (
                                  <p className="proposal-text-small w-[130px]">
                                    Expires in{' '}
                                    {getTimeDifferenceToFutureDate(
                                      get(proposal, 'voting_end_time')
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          );
        }
      )}
      {(
        status === 'active'
          ? activeProposalsLoading < chainIDs?.length
          : depositProposalsLoading < chainIDs?.length
      ) ? null : (
        <div className="text-center w-full">
          <CircularProgress size={24} sx={{ color: 'white' }} />
        </div>
      )}
    </div>
  );
};

export default AllProposals;
