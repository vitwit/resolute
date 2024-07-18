import {
  DROP_DOWN_CLOSE,
  DROP_DOWN_OPEN,
  MENU_ICON,
  REDIRECT_ICON_GREEN,
  REDIRECT_ICON_RED,
} from '@/constants/image-names';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import {
  deleteTxn,
  setVerifyDialogOpen,
} from '@/store/features/multisig/multisigSlice';
import { TxStatus } from '@/types/enums';
import { Txn } from '@/types/multisig';
import { COSMOS_CHAIN_ID } from '@/utils/constants';
import { getAuthToken } from '@/utils/localStorage';
import { cleanURL, isMultisigMember } from '@/utils/util';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import TxnMsg from '../msgs/TxnMsg';
import Link from 'next/link';
import MoreOptions from './MoreOptions';
import DialogConfirmDelete from '../multisig-account/DialogConfirmDelete';
import CustomDialog from '@/components/common/CustomDialog';
import BroadCastTxn from './BroadCastTxn';
import SignTxn from './SignTxn';
import useVerifyAccount from '@/custom-hooks/useVerifyAccount';

export const TxnsCard = ({
  txn,
  currency,
  threshold,
  multisigAddress,
  chainID,
  isHistory,
  onViewError,
}: {
  txn: Txn;
  currency: Currency;
  threshold: number;
  multisigAddress: string;
  chainID: string;
  isHistory: boolean;
  onViewError?: (errMsg: string) => void;
}) => {
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const { address: walletAddress, explorerTxHashEndpoint } =
    getChainInfo(chainID);
  const { isAccountVerified } = useVerifyAccount({
    address: walletAddress,
  });

  const [showAll, setShowAll] = useState(false);
  const [viewRawOpen, setViewRawOpen] = useState(false);
  const { messages } = txn;
  const pubKeys = txn.pubkeys || [];
  const isMember = isMultisigMember(pubKeys, walletAddress);
  const isReadyToBroadcast = () => {
    const signs = txn?.signatures || [];
    if (signs?.length >= threshold) return true;
    else return false;
  };

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuRef2 = useRef<HTMLDivElement>(null);

  const loading = useAppSelector((state) => state.multisig.deleteTxnRes.status);

  const hanldeDeleteTxn = () => {
    if (isAccountVerified()) {
      setDeleteDialogOpen(true);
    } else {
      dispatch(setVerifyDialogOpen(true));
    }
  };

  const onDeleteTxn = () => {
    const authToken = getAuthToken(COSMOS_CHAIN_ID);
    dispatch(
      deleteTxn({
        data: {
          address: multisigAddress,
          id: txn.id,
        },
        queryParams: {
          address: walletAddress,
          signature: authToken?.signature || '',
        },
      })
    );
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuRef2.current &&
        !menuRef2.current.contains(event.target as Node)
      ) {
        setOptionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (loading === TxStatus.IDLE || loading === TxStatus.REJECTED) {
      setDeleteDialogOpen(false);
    }
  }, [loading]);

  return (
    <div className="txn-card">
      <div className="space-y-2 w-[40%]">
        <div className="text-small-light">Transaction Messages</div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="text-b1">#1</div>
              <TxnMsg msg={messages[0]} currency={currency} chainID={chainID} />
            </div>
            {messages?.length > 1 ? (
              <ExpandViewButton
                showAll={showAll}
                toggleView={() => setShowAll((prev) => !prev)}
              />
            ) : null}
          </div>
          {showAll
            ? messages.slice(1, messages?.length).map((msg, index) => (
                <div key={index}>
                  <div className="flex gap-2">
                    <div className="font-bold">{`#${index + 2}`}</div>
                    <TxnMsg msg={msg} currency={currency} chainID={chainID} />
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
      {isHistory ? (
        <div className="space-y-2 w-1/6">
          <div className="text-small-light">Status</div>
          <div className="flex gap-[2px] items-end">
            {txn?.status === 'SUCCESS' ? (
              <Link
                className="flex gap-[2px]"
                href={`${cleanURL(explorerTxHashEndpoint)}/${txn.hash}`}
                target="_blank"
              >
                <div className="text-[#2BA472] underline underline-offset-[3px]">
                  Success
                </div>
                <Image
                  src={REDIRECT_ICON_GREEN}
                  height={16}
                  width={16}
                  alt=""
                />
              </Link>
            ) : (
              <div className="flex gap-[2px] cursor-pointer">
                <div
                  onClick={() => onViewError?.(txn?.err_msg || '')}
                  className="text-[#F15757] underline underline-offset-[3px]"
                >
                  Failed
                </div>
                <Image src={REDIRECT_ICON_RED} height={16} width={16} alt="" />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2 w-1/6">
          <div className="text-small-light">Signed</div>
          <div className="flex gap-[2px] items-end">
            <span className="text-b1">{txn.signatures.length}</span>
            <span className="text-small-light">/</span>
            <span className="text-small-light">{pubKeys.length}</span>
          </div>
        </div>
      )}
      <div className="w-1/6">
        <div className="flex items-center gap-6 justify-end">
          {!isHistory ? (
            <>
              {isReadyToBroadcast() ? (
                <BroadCastTxn
                  txn={txn}
                  multisigAddress={multisigAddress}
                  pubKeys={txn.pubkeys || []}
                  threshold={threshold}
                  chainID={chainID}
                  isMember={isMember}
                />
              ) : (
                <SignTxn
                  address={multisigAddress}
                  chainID={chainID}
                  isMember={isMember}
                  txId={txn.id}
                  unSignedTxn={txn}
                />
              )}
            </>
          ) : null}
          <div
            ref={menuRef2}
            onMouseEnter={() => setOptionsOpen(true)}
            onMouseLeave={() => setOptionsOpen(false)}
            className="cursor-pointer"
          >
            <Image src={MENU_ICON} height={24} width={24} alt="Menu" />
          </div>
        </div>
      </div>
      {optionsOpen ? (
        <MoreOptions
          setOptionsOpen={(value: boolean) => setOptionsOpen(value)}
          hanldeDeleteTxn={hanldeDeleteTxn}
          onViewRaw={() => setViewRawOpen(true)}
        />
      ) : null}
      <DialogConfirmDelete
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete Transaction"
        description=" Are you sure you want to delete the transaction ?"
        onDelete={onDeleteTxn}
        loading={loading === TxStatus.PENDING}
      />
      <CustomDialog
        open={viewRawOpen}
        onClose={() => setViewRawOpen(false)}
        title="Raw Transaction"
      >
        <div className="w-[800px] bg-black h-[400px] max-h-[400px] overflow-y-scroll p-2">
          {txn ? (
            <pre>{JSON.stringify(txn, undefined, 2)}</pre>
          ) : (
            <div className="text-center">- No Data -</div>
          )}
        </div>
      </CustomDialog>
    </div>
  );
};

export default TxnsCard;

const ExpandViewButton = ({
  showAll,
  toggleView,
}: {
  showAll: boolean;
  toggleView: () => void;
}) => {
  return (
    <Image
      className="cursor-pointer"
      onClick={() => toggleView()}
      src={showAll ? DROP_DOWN_CLOSE : DROP_DOWN_OPEN}
      width={16}
      height={16}
      alt=""
    />
  );
};
