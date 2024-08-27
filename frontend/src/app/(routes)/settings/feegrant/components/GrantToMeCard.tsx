import React, { useState } from 'react';
import Image from 'next/image';
import Copy from '@/components/common/Copy';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { TICK_ICON } from '@/constants/image-names';
import { get } from 'lodash';
import {
  capitalizeFirstLetter,
  convertToSpacedName,
  shortenAddress,
} from '@/utils/util';
import { getTypeURLName } from '@/utils/authorizations';
import { Tooltip } from '@mui/material';
import { ALLOWED_MSG_ALLOWANCE, PERIODIC_ALLOWANCE } from '@/utils/feegrant';
import DialogFeegrantDetails from './DialogFeegrantDetails';
import FeegrantTypeBadge from './FeegrantTypeBadge';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { getAddressByPrefix } from '@/utils/address';
import useFeeGrants from '@/custom-hooks/useFeeGrants';
import { enableFeegrantMode } from '@/store/features/feegrant/feegrantSlice';
import { setFeegrantMode } from '@/utils/localStorage';
import { exitAuthzMode } from '@/store/features/authz/authzSlice';

interface GrantToMeCardProps {
  chainID: string;
  address: string;
  grant: Allowance;
}

const GrantToMeCard: React.FC<GrantToMeCardProps> = ({
  chainID,
  address,
  grant,
}) => {
  const dispatch = useAppDispatch();
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const { getChainInfo, convertToCosmosAddress } = useGetChainInfo();
  const { disableFeegrantMode } = useFeeGrants();
  const {
    chainLogo,
    chainName,
    prefix,
    address: walletAddress,
  } = getChainInfo(chainID);
  const feegranterAddress = useAppSelector(
    (state) => state.feegrant.feegrantAddress
  );
  const feegrantModeEnabled = useAppSelector(
    (state) => state.feegrant.feegrantModeEnabled
  );
  const feegranterCosmosAddress = convertToCosmosAddress(address);
  const feegranteeCosmosAddress = convertToCosmosAddress(walletAddress);

  const { allowance } = grant;
  const allowedMsgs =
    get(allowance, '@type') === ALLOWED_MSG_ALLOWANCE
      ? get(allowance, 'allowed_messages', [])
      : [];
  const isPeriodic =
    get(grant, '@type') === PERIODIC_ALLOWANCE ||
    get(grant, 'allowance.@type') === PERIODIC_ALLOWANCE;

  const isGranterSelected = () => {
    const nativeFeegranterAddress = getAddressByPrefix(
      feegranterAddress,
      prefix
    );
    return nativeFeegranterAddress === address;
  };
  const isSelected = isGranterSelected();

  const handleUseFeegrant = () => {
    if (feegrantModeEnabled) {
      disableFeegrantMode();
    } else {
      dispatch(enableFeegrantMode({ address: feegranterCosmosAddress }));
      dispatch(exitAuthzMode());
      setFeegrantMode(feegranteeCosmosAddress, feegranterCosmosAddress);
    }
  };

  const toggleViewDetails = () => {
    setViewDetailsOpen((prev) => !prev);
  };

  const renderAllowedMessages = () => {
    if (allowedMsgs.length > 0) {
      return allowedMsgs.map((message) => (
        <div className="permission-card flex gap-2 items-center" key={message}>
          <p className="text-b1">
            {convertToSpacedName(getTypeURLName(message))}
          </p>
          <Tooltip title={capitalizeFirstLetter(chainName)} placement="top">
            <Image src={chainLogo} width={16} height={16} alt={chainName} />
          </Tooltip>
        </div>
      ));
    }

    return (
      <div className="permission-card">
        <p className="text-b1">All</p>
        <Tooltip title={capitalizeFirstLetter(chainName)} placement="top">
          <Image src={chainLogo} width={16} height={16} alt={chainName} />
        </Tooltip>
      </div>
    );
  };

  return (
    <div
      className={`grants-card justify-between items-start gap-16 w-full ${isSelected ? 'selected-grants-card' : ''}`}
    >
      <div className="flex flex-col gap-2 w-[280px]">
        <div className="flex gap-2 items-center">
          <p className="text-b1-light">Address</p>
          {isSelected && (
            <div className="flex space-x-0">
              <Image src={TICK_ICON} width={16} height={16} alt="used-icon" />
              <span className="text-[#2BA472] text-[14px]">
                Currently Using
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center h-8">
          <p className="text-b1">{shortenAddress(address, 20)}</p>
          <Copy content={address} />
          <FeegrantTypeBadge isPeriodic={isPeriodic} />
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <p className="text-b1-light">Allowed Messages</p>
        <div className="flex gap-2 flex-wrap">{renderAllowedMessages()}</div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-[21px]" />
        <div className="flex gap-6 items-center">
          <button
            className={`w-[130px] ${isSelected ? 'cancel-btn' : 'primary-btn'}`}
            onClick={handleUseFeegrant}
          >
            {isSelected ? 'Cancel' : 'Use Allowance'}
          </button>
          <div className="secondary-btn" onClick={toggleViewDetails}>
            View Details
          </div>
        </div>
      </div>
      <DialogFeegrantDetails
        open={viewDetailsOpen}
        onClose={toggleViewDetails}
        chainID={chainID}
        grant={allowance}
      />
    </div>
  );
};

export default GrantToMeCard;
