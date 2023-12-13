import { StakingMenuAction, Validator } from '@/types/staking';
import {
  canDelegate,
  formatCommission,
  getValidatorStatus,
} from '@/utils/util';
import React from 'react';
import ValidatorLogo from './ValidatorLogo';
import { Tooltip } from '@mui/material';

interface ValidatorComponentProps {
  moniker: string;
  identity: string;
  commission: number;
  jailed: boolean;
  status: string;
  active: boolean;
  rank: string;
  onMenuAction: StakingMenuAction;
  validator: Validator;
}

const isJailed = (validatorStatus: string) => {
  return validatorStatus.toLowerCase() === 'jailed';
};

const ValidatorComponent = ({
  moniker,
  identity,
  commission,
  jailed,
  status,
  active,
  rank,
  onMenuAction,
  validator,
}: ValidatorComponentProps) => {
  const validatorStatus = getValidatorStatus(jailed, status);
  const enableDelegate = canDelegate(validatorStatus);
  return (
    <div className="flex justify-between items-center txt-sm text-white font-normal">
      <div className="flex gap-4 items-center">
        <div className="bg-[#fff] rounded-full">
          <ValidatorLogo identity={identity} width={40} height={40} />
        </div>
        <div className="flex flex-col gap-2 w-[200px]">
          <div className="flex gap-2 items-center cursor-default">
            <Tooltip title={moniker} placement="top">
              <div className="text-[14px] leading-normal truncate">
                {moniker}
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="leading-3">{rank}</div>
      <div className="leading-3  min-w-[132px]">
        {formatCommission(commission)} Commission
      </div>
      {active ? null : (
        <div className="min-w-[102px] leading-3">
          <span className={isJailed(validatorStatus) ? `text-[#E57575]` : ``}>
            {validatorStatus}
          </span>
        </div>
      )}
      <div>
        <button
          className={
            enableDelegate
              ? `delegate-button`
              : `delegate-button delegate-button-inactive`
          }
          onClick={() => {
            if (enableDelegate) {
              onMenuAction('delegate', validator);
            }
          }}
        >
          Delegate
        </button>
      </div>
    </div>
  );
};

export default ValidatorComponent;
