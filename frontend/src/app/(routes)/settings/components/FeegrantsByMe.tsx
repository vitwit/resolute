import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Copy from '@/components/common/Copy';
import DialogViewDetails from './DialogViewDetails';
import DialogRevokeAll from './DialogRevokeAll';
import useFeeGrants from '@/custom-hooks/useFeeGrants';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { ALLOWED_MSG_ALLOWANCE } from '@/utils/feegrant';
import { get } from 'lodash';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { convertToSpacedName, shortenAddress } from '@/utils/util';
import { getTypeURLName } from '@/utils/authorizations';
import CustomButton from '@/components/common/CustomButton';
import FeegrantByMeLoading from './FeegrantByMeLoading';
import { TxStatus } from '@/types/enums';
import { txRevoke } from '@/store/features/feegrant/feegrantSlice';

const FeegrantsByMe = ({ chainIDs }: { chainIDs: string[] }) => {
  const { getGrantsByMe } = useFeeGrants();
  const addressGrants = getGrantsByMe(chainIDs);
  const loading = useAppSelector(
    (state) => state.feegrant.getGrantsByMeLoading
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCloseRevokeDialog = () => {
    setRevokeDialogOpen(false);
  };

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
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const { minimalDenom } = getDenomInfo(chainID);
  const basicChainInfo = getChainInfo(chainID);
  const { chainLogo, chainName } = basicChainInfo;

  const txRevokeStatus = useAppSelector(
    (state) => state.feegrant.chains[chainID].tx.status
  );
  const [selectedGrantee, setSelectedGrantee] = useState('');
  const txRevokeLoading =
    txRevokeStatus === TxStatus.PENDING && address === selectedGrantee;

  const toggleViewDetails = () => {
    setViewDetailsOpen((prev) => !prev);
  };

  // TODO: handle revoke feegrant txn
  const handleRevokeFeegrant = () => {
    setSelectedGrantee(grant.grantee);
    dispatch(
      txRevoke({
        granter: grant.granter,
        grantee: grant.grantee,
        basicChainInfo: basicChainInfo,
        baseURLs: basicChainInfo.restURLs,
        feegranter: '',
        denom: minimalDenom,
      })
    );
  };

  useEffect(() => {
    if (txRevokeStatus !== TxStatus.PENDING) setSelectedGrantee('');
  }, [txRevokeStatus]);

  return (
    <div className="grants-card justify-between gap-16 items-start w-full">
      <div className="flex flex-col gap-2 w-[216px]">
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
              </div>
            ))
          ) : (
            <div className="permission-card">
              <p className="text-b1">All</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-[21px]"></div>
        <div className="flex gap-6 items-center ">
          <CustomButton
            btnText="Revoke"
            btnOnClick={handleRevokeFeegrant}
            btnDisabled={txRevokeStatus === TxStatus.PENDING}
            btnLoading={txRevokeLoading}
            btnStyles="w-[114px]"
          />
          <div className="secondary-btn" onClick={toggleViewDetails}>
            View Details
          </div>
        </div>
      </div>
      <DialogViewDetails open={viewDetailsOpen} onClose={toggleViewDetails} />
    </div>
  );
};
