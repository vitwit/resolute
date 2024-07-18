import useStaking from '@/custom-hooks/useStaking';
import { get } from 'lodash';
import Image from 'next/image';
import React, { useState, useRef, RefObject, useEffect } from 'react';
import useValidator from '@/custom-hooks/useValidator';
import { Chains } from '@/store/features/staking/stakeSlice';
import DelegatePopup from '../components/DelegatePopup';
import UndelegatePopup from '../components/UndelegatePopup';
import ReDelegatePopup from '../components/ReDelegatePopup';
import WithConnectionIllustration from '@/components/illustrations/withConnectionIllustration';
import ValidatorName from './ValidatorName';
import DelegationsLoading from './loaders/DelegationsLoading';
import Link from 'next/link';

function StakingDelegations({
  delegations,
  isSingleChain,
}: {
  delegations: Chains;
  isSingleChain: boolean;
}) {
  const staking = useStaking({ isSingleChain: isSingleChain });
  const validator = useValidator();

  // Function to get the commission rate of a validator
  const getCommisionRate = (valAddress: string, chainID: string) => {
    const v = validator.getValidatorDetails(valAddress, chainID);
    return Number(get(v, 'commission.commission_rates.rate', 0)) * 100;
  };

  // Function to get the total rewards for a specific chain
  const getChainTotalRewards = (chainID: string) =>
    staking.chainTotalRewards(chainID);

  // Function to claim rewards for a specific validator
  const withClaimValRewards = (validator: string, chainID: string) =>
    staking.txWithdrawValRewards(validator, chainID);

  // Function to claim rewards for a specific chain
  const withClaimRewards = (chainID: string) =>
    staking.txWithdrawCliamRewards(chainID);

  // Function to restake rewards for a specific chain
  const restakeRewards = (chainID: string) =>
    staking.transactionRestake(chainID);

  // Function to get the rewards for a specific validator
  const getValRewards = (val: string, chainID: string) =>
    staking.chainTotalValRewards(val, chainID);

  // Get the status of claim transactions
  const claimTxStatus = staking.getClaimTxStatus();

  const restakeStatus = staking.txAllChainStakeTxStatus;

  let bondingCount = 0;

  Object.entries(delegations).forEach(([, value]) => {
    get(value, 'delegations.delegations.delegation_responses', []).forEach(
      () => {
        bondingCount++;
      }
    );
  });

  return (
    <div
      className={`flex flex-col w-full ${isSingleChain ? 'mt-0' : 'mt-4'} ${!isSingleChain && staking.delegationsLoading === 0 && !bondingCount ? '' : 'gap-6'}`}
    >
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <div className="text-h2 mb-1">Delegations</div>
            <div className="secondary-text">Summary of staked assets</div>
          </div>
          <div className="flex gap-4 items-end">
            <div className="flex items-center gap-2">
              <p className="status-active"></p>
              <p className="text-[12px] font-extralight">Active</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="status-unbonded"></p>
              <p className="text-[12px] font-extralight">Inactive</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="status-jailed"></p>
              <p className="text-[12px] font-extralight">Jailed</p>
            </div>
          </div>
        </div>
        <div className="divider-line"></div>
      </div>

      {!isSingleChain && staking.delegationsLoading === 0 && !bondingCount ? (
        <WithConnectionIllustration message="No Delegations" />
      ) : null}

      {isSingleChain && !bondingCount ? (
        <WithConnectionIllustration message="No Delegations" />
      ) : null}

      {Object.entries(delegations).map(([key, value], index) =>
        get(value, 'delegations.delegations.delegation_responses.length') ? (
          <div key={index} className="px-6 py-0">
            <div className="flex flex-col">
              <div className="flex justify-between w-full mb-4">
                <div className="flex space-x-4 items-center">
                  <div className="flex flex-col gap-1">
                    <div className="space-x-2 flex items-center">
                      <Image
                        src={staking.chainLogo(key)}
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full"
                        alt="chain-logo"
                        draggable={false}
                      />
                      <p className="text-[14px] font-normal leading-8 flex justify-center items-center capitalize">
                        {staking.chainName(key)}
                      </p>
                    </div>
                    <div className="flex gap-4 ml-8">
                      <div className="flex gap-2 items-center">
                        <p className="text-xs font-bold leading-[normal]">
                          {
                            staking
                              .getAmountObjectWithDecimal(
                                Number(
                                  get(value, 'delegations.totalStaked', 0)
                                ),
                                key
                              )
                              .amount?.split('.')[0]
                          }
                          .{' '}
                          <span className="text-[10px]">
                            {
                              staking
                                .getAmountObjectWithDecimal(
                                  Number(
                                    get(value, 'delegations.totalStaked', 0)
                                  ),
                                  key
                                )
                                .amount?.split('.')[1]
                            }
                          </span>{' '}
                          {
                            staking.getAmountObjectWithDecimal(
                              Number(get(value, 'delegations.totalStaked', 0)),
                              key
                            ).denom
                          }
                        </p>
                        <p className="text-[rgba(255,255,255,0.50)] text-[12px] font-extralight leading-[18px]">
                          Total Staked
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <p className="text-xs font-bold leading-[normal]">
                          {getChainTotalRewards(key).split('.')[0]}.
                          <span className="text-[10px]">
                            {
                              getChainTotalRewards(key)
                                .split('.')[1]
                                .split(' ')[0]
                            }
                          </span>
                          {' ' +
                            getChainTotalRewards(key)
                              .split('.')[1]
                              .split(' ')[1]}
                        </p>
                        <p className="text-[rgba(255,255,255,0.50)] text-[12px] font-extralight leading-[18px]">
                          Total Rewards
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4 items-end">
                  <button
                    onClick={() => withClaimRewards(key)}
                    className="primary-btn"
                  >
                    {claimTxStatus[key]?.tx?.status === 'pending' ? (
                      'pending....'
                    ) : (
                      <>
                        Claim All
                        {/* <p className="ml-2 text-small-light">Rewards</p> */}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => restakeRewards(key)}
                    className="primary-btn h-[25px]"
                  >
                    {restakeStatus[key]?.reStakeTxStatus === 'pending' ? (
                      'pending....'
                    ) : (
                      <>
                        Restake
                        {/* <p className="ml-2 text-small-light">Rewards</p> */}
                      </>
                    )}
                  </button>
                </div>
              </div>
              {/* <div className="divider-line mb-4"></div> */}
            </div>
            <div className="grid grid-cols-1 w-full gap-4">
              {get(
                value,
                'delegations.delegations.delegation_responses',
                []
              ).map((data, dataid) => (
                <div key={dataid} className="delegations-card w-full">
                  <div className="flex items-center justify-between w-full gap-10">
                    <div className="flex flex-col items-start gap-2 w-1/3">
                      <p className="text-small">Validator Name</p>
                      <ValidatorName
                        valoperAddress={get(
                          data,
                          'delegation.validator_address'
                        )}
                        chainID={key}
                        hasStatus={true}
                      />
                    </div>
                    <div className="flex flex-col items-start gap-2 w-1/4">
                      <p className="text-small">Staked Amount</p>
                      <p className="text-b1">
                        {
                          staking
                            .getAmountObjectWithDecimal(
                              Number(get(data, 'balance.amount')),
                              key
                            )
                            .amount?.split('.')[0]
                        }
                        .{' '}
                        <span className="text-[12px]">
                          {
                            staking
                              .getAmountObjectWithDecimal(
                                Number(get(data, 'balance.amount')),
                                key
                              )
                              .amount?.split('.')[1]
                          }
                        </span>
                        {' ' +
                          staking.getAmountObjectWithDecimal(
                            Number(get(data, 'balance.amount')),
                            key
                          ).denom}
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-2 w-1/4">
                      <p className="text-small">Rewards</p>
                      <p className="text-b1">
                        {
                          getValRewards(
                            get(data, 'delegation.validator_address'),
                            key
                          ).split('.')[0]
                        }
                        .
                        <span className="text-[12px]">
                          {
                            getValRewards(
                              get(data, 'delegation.validator_address'),
                              key
                            )
                              .split('.')[1]
                              .split(' ')[0]
                          }
                        </span>
                        {' ' +
                          getValRewards(
                            get(data, 'delegation.validator_address'),
                            key
                          )
                            .split('.')[1]
                            .split(' ')[1]}
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-2 w-1/4">
                      <p className="text-small">Commission</p>
                      <p className="text-b1">
                        {getCommisionRate(
                          get(data, 'delegation.validator_address'),
                          key
                        )}{' '}
                        %
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <StakingActionsPopup
                        chainID={key}
                        withClaimRewards={withClaimValRewards}
                        validator={get(data, 'delegation.validator_address')}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null
      )}

      {!isSingleChain && staking.delegationsLoading !== 0 ? (
        <DelegationsLoading />
      ) : null}
    </div>
  );
}

interface PopupProps {
  validator: string;
  chainID: string;
  withClaimRewards: (validator: string, chainID: string) => void;
}

const StakingActionsPopup: React.FC<PopupProps> = ({
  validator,
  chainID,
  withClaimRewards,
}) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const [openDelegate, setOpenDelegate] = useState<boolean>(false);
  const [openUnDelegate, setOpenUnDelegate] = useState<boolean>(false);
  const [openReDelegate, setOpenReDelegate] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef: RefObject<HTMLImageElement> = useRef<HTMLImageElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Handle click on the image to toggle the popup
  const handleImageClick = (): void => {
    setShowPopup(!showPopup);
  };

  // Toggle the visibility of Delegate Popup
  const openDelegatePopup = (): void => setOpenDelegate(!openDelegate);

  // Toggle the visibility of Undelegate Popup
  const openUnDelegatePopup = (): void => setOpenUnDelegate(!openUnDelegate);

  // Toggle the visibility of Redelegate Popup
  const openReDelegatePopup = (): void => setOpenReDelegate(!openReDelegate);

  // Claim rewards for the specified validator and chain
  const claimRewards = () => withClaimRewards(validator, chainID);

  return (
    <div className="relative">
      {openDelegate && (
        <DelegatePopup
          validator={validator}
          chainID={chainID}
          openDelegatePopup={openDelegatePopup}
          openPopup={openDelegate}
        />
      )}
      {openUnDelegate && (
        <UndelegatePopup
          validator={validator}
          chainID={chainID}
          openDelegatePopup={openUnDelegatePopup}
          openPopup={openUnDelegate}
        />
      )}
      {openReDelegate && (
        <ReDelegatePopup
          validator={validator}
          chainID={chainID}
          openPopup={openReDelegate}
          openReDelegatePopup={openReDelegatePopup}
        />
      )}

      <Image
        src="/more.svg"
        width={30}
        height={30}
        alt="More-Icon"
        className="cursor-pointer"
        onClick={handleImageClick}
        ref={buttonRef}
      />
      {showPopup ? (
        <div
          ref={popupRef}
          className="absolute top-4 right-0 z-10 more-popup-grid"
        >
          <button
            className="flex items-center w-full p-4 text-b1 hover:bg-[#FFFFFF10] rounded-t-2xl"
            onClick={openDelegatePopup}
          >
            Delegate
          </button>
          <button
            className="flex items-center w-full p-4 text-b1 hover:bg-[#FFFFFF10]"
            onClick={claimRewards}
          >
            Claim
          </button>
          <button
            className="flex items-center w-full p-4 text-b1 hover:bg-[#FFFFFF10]"
            onClick={openUnDelegatePopup}
          >
            Undelegate
          </button>
          <button
            className="flex items-center w-full p-4 text-b1 hover:bg-[#FFFFFF10] rounded-b-2xl"
            onClick={openReDelegatePopup}
          >
            Redelegate
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default StakingDelegations;
