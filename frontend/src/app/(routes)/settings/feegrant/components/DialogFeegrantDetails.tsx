import CustomDialog from '@/components/common/CustomDialog';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { getTypeURLName } from '@/utils/authorizations';
import { getLocalTime, getTimeDifferenceToFutureDate } from '@/utils/dataTime';
import { parseTokens } from '@/utils/denom';
import {
  ALLOWED_MSG_ALLOWANCE,
  getExpiryDate,
  getPeriodExpiryDate,
  getPeriodSpendLimit,
  getSpendLimit,
  PERIODIC_ALLOWANCE,
} from '@/utils/feegrant';
import { capitalizeFirstLetter, convertToSpacedName } from '@/utils/util';
import { Tooltip } from '@mui/material';
import { get } from 'lodash';
import Image from 'next/image';
import React from 'react';

interface DialogFeegrantDetailsProps {
  chainID: string;
  open: boolean;
  onClose: () => void;
  grant: BasicAllowance | PeriodicAllowance | AllowedMsgAllowance;
}

const DialogFeegrantDetails = (props: DialogFeegrantDetailsProps) => {
  const { chainID, onClose, open, grant } = props;

  const { getDenomInfo, getChainInfo } = useGetChainInfo();
  const { displayDenom, decimals } = getDenomInfo(chainID);
  const { chainLogo, chainName } = getChainInfo(chainID);

  let allowedMsgs: Array<string>;
  const isPeriodic =
    get(grant, '@type') === PERIODIC_ALLOWANCE ||
    get(grant, 'allowance.@type') === PERIODIC_ALLOWANCE;
  const spendLimit = getSpendLimit(grant);
  const allowanceExpiry = getExpiryDate(grant);
  const periodSpendLimit = getPeriodSpendLimit(grant);
  const periodExpiry = getPeriodExpiryDate(grant);

  if (get(grant, '@type') === ALLOWED_MSG_ALLOWANCE) {
    allowedMsgs = get(grant, 'allowed_messages', []);
  } else {
    allowedMsgs = [];
  }

  return (
    <CustomDialog open={open} title="Feegrant Details" onClose={onClose}>
      <div className="w-[800px] space-y-10">
        <div className="grid grid-cols-2 gap-6">
          <FeegrantInfoCard
            name="Spend Limit"
            value={parseTokens(spendLimit, displayDenom, decimals)}
          />
          <FeegrantInfoCard
            name="Expires in"
            value={
              (allowanceExpiry &&
                getTimeDifferenceToFutureDate(allowanceExpiry)) ||
              '-'
            }
          />
          {isPeriodic ? (
            <>
              <FeegrantInfoCard
                name="Period Spend Limit"
                value={parseTokens(periodSpendLimit, displayDenom, decimals)}
              />
              <FeegrantInfoCard
                name="Period Expires in"
                value={(periodExpiry && getLocalTime(periodExpiry)) || '-'}
              />
            </>
          ) : null}
        </div>
        <div className="flex gap-x-2 gap-y-4 flex-wrap">
          {allowedMsgs.length > 0 ? (
            allowedMsgs.map((message: string) => (
              <div
                className="px-6 py-4 rounded-2xl bg-[#FFFFFF05] flex gap-2 items-center"
                key={message}
              >
                <Tooltip
                  title={capitalizeFirstLetter(chainName)}
                  placement="top"
                >
                  <Image
                    src={chainLogo}
                    width={20}
                    height={20}
                    alt={chainName}
                  />
                </Tooltip>
                <p className="text-b1">
                  {convertToSpacedName(getTypeURLName(message))}
                </p>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 rounded-2xl bg-[#FFFFFF05] flex gap-2 items-center">
              <Tooltip title={capitalizeFirstLetter(chainName)} placement="top">
                <Image src={chainLogo} width={20} height={20} alt={chainName} />
              </Tooltip>
              <p className="text-b1">All Messages</p>
            </div>
          )}
        </div>
      </div>
    </CustomDialog>
  );
};

export default DialogFeegrantDetails;

const FeegrantInfoCard = ({ name, value }: { name: string; value: string }) => {
  return (
    <div className="bg-[#FFFFFF05] text-[14px] px-4 py-2 rounded-2xl flex items-center gap-6 justify-center h-12">
      <div className="w-[124px] font-light text-[#ffffff80]">{name}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
};
