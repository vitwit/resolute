import React, { useState } from 'react';
import Image from 'next/image';
import { AuthorizationInfo } from './DialogAllPermissions';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import {
  getMsgNameFromAuthz,
  getTypeURLFromAuthorization,
} from '@/utils/authorizations';

import { copyToClipboard } from '@/utils/copyToClipboard';
import { setError } from '@/store/features/common/commonSlice';
import DialogRevoke from './DialogRevoke';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { resetTxStatus } from '@/store/features/authz/authzSlice';

const AuthzCard = ({
  chainID,
  address,
  grants,
  showCloseIcon,
  grantee,
  granter,
  isGrantsByMe,
}: {
  chainID: string;
  address: string;
  grants: Authorization[];
  showCloseIcon: boolean;
  grantee: string;
  granter: string;
  isGrantsByMe: boolean;
}) => {
  const networkLogo = useAppSelector(
    (state: RootState) => state.wallet.networks[chainID]?.network.logos.menu
  );

  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );

  const [dialogAllPermissionsOpen, setDialogAllPermissionsOpen] =
    useState(false);
  const handleDialogAllPermissionsClose = () => {
    setDialogAllPermissionsOpen(false);
  };

  const getChainName = (chainID: string) => {
    let chain: string = '';
    Object.keys(nameToChainIDs).forEach((chainName) => {
      if (nameToChainIDs[chainName] === chainID) chain = chainName;
    });
    return chain;
  };
  // const revoke = useAppSelector((state) => state.authz.txAuthzRes);
  const dispatch = useAppDispatch();
  const { getDenomInfo } = useGetChainInfo();

  const { decimals } = getDenomInfo(chainID);
  const { displayDenom } = getDenomInfo(chainID);

  return (
    <div className="authz-card">
      <div className="flex space-x-2 items-center text-capitalize">
        <Image
          className=" rounded-full"
          src={networkLogo}
          width={32}
          height={32}
          alt="Network-Logo"
        />
        <p>{getChainName(chainID)}</p>
      </div>
      <div className="authz-small-text">
        {isGrantsByMe ? 'Grantee' : 'Granter'}
      </div>
      <div className="grant-address truncate">
        <p>{address}</p>
        <Image
          onClick={(e) => {
            copyToClipboard(address);
            dispatch(
              setError({
                type: 'success',
                message: 'Copied',
              })
            );
            e.preventDefault();
            e.stopPropagation();
          }}
          src="/copy.svg"
          width={24}
          height={24}
          alt="copy"
          draggable={false}
          className="cursor-pointer"
        />
      </div>
      <div className="authz-small-text">Permissions</div>
      <div className="flex flex-wrap gap-6">
        {grants?.slice(0, 2)?.map((permission, permissionIndex) => (
          <div key={permissionIndex}>
            <MessageChip
              permission={permission}
              granter={granter}
              grantee={grantee}
              chainID={chainID}
              showCloseIcon={showCloseIcon}
            />
          </div>
        ))}
        {grants?.length > 2 ? (
          <>
            <div
              className="view-more-btn cursor-pointer text-[14px]"
              onClick={() => setDialogAllPermissionsOpen(true)}
            >
              +{grants?.length - 2}
            </div>
          </>
        ) : null}
      </div>
      <div className="">
        <button
          className="create-grant-btn mt-4"
          onClick={() => setDialogAllPermissionsOpen(true)}
        >
          View Details
        </button>
      </div>
      <AuthorizationInfo
        open={dialogAllPermissionsOpen}
        onClose={handleDialogAllPermissionsClose}
        authorization={grants}
        displayDenom={displayDenom}
        decimal={decimals}
        chainID={chainID}
        granter={granter}
        grantee={grantee}
        isGrantsByMe={isGrantsByMe}
      />
    </div>
  );
};

export default AuthzCard;

const MessageChip = ({
  permission,
  granter,
  grantee,
  chainID,
  showCloseIcon,
}: {
  permission: Authorization;
  granter: string;
  grantee: string;
  chainID: string;
  showCloseIcon: boolean;
}) => {
  const [dialogRevokeOpen, setDialogRevokeOpen] = useState(false);
  const dispatch = useAppDispatch();
  const handleDialogRevokeClose = () => {
    setDialogRevokeOpen(false);
  };
  return (
    <div>
      <p className="grant-address">
        {getMsgNameFromAuthz(permission)}
        {showCloseIcon && (
          <Image
            src="/close-icon.svg"
            width={16}
            height={16}
            alt="close-icon"
            draggable={false}
            className="cursor-pointer"
            onClick={() => {
              setDialogRevokeOpen(true);
              dispatch(resetTxStatus({ chainID: chainID }));
            }}
          />
        )}
      </p>
      <DialogRevoke
        open={dialogRevokeOpen}
        onClose={handleDialogRevokeClose}
        chainID={chainID}
        grantee={grantee}
        granter={granter}
        typeURL={getTypeURLFromAuthorization(permission)}
      />
    </div>
  );
};
