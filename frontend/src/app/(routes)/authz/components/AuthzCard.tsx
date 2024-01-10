import React, { useState } from 'react';
import Image from 'next/image';
import { AuthorizationInfo } from './DialogAllPermissions';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { getMsgNameFromAuthz } from '@/utils/authorizations';

import { copyToClipboard } from '@/utils/copyToClipboard';
import { setError } from '@/store/features/common/commonSlice';
import DialogRevoke from './DialogRevoke';
import { Authorization } from '@/types/authz';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';


const AuthzCard = ({
  chainID,
  address,
  grants,
}: {
  chainID: string;
  address: string;
  grants: Authorization[];
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

  const [dialogRevokeOpen, setDialogRevokeOpen] = useState(false);
  const handleDialogRevokeClose = () => {
    setDialogRevokeOpen(false);
  };

  const getChainName = (chainID: string) => {
    let chain: string = '';
    Object.keys(nameToChainIDs).forEach((chainName) => {
      if (nameToChainIDs[chainName] === chainID) chain = chainName;
    });
    return chain;
  };
  const dispatch = useAppDispatch();
  const {getDenomInfo} = useGetChainInfo();

    const {decimals} = getDenomInfo(chainID);
    const {displayDenom} = getDenomInfo(chainID);
  

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
      <div className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-normal leading-[normal]">
        Granter
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
      <div className="">Permissions</div>
      <div className="flex flex-wrap space-x-2">
        {grants.map((permission, permissionIndex) => (
          <div key={permissionIndex}>
            <p className="grant-address">
              {getMsgNameFromAuthz(permission)}
              <Image
                src="/close-icon.svg"
                width={12}
                height={12}
                alt="close-icon"
                draggable={false}
                className="cursor-pointer"
                onClick={() => setDialogRevokeOpen(true)}
              />
            </p>
            <DialogRevoke
              open={dialogRevokeOpen}
              onClose={handleDialogRevokeClose}
            />
          </div>
        ))}
      </div>
      <div className=''>
        <button
          className="create-grant-btn"
          onClick={() => setDialogAllPermissionsOpen(true)}
        >
          View Details
        </button>
      </div>
      <AuthorizationInfo
        open={dialogAllPermissionsOpen}
        onClose={handleDialogAllPermissionsClose} authorization={grants} displayDenom={displayDenom} decimal={decimals}      />
    </div>
  );
};

export default AuthzCard;

// const Permissions = ({
//   grants,
//   chainID,
// }: {
//   grants: Authorization[];
//   chainID: string;
// }) => {
//   return (
//     <div className="space-y-4">
//       <h3 className="text-[#FFFFFF80] text-[14px]">Permissions</h3>
//       <div className="flex flex-wrap gap-4">
//         {grants.map((grant, index) => (
//           <Message
//             key={index}
//             chainID={chainID}
//             msg={getMsgNameFromAuthz(grant)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// const Message = ({ msg, chainID }: { msg: string; chainID: string }) => {
//   const { getChainInfo } = useGetChainInfo();
//   const { chainLogo } = getChainInfo(chainID);

//   return (
//     <div className="rounded-xl p-2 bg-[#FFFFFF1A] flex gap-2 items-center max-h-8">
//       <div>{msg}</div>
//       <Image
//         src="/close-icon.svg"
//         width={12}
//         height={12}
//         alt="close-icon"
//         draggable={false}
//       />
//     </div>
//   );
// };
