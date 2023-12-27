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
}: {
  isRightBarOpen: boolean;
  chainIDs: string[];
  status: string;
  handleOpenOverview: handleOpenOverview;
  handleSetCurrentOverviewId: handleSetCurrentOverviewId;
  currentOverviewId: number;
  handleProposalSelected: (value: boolean) => void;
  isSelected: boolean;
}) => {
  const dispatch = useAppDispatch();
  const [selectedChainsProposals, setSelectedChainsProposals] =
    useState<Chains>({});

  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
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
      const basicChainInputs = {
        baseURL: chainInfo.config.rest,
        voter: address,
        chainID,
      };

      dispatch(getProposalsInVoting(basicChainInputs));
      dispatch(
        getProposalsInDeposit({
          baseURL: chainInfo.config.rest,
          chainID,
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
      {allProposalsLength === 0 ? (
        <div className="space-y-4 w-full">
          <div className="flex justify-between">
            <div className="flex space-x-2 flex-1">
              <div className="flex flex-col flex-1 justify-center items-center mt-[100px]">
                <Image
                  src="/gov-illustration.png"
                  width={610}
                  height={464}
                  alt="no action proposals"
                />
                <p className="text-white text-center text-base italic font-extralight leading-[normal]">
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
                  <div className="v-line"></div>

                  <div className="space-y-2">
                    {get(
                      chainProposal,
                      `${status === 'deposit' ? 'deposit' : 'active'}.proposals`
                    ).map((proposal, index) => (
                      <div
                        onClick={() => {
                          handleOpenOverview();
                          handleSetCurrentOverviewId(
                            parseInt(get(proposal, 'proposal_id')),
                            chainID
                          );
                          handleProposalSelected(true);
                        }}
                        className={
                          isSelected &&
                          currentOverviewId.toString() ===
                            get(proposal, 'proposal_id')
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
                                  get(proposal, 'proposal_id')
                                  ? 'proposal-id'
                                  : 'proposal-id proposal-id-static'
                              }
                            >
                              <p className="proposal-text-extralight">
                                {get(proposal, 'proposal_id')}
                              </p>
                            </div>

                            <p className="proposal-text-normal">
                              {get(proposal, 'content.title') ||
                                get(proposal, 'content.@type')}
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
                                  <p className="proposal-text-small w-[144px]">
                                    Expires in{' '}
                                    {getTimeDifferenceToFutureDate(
                                      get(proposal, 'voting_end_time')
                                    )}
                                  </p>
                                )}
                              </div>
                              {/* <div className="flex space-x-1">
                            <Image
                              src="/vote-icon.svg"
                              width={24}
                              height={24}
                              alt="Vote-Icon"
                            />
                            <p className="proposal-text-small">
                              {get(proposal, 'status') ===
                              'PROPOSAL_STATUS_VOTING_PERIOD'
                                ? 'Active'
                                : 'Deposit'}
                            </p>
                          </div> */}
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
    </div>
  );
};

export default AllProposals;
