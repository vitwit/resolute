import useStaking from '@/custom-hooks/useStaking';
import { get } from 'lodash';
import Image from 'next/image';
import React, { useState } from 'react';
import ValidatorName from './ValidatorName';
import useValidator from '@/custom-hooks/useValidator';
import { Chains } from '@/store/features/staking/stakeSlice';
import DelegatePopup from '../components/DelegatePopup';
import UndelegatePopup from '../components/UndelegatePopup';
import ReDelegatePopup from '../components/ReDelegatePopup';
import CustomLoader from '@/components/common/CustomLoader';
import WithConnectionIllustration from '@/components/illustrations/withConnectionIllustration';

function StakingDelegations({ delegations, isSingleChain }: { delegations: Chains, isSingleChain?: boolean }) {
  const staking = useStaking();
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
    get(value, 'delegations.delegations.delegation_responses', []).forEach(() => {
      bondingCount++
    });
  });

  return (
    <div className="flex flex-col w-full gap-10 pb-28">
      <div className="space-y-2 items-start">
        <div className="text-h2">Delegations</div>
        <div className="secondary-text">
          Connect your wallet now to access all the modules on resolute
        </div>
        <div className="horizontal-line"></div>
      </div>
      {!isSingleChain && staking.delegationsLoading !== 0 ? (
        <CustomLoader loadingText="Loading..." />
      ) : null}

      {staking.delegationsLoading === 0 && !bondingCount ? (
        <WithConnectionIllustration message="No Delegations" />
      ) : null}

      {Object.entries(delegations).map(([key, value], index) =>
        get(value, 'delegations.delegations.delegation_responses.length') ? (
          <div key={index} className="px-6 py-0">
            <div className="flex justify-between w-full mb-4">
              <div className="flex space-x-4">
                <div className="space-x-2 flex justify-center items-center">
                  <Image
                    src={staking.chainLogo(key)}
                    width={32}
                    height={32}
                    className="h-8 w-8"
                    alt="chain-logo"
                  />
                  <p className="text-white text-base font-normal leading-8 flex justify-center items-center">
                    {key}
                  </p>
                </div>
                <div className="staked-amount-red-badge text-white text-[10px] font-light leading-6">
                  Total staked:{' '}
                  {staking.getAmountWithDecimal(
                    Number(get(value, 'delegations.totalStaked', 0)),
                    key
                  )}
                </div>
              </div>
              <button
                onClick={() => withClaimRewards(key)}
                className="primary-btn"
              >
                {claimTxStatus[key]?.tx?.status === 'pending' ? (
                  'pending....'
                ) : (
                  <>
                    Claim {getChainTotalRewards(key)}
                    <p className="ml-2 text-small-light">Rewards</p>
                  </>
                )}
              </button>
              <button
                onClick={() => restakeRewards(key)}
                className="primary-btn"
              >
                {restakeStatus[key]?.reStakeTxStatus === 'pending' ? (
                  'pending....'
                ) : (
                  <>
                    Claim & Stake
                    {/* <p className="ml-2 text-small-light">Rewards</p> */}
                  </>
                )}
              </button>
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
                        {staking.getAmountWithDecimal(
                          Number(get(data, 'balance.amount')),
                          key
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-2 w-1/4">
                      <p className="text-small">Rewards</p>
                      <p className="text-b1">
                        {getValRewards(
                          get(data, 'delegation.validator_address'),
                          key
                        )}
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
  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const [openDelegate, setOpenDelegate] = useState<boolean>(false);
  const [openUnDelegate, setOpenUnDelegate] = useState<boolean>(false);
  const [openReDelegate, setOpenReDelegate] = useState<boolean>(false);
  console.log({ popupPosition });
  // Handle click on the image to toggle the popup
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>): void => {
    setShowPopup(!showPopup);
    const rect = e.currentTarget.getBoundingClientRect();
    setPopupPosition({
      top: rect.top + window.scrollY,
      left: rect.right + window.scrollX + 10,
    });
    setPopupPosition({ top: 0, left: 0 });
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
      />
      {showPopup && (
        <div className="absolute top-4 right-0 z-10 more-popup-grid">
          <button
            className="flex items-center w-full p-4 text-b1 hover:bg-[#FFFFFF10]"
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
            Un Delegate
          </button>
          <button
            className="flex items-center w-full p-4 text-b1 hover:bg-[#FFFFFF10]"
            onClick={openReDelegatePopup}
          >
            Re Delegate
          </button>
        </div>
      )}
    </div>
  );
};

export default StakingDelegations;
