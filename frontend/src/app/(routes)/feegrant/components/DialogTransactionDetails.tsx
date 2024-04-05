import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { Dialog, DialogContent } from '@mui/material';
import React from 'react';
import Image from 'next/image';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { get } from 'lodash';
import { parseTokens } from '@/utils/denom';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { getLocalTime } from '@/utils/dataTime';
import { getTypeURLName } from '@/utils/authorizations';
import { PERIODIC_ALLOWANCE } from '@/utils/feegrant';

const DialogTransactionDetails = ({
  open,
  onClose,
  grant,
  chainID,
}: {
  open: boolean;
  onClose: () => void;
  grant: Allowance;
  chainID: string;
}) => {
  const { allowance } = grant;
  const handleDialogClose = () => {
    onClose();
  };

  const msgs = get(grant, 'allowance.allowed_messages', []);

  const { getDenomInfo } = useGetChainInfo();
  const { decimals, displayDenom } = getDenomInfo(chainID);

  const getExpiryDate = () => {
    if (get(allowance, '@type') === PERIODIC_ALLOWANCE) {
      return get(allowance, 'period_reset', '');
    } else {
      return get(allowance, 'allowance.period_reset', '');
    }
  };

  const getSpendLimit = () => {
    if (get(allowance, '@type') === PERIODIC_ALLOWANCE) {
      return get(allowance, 'period_spend_limit', []);
    } else {
      return get(allowance, 'allowance.period_spend_limit', []);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="lg"
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white">
          <div className="px-10 pb-6 pt-10 flex justify-end">
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
          <div className="gap-16 px-10 space-y-6">
            <div className="text-white text-xl not-italic font-bold leading-[normal]">
              Details
            </div>

            <div className="divider-line space-y-4"></div>
            <div className="flex flex-wrap gap-6">
              {msgs?.length ? (
                msgs.map((message) => (
                  <div key={message} className="transaction-message-btn">
                    <p className="message-style">{getTypeURLName(message)}</p>
                  </div>
                ))
              ) : (
                <div className="transaction-message-btn">
                  <p className="message-style">All</p>
                </div>
              )}
            </div>
            <div className="flex w-full justify-between">
              <div className="space-y-4">
                <div className="authz-small-text">Period Spend Limit</div>
                <div className="text-background w-[384px]">
                  {parseTokens(getSpendLimit(), displayDenom, decimals)}
                </div>
              </div>
              <div>
                <div className="space-y-4">
                  <div className="authz-small-text">Period Reset</div>
                  <div className="text-background w-[384px]">
                    {(getExpiryDate() && getLocalTime(getExpiryDate())) || '-'}
                  </div>
                </div>
              </div>
            </div>
            <div className="justify-end items-center gap-2.5 pt-10 pb-0 px-6"></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogTransactionDetails;
