import React, { useState } from 'react';
import Image from 'next/image';
import Copy from '@/components/common/Copy';
import DialogViewDetails from './DialogViewDetails';
import DialogRevokeAll from './DialogRevokeAll';
import useFeeGrants from '@/custom-hooks/useFeeGrants';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { ALLOWED_MSG_ALLOWANCE } from '@/utils/feegrant';
import { get } from 'lodash';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import {
  capitalizeFirstLetter,
  convertToSpacedName,
  shortenAddress,
} from '@/utils/util';
import { getTypeURLName } from '@/utils/authorizations';
import { Tooltip } from '@mui/material';
import CustomButton from '@/components/common/CustomButton';
import FeegrantByMeLoading from './FeegrantByMeLoading';

const FeegrantsByMe = ({ chainIDs }: { chainIDs: string[] }) => {
  const { getGrantsByMe } = useFeeGrants();
  const addressGrants = getGrantsByMe(chainIDs);
  const loading = useAppSelector(
    (state) => state.feegrant.getGrantsByMeLoading
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);

  const handleViewDetails = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleRevokeAll = () => {
    setRevokeDialogOpen(true);
  };

  const handleCloseRevokeDialog = () => {
    setRevokeDialogOpen(false);
  };

  const grants = [
    {
      address: 'pasg1y0hvu8ts6m87yltguyufwf',
      permissions: ['send', 'Delegate', 'vote', 'send'],
    },
    {
      address: 'pasg1xy2a8ts6m87yltguyufwf',
      permissions: ['send', 'Delegate', 'vote', 'send'],
    },
    {
      address: 'pasg1y0hvu8ts6m87yltguyufwf',
      permissions: [
        'send',
        'Delegate',
        'vote',
        'send',
        'send',
        'Delegate',
        'vote',
        'send',
      ],
    },
    {
      address: 'pasg1xy2a8ts6m87yltguyufwf',
      permissions: ['send', 'Delegate', 'vote', 'send'],
    },
  ];

  return (
    <div className="space-y-6 pt-6">
      {addressGrants?.length ? (
        <>
          {addressGrants.map((addressGrant) => (
            <>
              {!!addressGrant.grants.length && (
                <GranteByMeCard
                  chainID={addressGrant.chainID}
                  grant={addressGrant?.grants[0]}
                  address={addressGrant.address}
                />
              )}
            </>
          ))}
        </>
      ) : (
        <div>No grants by you</div>
      )}
      {!!loading ? <FeegrantByMeLoading /> : null}
      <DialogViewDetails open={dialogOpen} onClose={handleCloseDialog} />
      <DialogRevokeAll
        open={revokeDialogOpen}
        onClose={handleCloseRevokeDialog}
      />
    </div>
  );
};

export default FeegrantsByMe;

interface GrantByMeCardProps {
  chainID: string;
  address: string;
  grant: Allowance;
}

const GranteByMeCard = (props: GrantByMeCardProps) => {
  const { address, chainID, grant } = props;
  const dispatch = useAppDispatch();

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

  const toggleViewDetails = () => {
    setViewDetailsOpen((prev) => !prev);
  };

  // TODO: handle revoke feegrant txn
  const handleRevokeFeegrant = () => {};

  return (
    <div className="garnts-card justify-between items-end w-full">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <div className="flex gap-2 items-center">
            <Image src={chainLogo} width={20} height={20} alt="network-logo" />
            <p className="text-b1-light capitalize">{chainName}</p>
          </div>
        </div>
        <div className="flex gap-2 items-center h-8">
          <p className="truncate text-b1">{shortenAddress(address, 24)}</p>
          <Copy content={address} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-b1-light">Allowed Messages</p>
        <div className="grid grid-cols-4 gap-2">
          {allowedMsgs.length > 0 ? (
            allowedMsgs.slice(0, 2).map((message: string) => (
              <div
                className="permission-card flex gap-2 items-center"
                key={message}
              >
                <p className="text-b1">
                  {convertToSpacedName(getTypeURLName(message))}
                </p>
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
      <div className="flex gap-6 items-center ">
        <CustomButton btnText="Revoke" btnOnClick={handleRevokeFeegrant} />
        <div className="secondary-btn" onClick={toggleViewDetails}>
          View Details
        </div>
      </div>
      <DialogViewDetails open={viewDetailsOpen} onClose={toggleViewDetails} />
    </div>
  );
};
