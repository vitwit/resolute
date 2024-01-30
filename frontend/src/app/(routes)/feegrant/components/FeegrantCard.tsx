import React, { useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import DialogTransactionMessages from './DialogTransactionMessages';
import DialogTransactionDetails from './DialogTransactionDetails';
import CommonCopy from '@/components/CommonCopy';
import { shortenAddress } from '@/utils/util';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { parseTokens } from '@/utils/denom';
import { getTimeDifferenceToFutureDate } from '@/utils/dataTime';
import { getTypeURLName } from '@/utils/authorizations';
import { get } from 'lodash';
import { txRevoke } from '@/store/features/feegrant/feegrantSlice';

const ALLOWED_MESSAGE_ALLIANCE_TYPE = '/cosmos.feegrant.v1beta1.AllowedMsgAllowance';
// const BASIC_ALLOWANCE_TYPE = '/cosmos.feegrant.v1beta1.BasicAllowance';

interface FeegrantCardprops {
  chainID: string;
  address: string;
  isGrantsByMe: boolean;
  grant: Allowance
}

const FeegrantCard: React.FC<FeegrantCardprops> = ({
  chainID,
  address,
  grant,
  isGrantsByMe,
}) => {
  let allowedMsgs: Array<string>;
  let basicAllowance;
  const { allowance } = grant;
  const dispatch = useAppDispatch();

  if (get(allowance, '@type') === ALLOWED_MESSAGE_ALLIANCE_TYPE) {
    allowedMsgs = get(allowance, 'allowed_messages', []);
    basicAllowance = get(allowance, 'allowance');
  } else {
    basicAllowance = allowance
    allowedMsgs = []
  }

  const networkLogo = useAppSelector(
    (state: RootState) => state.wallet.networks[chainID]?.network.logos.menu
  );

  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );

  const getChainName = (chainID: string) => {
    let chain: string = '';
    Object.keys(nameToChainIDs).forEach((chainName) => {
      if (nameToChainIDs[chainName] === chainID) chain = chainName;
    });
    return chain;
  };

  const { getDenomInfo } = useGetChainInfo()
  const { decimals, displayDenom, minimalDenom } = getDenomInfo(chainID)

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const [isDialogTransactionOpen, setIsDialogTransactionOpen] = useState(false);

  const toggleDialogTransaction = () => {
    setIsDialogTransactionOpen(!isDialogTransactionOpen);
  };

  const isPeriodic = get(allowance, '@type') === ALLOWED_MESSAGE_ALLIANCE_TYPE;

  const typeText = isPeriodic ? 'periodic' : 'basic';
  const { getChainInfo } = useGetChainInfo();
  const basicChainInfo = getChainInfo(chainID);

  const handleRevoke = () => {
    dispatch(txRevoke({
      granter: grant.granter,
      grantee: grant.grantee,
      basicChainInfo: basicChainInfo,
      baseURLs: basicChainInfo.restURLs,
      feegranter: '',
      denom: minimalDenom
    }))
  }

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
          <p>{getChainName(chainID)}</p>

          {/* title of the card */}

          <div className={typeText}>{typeText}</div>
        </div>

        <div className="feegrant-small-text">
          <div className="">{isPeriodic ? 'Period' : null} Expires in</div>
          {getTimeDifferenceToFutureDate(get(basicAllowance, 'expiration', ''))}
        </div>

      </div>
      <div className="justify-between flex w-full">
        <div className="space-y-4">
          <div className="feegrant-small-text">
            {isGrantsByMe ? 'Grantee' : 'Granter'}
          </div>
          <CommonCopy message={shortenAddress(address, 26)} style="max-w-fit" />
        </div>
        <div className="space-y-4">
          <div className="feegrant-small-text">
            <div className="">{isPeriodic ? 'Period' : null} Spend Limit</div>
          </div>
          <div className="">{parseTokens(get(basicAllowance, 'spend_limit', []), displayDenom, decimals)}</div>
        </div>
      </div>
      <div className="feegrant-small-text">Transaction Message</div>
      <div className="flex flex-wrap gap-6">
        {allowedMsgs.length > 0 ? (
          allowedMsgs.map((message: string) => (
            <div
              key={message}
              className="transaction-message-btn cursor-pointer"
              onClick={() => console.log(`Clicked: ${message}`)}
            >
              <p className="feegrant-address">{getTypeURLName(message)}</p>
            </div>
          ))
        ) : (
          <div className="">
            <p className="feegrant-address">All</p>
          </div>
        )}

        {allowedMsgs?.length > 2 && (
          <div className="revoke-btn cursor-pointer" onClick={toggleDialog}>
            +{allowedMsgs?.length - 1}
          </div>
        )}
      </div>

      {isDialogOpen && (
        <DialogTransactionMessages
          msgs={allowedMsgs}
          onClose={toggleDialog} open={isDialogOpen} />
      )}

      <div className="flex space-x-6">
        {
          isGrantsByMe && <button
            onClick={handleRevoke}
            className="revoke-btn">Revoke Grant</button>
        }


        {isPeriodic && (
          <button
            className="view-button"
            onClick={() => toggleDialogTransaction()}
          >
            View Transaction
          </button>
        )}
      </div>
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
