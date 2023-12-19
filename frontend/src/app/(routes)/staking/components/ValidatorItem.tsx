import { ValidatorItemProps } from '@/types/staking';
import React from 'react';
import ValidatorLogo from './ValidatorLogo';
import { Tooltip } from '@mui/material';
import { formatVotingPower } from '@/utils/denom';
import { formatCommission } from '@/utils/util';

const ValidatorItem = ({
  moniker,
  identity,
  commission,
  tokens,
  currency,
  onMenuAction,
  validators,
  validator,
}: ValidatorItemProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="bg-[#fff] rounded-full">
          <ValidatorLogo identity={identity} height={40} width={40} />
        </div>
        <div className="flex flex-col justify-center gap-2 w-[130px]">
          <div className="flex gap-2 items-center cursor-default">
            <Tooltip title={moniker} placement="top">
              <div className="text-[14px] font-light leading-normal truncate">
                {moniker}
              </div>
            </Tooltip>
          </div>
          <div className="text-[12px] text-[#FFFFFFBF] font-extralight leading-3">
            {formatVotingPower(tokens, currency.coinDecimals)}
          </div>
        </div>
      </div>
      <div className="text-[12px] text-[#FFFFFFBF] font-extralight leading-3">
        {formatCommission(commission)} Commission
      </div>
      <div>
        <button
          className="primary-gradient sidebar-delegate-button"
          onClick={() =>
            onMenuAction('delegate', validators.active?.[validator])
          }
        >
          Delegate
        </button>
      </div>
    </div>
  );
};

export default ValidatorItem;
