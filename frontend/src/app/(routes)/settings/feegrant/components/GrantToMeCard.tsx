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
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const { getChainInfo } = useGetChainInfo();
  const { chainLogo, chainName } = getChainInfo(chainID);

  const { allowance } = grant;
  const allowedMsgs =
    get(allowance, '@type') === ALLOWED_MSG_ALLOWANCE
      ? get(allowance, 'allowed_messages', [])
      : [];
  const isPeriodic =
    get(grant, '@type') === PERIODIC_ALLOWANCE ||
    get(grant, 'allowance.@type') === PERIODIC_ALLOWANCE;

  const isSelected = false; // TODO: set the value of isSelected based on the granter selected currently

  const handleUseFeegrant = () => {
    // TODO: handle use feegrant
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
              <span className="text-[#2BA472]">Currently Using</span>
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
            className={isSelected ? 'cancel-btn' : 'primary-btn'}
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
