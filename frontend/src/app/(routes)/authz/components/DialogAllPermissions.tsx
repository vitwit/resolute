import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetAuthzRevokeMsgs from '@/custom-hooks/useGetAuthzRevokeMsgs';
import { txAuthzRevoke } from '@/store/features/authz/authzSlice';
import { RootState } from '@/store/store';
import { TxStatus } from '@/types/enums';
import {
  getAllTypeURLsFromAuthorization,
  getTypeURLFromAuthorization,
  getTypeURLName,
} from '@/utils/authorizations';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { getLocalTime } from '@/utils/dataTime';
import { parseSpendLimit } from '@/utils/denom';
import { CircularProgress, Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';

interface AuthorizationInfoProps {
  open: boolean;
  onClose: () => void;
  authorization: Authorization[];
  displayDenom: string;
  decimal: number;
  chainID: string;
  granter: string;
  grantee: string;
}

interface RenderAuthorizationProps {
  authz: Authorization;
  displayDenom: string;
  decimal: number;
  chainID: string;
  granter: string;
  grantee: string;
  permissionIndex: number;
  changeMsgIndex: (index: number) => void;
  selectedMsgIndex: number;
  setRevokeAllMsgs: () => void;
}

const RenderAuthorization = ({
  authz,
  chainID,
  changeMsgIndex,
  decimal,
  displayDenom,
  grantee,
  granter,
  permissionIndex,
  selectedMsgIndex,
  setRevokeAllMsgs,
}: RenderAuthorizationProps) => {
  const { authorization, expiration } = authz;
  const stakeAuthzs = {
    AUTHORIZATION_TYPE_REDELEGATE: 'Redelegate',
    AUTHORIZATION_TYPE_DELEGATE: 'Delegate',
    AUTHORIZATION_TYPE_UNDELEGATE: 'Undelegate',
  };

  const dispatch = useAppDispatch();
  const { txRevokeAuthzInputs } = useGetAuthzRevokeMsgs({
    granter,
    grantee,
    chainID,
    typeURLs: [getTypeURLFromAuthorization(authz)],
  });
  const txRevoke = (permissionIndex: number) => {
    setRevokeAllMsgs();
    changeMsgIndex(permissionIndex);
    const { basicChainInfo, denom, feeAmount, feegranter, msgs } =
      txRevokeAuthzInputs;
    dispatch(
      txAuthzRevoke({
        basicChainInfo,
        denom,
        feeAmount,
        feegranter,
        msgs,
      })
    );
  };
  const loading = useAppSelector(
    (state: RootState) => state.authz.chains?.[chainID].tx.status
  );
  const isSelected = selectedMsgIndex === permissionIndex;

  switch (authorization['@type']) {
    case '/cosmos.bank.v1beta1.SendAuthorization':
      return (
        <div className="authz-permission-card">
          <div className="flex justify-between w-full">
            <div className="flex items-center text-white text-base not-italic font-normal leading-[normal]">
              Send
            </div>
            <button
              onClick={() => txRevoke(permissionIndex)}
              className="create-grant-btn"
            >
              {isSelected && loading === TxStatus.PENDING ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : (
                'Revoke'
              )}
            </button>
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
            <div className="flex items-center text-white text-base not-italic font-normal leading-[normal]">
              {getTypeURLName(authorization.msg)}
            </div>
            <button
              onClick={() => txRevoke(permissionIndex)}
              className="create-grant-btn h-10 w-[140px]"
            >
              {isSelected && loading === TxStatus.PENDING ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : (
                'Revoke'
              )}
            </button>
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
            <div className="flex items-center text-white text-base font-normal leading-[normal]">
              {stakeAuthzs[authorization.authorization_type]}
            </div>
            <button
              onClick={() => txRevoke(permissionIndex)}
              className="create-grant-btn"
            >
              {isSelected && loading === TxStatus.PENDING ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : (
                'Revoke'
              )}
            </button>
          </div>
          <div className="flex w-full justify-between">
            <div className="space-y-4">
              <div className="authz-small-text">Spend Limit</div>

              {authorization.max_tokens !== null && (
                <div className="">
                  {parseSpendLimit([authorization.max_tokens], decimal)}
                  &nbsp;
                  {displayDenom}{' '}
                </div>
              )}
            </div>
            <div>
              <div className="space-y-4">
                <div className="authz-small-text">Expiry</div>
                <div className="">
                  {expiration ? getLocalTime(expiration) : '-'}
                </div>
              </div>
            </div>
          </div>
          <div>
            {authorization.allow_list && (
              <div className=" space-y-4">
                <div className="authz-small-text">Allow List: </div>
                <div className="grid grid-cols-2 gap-4">
                  {authorization.allow_list?.address.map((addr, index) => (
                    <div key={index} className="grant-address px-2 py-2">
                      {addr.slice(0, 15)}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {authorization.deny_list && (
              <div className="space-y-4">
                <div className="authz-small-text">Deny List: </div>
                <div className="grid grid-cols-2 gap-4">
                  {authorization.deny_list?.address.map((addr, index) => (
                    <div key={index} className="grant-address px-2 py-2">
                      {addr.slice(0, 15)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );

    default:
      return <>Not Supported</>;
  }
};

export function AuthorizationInfo(props: AuthorizationInfoProps) {
  const {
    onClose,
    open,
    displayDenom,
    decimal,
    chainID,
    authorization,
    grantee,
    granter,
  } = props;

  const dispatch = useAppDispatch();
  const handleClose = () => {
    onClose();
  };
  const [selectedMsgIndex, setSelectedMsgIndex] = useState(NaN);
  const [revokeAllMsgs, setRevokeAllMsgs] = useState(false);

  const changeMsgIndex = (index: number) => {
    setSelectedMsgIndex(index);
  };

  const { txRevokeAuthzInputs } = useGetAuthzRevokeMsgs({
    granter,
    grantee,
    chainID,
    typeURLs: getAllTypeURLsFromAuthorization(authorization),
  });
  const { basicChainInfo, denom, feeAmount, feegranter, msgs } =
    txRevokeAuthzInputs;
  const txRevoke = () => {
    setSelectedMsgIndex(NaN);
    setRevokeAllMsgs(true);
    dispatch(
      txAuthzRevoke({
        basicChainInfo,
        denom,
        feeAmount,
        feegranter,
        msgs,
      })
    );
  };

  const loading = useAppSelector(
    (state: RootState) => state.authz.chains?.[chainID].tx.status
  );

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
              <div className="flex items-center text-white text-xl not-italic font-bold leading-[normal]">
                All Permissions
              </div>
              <button
                onClick={() => txRevoke()}
                className="create-grant-btn h-10 w-[166px]"
              >
                {revokeAllMsgs && loading === TxStatus.PENDING ? (
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                ) : (
                  'Revoke All'
                )}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {authorization.map((permission, permissionIndex) => (
                <div key={permissionIndex}>
                  <RenderAuthorization
                    authz={permission}
                    chainID={chainID}
                    changeMsgIndex={changeMsgIndex}
                    decimal={decimal}
                    displayDenom={displayDenom}
                    grantee={grantee}
                    granter={granter}
                    permissionIndex={permissionIndex}
                    selectedMsgIndex={selectedMsgIndex}
                    setRevokeAllMsgs={() => setRevokeAllMsgs(false)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="justify-end items-center gap-2.5 pt-10 pb-0 px-6"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
