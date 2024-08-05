import React, { useState } from 'react';
import Image from 'next/image';
import Copy from '@/components/common/Copy';
import DialogViewDetails from './DialogViewDetails';
import useFeeGrants from '@/custom-hooks/useFeeGrants';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { TICK_ICON } from '@/constants/image-names';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { get } from 'lodash';
import {
  capitalizeFirstLetter,
  convertToSpacedName,
  shortenAddress,
} from '@/utils/util';
import { getTypeURLName } from '@/utils/authorizations';
import FeegrantToMeLoading from './FeegrantToMeLoading';
import { Tooltip } from '@mui/material';
import { ALLOWED_MSG_ALLOWANCE } from '@/utils/feegrant';

const FeegrantsToMe = ({ chainIDs }: { chainIDs: string[] }) => {
  const { getGrantsToMe } = useFeeGrants();
  const addressGrants = getGrantsToMe(chainIDs);

  const loading = useAppSelector(
    (state) => state.feegrant.getGrantsToMeLoading
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6 pt-6">
      {addressGrants?.length ? (
        <>
          {addressGrants.map((addressGrant) => (
            <React.Fragment key={addressGrant.address}>
              {!!addressGrant.grants.length && (
                <GrantToMeCard
                  chainID={addressGrant.chainID}
                  grant={addressGrant?.grants[0]}
                  address={addressGrant.address}
                />
              )}
            </React.Fragment>
          ))}
        </>
      ) : !!loading ? (
        <FeegrantToMeLoading />
      ) : (
        // TODO: Display empty illutration
        <div>No Feegrants</div>
      )}
      <DialogViewDetails open={dialogOpen} onClose={handleCloseDialog} />
    </div>
  );
};

export default FeegrantsToMe;

interface GrantToMeCardprops {
  chainID: string;
  address: string;
  grant: Allowance;
}

const GrantToMeCard = (props: GrantToMeCardprops) => {
  const { address, chainID, grant } = props;

  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

  let allowedMsgs: Array<string>;
  const { allowance } = grant;

  if (get(allowance, '@type') === ALLOWED_MSG_ALLOWANCE) {
    allowedMsgs = get(allowance, 'allowed_messages', []);
  } else {
    allowedMsgs = [];
  }
  const { getChainInfo } = useGetChainInfo();
  const { chainLogo, chainName } = getChainInfo(chainID);

  // TODO: set the value of isSelected based on the granter selected currently
  const isSelected = false;

  // TODO: handle use feegrant
  const handleUseFeegrant = () => {};

  const toggleViewDetails = () => {
    setViewDetailsOpen((prev) => !prev);
  };

  return (
    <div
      className={`grants-card justify-between items-start gap-16 w-full ${
        isSelected ? 'selected-grants-card' : ''
      }`}
    >
      <div className="flex flex-col gap-2 w-[216px]">
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
          <p className="truncate text-b1">{shortenAddress(address, 24)}</p>
          <Copy content={address} />
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <p className="text-b1-light">Allowed Messages</p>
        <div className="flex gap-2 flex-wrap">
          {allowedMsgs.length > 0 ? (
            allowedMsgs.map((message: string) => (
              <div
                className="permission-card flex gap-2 items-center"
                key={message}
              >
                <p className="text-b1">
                  {convertToSpacedName(getTypeURLName(message))}
                </p>
                <Tooltip
                  title={capitalizeFirstLetter(chainName)}
                  placement="top"
                >
                  <Image
                    src={chainLogo}
                    width={16}
                    height={16}
                    alt={chainName}
                  />
                </Tooltip>
              </div>
            ))
          ) : (
            <div className="permission-card">
              <p className="text-b1">All</p>
              <Tooltip title={capitalizeFirstLetter(chainName)} placement="top">
                <Image src={chainLogo} width={16} height={16} alt={chainName} />
              </Tooltip>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-[21px]"></div>
        <div className="flex gap-6 items-center">
          <button
            className={isSelected ? 'cancel-btn' : 'primary-btn'}
            onClick={() => handleUseFeegrant()}
          >
            {isSelected ? 'Cancel' : 'Use Allowance'}
          </button>
          <div className="secondary-btn" onClick={toggleViewDetails}>
            View Details
          </div>
        </div>
      </div>
      <DialogViewDetails open={viewDetailsOpen} onClose={toggleViewDetails} />
    </div>
  );
};
