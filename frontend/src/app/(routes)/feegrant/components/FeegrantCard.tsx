import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import DialogTransactionMessages from './DialogTransactionMessages';
import DialogTransactionDetails from './DialogTransactionDetails';
import CommonCopy from '@/components/CommonCopy';
import { capitalizeFirstLetter } from '@/utils/util';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { parseTokens } from '@/utils/denom';
import { getTimeDifferenceToFutureDate } from '@/utils/dataTime';
import { getTypeURLName } from '@/utils/authorizations';
import { get } from 'lodash';
import { txRevoke } from '@/store/features/feegrant/feegrantSlice';
import { TxStatus } from '@/types/enums';
import { CircularProgress } from '@mui/material';
import useGetFeegranter from '@/custom-hooks/useGetFeegranter';
import {
  BASIC_ALLOWANCE,
  MAP_TXN_MSG_TYPES,
  PERIODIC_ALLOWANCE,
} from '@/utils/feegrant';

const ALLOWED_MESSAGE_ALLOWANCE_TYPE =
  '/cosmos.feegrant.v1beta1.AllowedMsgAllowance';

interface FeegrantCardprops {
  chainID: string;
  address: string;
  isGrantsByMe: boolean;
  grant: Allowance;
}

const FeegrantCard: React.FC<FeegrantCardprops> = ({
  chainID,
  address,
  grant,
  isGrantsByMe,
}) => {
  let allowedMsgs: Array<string>;
  const { allowance } = grant;
  const dispatch = useAppDispatch();

  if (get(allowance, '@type') === ALLOWED_MESSAGE_ALLOWANCE_TYPE) {
    allowedMsgs = get(allowance, 'allowed_messages', []);
  } else {
    allowedMsgs = [];
  }

  const networkLogo = useAppSelector(
    (state: RootState) => state.wallet.networks[chainID]?.network.logos.menu
  );
  const loading = useAppSelector(
    (state: RootState) => state.feegrant.chains[chainID].tx.status
  );
  const [selectedGrantee, setSelectedGrantee] = useState('');

  const { getDenomInfo } = useGetChainInfo();
  const { decimals, displayDenom, minimalDenom } = getDenomInfo(chainID);
  const { getFeegranter } = useGetFeegranter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const [isDialogTransactionOpen, setIsDialogTransactionOpen] = useState(false);

  const toggleDialogTransaction = () => {
    setIsDialogTransactionOpen(!isDialogTransactionOpen);
  };

  const isPeriodic =
    get(allowance, '@type') === PERIODIC_ALLOWANCE ||
    get(allowance, 'allowance.@type') === PERIODIC_ALLOWANCE;

  const typeText = isPeriodic ? 'periodic' : 'basic';
  const { getChainInfo } = useGetChainInfo();
  const basicChainInfo = getChainInfo(chainID);

  const handleRevoke = () => {
    setSelectedGrantee(grant.grantee);
    dispatch(
      txRevoke({
        granter: grant.granter,
        grantee: grant.grantee,
        basicChainInfo: basicChainInfo,
        baseURLs: basicChainInfo.restURLs,
        feegranter: getFeegranter(
          chainID,
          MAP_TXN_MSG_TYPES['revoke_feegrant']
        ),
        denom: minimalDenom,
      })
    );
  };

  useEffect(() => {
    if (loading !== TxStatus.PENDING) setSelectedGrantee('');
  }, [loading]);

  const getExpiryDate = () => {
    if (get(allowance, '@type') === BASIC_ALLOWANCE) {
      return get(allowance, 'expiration', '');
    } else if (get(allowance, '@type') === PERIODIC_ALLOWANCE) {
      return get(allowance, 'basic.expiration', '');
    } else {
      if (get(allowance, 'allowance.@type') === BASIC_ALLOWANCE) {
        return get(allowance, 'allowance.expiration', '');
      } else {
        return get(allowance, 'allowance.basic.expiration', '');
      }
    }
  };

  const getSpendLimit = () => {
    if (get(allowance, '@type') === BASIC_ALLOWANCE) {
      return get(allowance, 'spend_limit', []);
    } else if (get(allowance, '@type') === PERIODIC_ALLOWANCE) {
      return get(allowance, 'basic.spend_limit', []);
    } else {
      if (get(allowance, 'allowance.@type') === BASIC_ALLOWANCE) {
        return get(allowance, 'allowance.spend_limit', []);
      } else {
        return get(allowance, 'allowance.basic.spend_limit', []);
      }
    }
  };

  return (
    <div className="feegrant-card">
      <div className="justify-between w-full flex">
        <div className="flex space-x-2 items-center text-capitilize">
          <Image
            className="rounded-full"
            src={networkLogo}
            width={32}
            height={32}
            alt="Network-Logo"
          />
          <p>{capitalizeFirstLetter(basicChainInfo?.chainName) || '-'}</p>

          <div className={typeText}>{capitalizeFirstLetter(typeText)}</div>
        </div>
        <div className="feegrant-small-text">
          <span>Expires in </span>
          <span>
            {(getExpiryDate() &&
              getTimeDifferenceToFutureDate(getExpiryDate())) ||
              '-'}
          </span>
        </div>
      </div>
      <div className="justify-between flex w-full">
        <div className="space-y-4 max-w-[50%]">
          <div className="feegrant-small-text">
            {isGrantsByMe ? 'Grantee' : 'Granter'}
          </div>
          <CommonCopy message={address} style="" />
        </div>
        <div className="space-y-4">
          <div className="feegrant-small-text">
            <div className="">Spend Limit</div>
          </div>
          <div className="">
            {parseTokens(getSpendLimit(), displayDenom, decimals)}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="feegrant-small-text">Transaction Messages</div>
        <div className="flex flex-wrap gap-6">
          {allowedMsgs.length > 0 ? (
            allowedMsgs.slice(0, 2).map((message: string) => (
              <div key={message} className="transaction-message-btn">
                <p className="feegrant-address">{getTypeURLName(message)}</p>
              </div>
            ))
          ) : (
            <div className="">
              <p className="feegrant-address">All</p>
            </div>
          )}

          {allowedMsgs?.length > 2 && (
            <div
              className="revoke-btn cursor-pointer text-[14px]"
              onClick={toggleDialog}
            >
              +{allowedMsgs?.length - 2}
            </div>
          )}
        </div>
      </div>
      <div className="flex space-x-6">
        {isGrantsByMe && (
          <button
            onClick={handleRevoke}
            className="revoke-btn font-medium text-[12px] leading-[20px] min-w-[104px]"
          >
            {loading === TxStatus.PENDING &&
            selectedGrantee === grant.grantee ? (
              <CircularProgress sx={{ color: 'white' }} size={20} />
            ) : (
              'Revoke Grant'
            )}
          </button>
        )}

        {isPeriodic && (
          <button
            className="view-button"
            onClick={() => toggleDialogTransaction()}
          >
            View Transactions
          </button>
        )}
      </div>
      {isDialogOpen && (
        <DialogTransactionMessages
          msgs={allowedMsgs}
          onClose={toggleDialog}
          open={isDialogOpen}
        />
      )}
      {isDialogTransactionOpen && (
        <DialogTransactionDetails
          grant={grant}
          chainID={chainID}
          onClose={() => setIsDialogTransactionOpen(false)}
          open={isDialogTransactionOpen}
        />
      )}
    </div>
  );
};

export default FeegrantCard;
