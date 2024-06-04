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

function StakingDelegations({ delegations }: { delegations: Chains }) {
  const staking = useStaking();

  const validator = useValidator();

  const getCommisionRate = (valAddress: string, chainID: string) => {
    const v = validator.getValidatorDetails(valAddress, chainID);
    return Number(get(v, 'commission.commission_rates.rate', 0)) * 100;
  };

  const getChainTotalRewards = (chainID: string) => {
    return staking.chainTotalRewards(chainID);
  };

  const withClaimRewards = (chainID: string) => {
    staking.txWithdrawCliamRewards(chainID)
  }

  const claimTxStatus = staking.getClaimTxStatus()

  return (
    <div className="flex flex-col w-full gap-10">
      <div className="space-y-2 items-start">
        <div className="text-h2">Delegations</div>
        <div className="secondary-text">
          Connect your wallet now to access all the modules on resolute{' '}
        </div>
        <div className="horizontal-line"></div>
      </div>

      {Object.entries(delegations).map(([key, value], index) => {
        return (
          get(value, 'delegations.delegations.delegation_responses.length') && (
            <div key={index} className="px-6 py-0">
              <div className="flex justify-between w-full mb-4">
                <div className="flex space-x-4">
                  <div className="space-x-2 flex justify-center items-center">
                    <Image
                      src={staking.chainLogo(key)}
                      width={32}
                      height={32}
                      className="h-8 w-8"
                      alt="akash-logo"
                    />
                    <p className="text-white text-base font-normal leading-8 flex justify-center items-center">
                      {key}
                    </p>
                  </div>
                  <div className="staked-amount-red-badge text-white text-[10px] font-light leading-6">
                    Total staked : &nbsp;
                    {staking.getAmountWithDecimal(
                      Number(get(value, 'delegations.totalStaked', 0)),
                      key
                    )}
                  </div>
                </div>
                <div className="">
                  <button onClick={() => withClaimRewards(key)} className="primary-btn">
                    {
                      claimTxStatus[key]?.tx?.status === 'pending' ? 'loading....' :
                        <>Claim &nbsp;
                          {getChainTotalRewards(key)}
                          <p className="ml-2 text-small-light">Rewards</p></>
                    }
                  </button>
                </div>
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
                        <p className="text-b1">0.9876 AKT</p>
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
                        <ImageWithPopup
                          chainID={key}
                          validator={get(
                            data,
                            'delegation.validator_address'
                          )} delegator={get(
                            data,
                            'delegation.delegator_address'
                          )} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) || null
        );
      })}
    </div>
  );
}

interface PopupPosition {
  top: number;
  left: number;
}

interface PopupProps {
  delegator: string;
  validator: string;
  chainID: string;
}


const ImageWithPopup: React.FC<PopupProps> = ({ validator, delegator, chainID }) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupPosition, setPopupPosition] = useState<PopupPosition>({ top: 0, left: 0 });
  const [openDelegate, setOpenDelegate] = useState<boolean>(false);
  const [openUnDelegate, setOpenUnDelegate] = useState<boolean>(false);
  const [openReDelegate, setOpenReDelegate] = useState<boolean>(false);

  console.log(popupPosition)

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>): void => {
    setShowPopup(!showPopup);
    const rect = e.currentTarget.getBoundingClientRect();
    setPopupPosition({
      top: rect.top + window.scrollY,
      left: rect.right + window.scrollX + 10, // Adjust for the popup to appear beside the image
    });
    setPopupPosition({ top: 0, left: 0 })
  };

  const openDelegatePopup = (): void => {
    setOpenDelegate(!openDelegate)
  };

  const openUnDelegatePopup = (): void => {
    setOpenUnDelegate(!openUnDelegate)
  };

  const openReDelegatePopup = (): void => {
    setOpenReDelegate(!openReDelegate)
  };

  return (
    <div className="relative">

      {
        openDelegate ? <DelegatePopup
          validator={validator}
          chainID={chainID}
          openDelegatePopup={openDelegatePopup} openPopup={openDelegate} /> : null
      }

      {
        openUnDelegate ? <UndelegatePopup
          validator={validator}
          chainID={chainID}
          openDelegatePopup={openUnDelegatePopup} openPopup={openUnDelegate} /> : null
      }

      {
        openReDelegate ? <ReDelegatePopup
        validator={validator}
        chainID={chainID}
         openPopup={openReDelegate}
        /> : null
      }

      <Image
        src="/more.svg"
        width={24}
        height={24}
        alt="More-Icon"
        className="cursor-pointer"
        onClick={handleImageClick}
      />
      {showPopup && (
        <div className="absolute top-0 left-0 rounded mt-9 w-36 border border-gray-200 shadow-lg z-10">
          <button
            className="w-full px-4 py-2 bg-gray-200 text-black  hover:bg-gray-600"
            onClick={openDelegatePopup}
          >
            {'Delegate'}
          </button>
          <button
            className="w-full px-4 py-2 bg-gray-200 text-black  hover:bg-gray-600"
            onClick={openUnDelegatePopup}
          >
            {'Un Delegate'}
          </button>
          <button
            className="w-full px-4 py-2 bg-gray-200 text-black  hover:bg-gray-600"
            onClick={openReDelegatePopup}
          >
            {'Re Delegate'}
          </button>
        </div>
      ) || null}
    </div>
  );
};


export default StakingDelegations;
