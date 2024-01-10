import { CopyToClipboard } from '@/components/CopyToClipboard';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { RootState } from '@/store/store';
import { Authorization } from '@/types/authz';
import { getTypeURLName } from '@/utils/authorizations';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { getLocalTime } from '@/utils/dataTime';
import { parseSpendLimit } from '@/utils/denom';
import { shortenAddress } from '@/utils/util';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React from 'react';

// interface DialogAllPermissionProps {
//   open: boolean;

//   onClose: () => void;
// }

// const DialogAllPermissions: React.FC<DialogAllPermissionProps> = (props) => {
//   const { open, onClose } = props;

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="lg"
//       PaperProps={{
//         sx: dialogBoxPaperPropStyles,
//       }}
//     >
//       <DialogContent sx={{ padding: 0 }}>
//         <div className="w-[890px] text-white">
//           <div className="px-10 pb-6 pt-10 flex justify-end">
//             <div onClick={onClose}>
//               <Image
//                 className="cursor-pointer"
//                 src={CLOSE_ICON_PATH}
//                 width={24}
//                 height={24}
//                 alt="close"
//                 draggable={false}
//               />
//             </div>
//           </div>
//           <div className="gap-16 px-10  space-y-6">
//             <div className="flex justify-between">
//               <div>All Permissions</div>
//               <button className="create-grant-btn">Revoke All</button>
//             </div>
//             <div className="authz-permission-card">
//               <div className="flex justify-between w-full">
//                 <div className="flex items-center"></div>
//                 <button className="create-grant-btn">Revoke</button>
//               </div>
//               <div className="flex justify-between w-full">
//                 <div className="flex space-y-4 flex-col">
//                   <div className="flex items-center">Spend Limit</div>
//                   <div className=""> </div>
//                 </div>
//                 <div className="flex space-y-4 flex-col">
//                   <div className="flex items-center">Expiry</div>
//                   <div className=""></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default DialogAllPermissions;

interface AuthorizationInfoProps {
  open: boolean;

  onClose: () => void;
  authorization: Authorization[];
  displayDenom: string;
  decimal: number;
}

const renderAuthorization = (
  authz: Authorization,
  displayDenom: string,
  decimal: number
) => {
  const { authorization, expiration } = authz;

  switch (authorization['@type']) {
    case '/cosmos.bank.v1beta1.SendAuthorization':
      return (
        <div className="authz-permission-card">
          <div className="flex justify-between w-full">
            <div className="flex items-center">
              {getTypeURLName(authorization.msg)}
            </div>
            <button className="create-grant-btn">Revoke</button>
          </div>
          <div className=" flex justify-between w-full">
            <div className="flex space-y-4 flex-col">
              <div className="flex items-center authz-small-text">
                Spend Limit
              </div>
              <div className="">
                {parseSpendLimit(authorization.spend_limit, decimal)}
                &nbsp;
                {displayDenom}{' '}
              </div>
            </div>

            <div className="flex space-y-4 flex-col">
              <div className="flex items-center authz-small-text">Expiry</div>
              <div className="">
                {expiration ? getLocalTime(expiration) : '-'}
              </div>
            </div>
          </div>
        </div>
      );
    case '/cosmos.authz.v1beta1.GenericAuthorization':
      return (
        <div className="authz-permission-card">
          <div className="flex justify-between w-full">
            <div className="flex items-center">
              {getTypeURLName(authorization.msg)}
            </div>
            <button className="create-grant-btn">Revoke</button>
          </div>
          <div className="flex space-y-4 flex-col">
            <div className="flex items-center authz-small-text">Expiry</div>
            <div className="">
              {expiration ? getLocalTime(expiration) : '-'}
            </div>
          </div>
        </div>
      );
    case '/cosmos.staking.v1beta1.StakeAuthorization':
      return (
        <div className="authz-permission-card">
          <div className="flex justify-between w-full">
            <div className="flex items-center">{getTypeURLName(authorization.msg)}</div>
            <button className="create-grant-btn">Revoke</button>
          </div>
          <div className="flex justify-between w-full">
            <div className="flex space-y-4 flex-col">
              <div className="flex items-center authz-small-text">
                Spend Limit
              </div>
              <div className=""></div>

              <div className="flex space-y-4 flex-col">
                <div className="flex items-center authz-small-text">Expiry</div>
                <div className="">
                  {expiration ? getLocalTime(expiration) : '-'}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center authz-small-text">
            Denly/Aceept List
          </div>
        </div>
      );

    default:
      return <>Not Supported</>;
  }
};

export function AuthorizationInfo(props: AuthorizationInfoProps) {
  const { onClose, open, displayDenom, decimal } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="lg"
      PaperProps={{ sx: dialogBoxPaperPropStyles }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white">
          <div className="px-10 pb-6 pt-10 flex justify-end">
            {' '}
            <div onClick={onClose}>
              <Image
                className="cursor-pointer"
                src={CLOSE_ICON_PATH}
                width={24}
                height={24}
                alt="close"
                draggable={false}
              />
            </div>
          </div>

          <div className="gap-16 px-10  space-y-6">
            <div className="flex justify-between">
              {' '}
              <div className="flex items-center text-white text-xl not-italic font-bold leading-[normal]">
                All Permissions
              </div>
              <button className="create-grant-btn">Revoke All</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {props.authorization.map((permission, permissionIndex) => (
                <div key={permissionIndex}>
                  {renderAuthorization(permission, displayDenom, decimal)}
                </div>
              ))}
            </div>
          </div>
          <div className="justify-end items-center gap-2.5 self-stretch pt-6 pb-0 px-6"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
