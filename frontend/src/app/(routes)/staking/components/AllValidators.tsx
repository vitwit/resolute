import { TxStatus } from '@/types/enums';
import { AllValidatorsProps } from '@/types/staking';
import { CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import ValidatorItem from './ValidatorItem';
import DialogAllValidators from './DialogAllValidators';

const AllValidators = ({
  validators,
  currency,
  onMenuAction,
  validatorsStatus,
}: AllValidatorsProps) => {
  const [allValidatorsDialogOpen, setAllValidatorsDialogOpen] =
    useState<boolean>(false);
  const handleClose = () => {
    setAllValidatorsDialogOpen(false);
  };
  const slicedValidatorsList = validators?.activeSorted.slice(0, 10) || [];
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-[20px] leading-normal font-bold">All Validators</h2>
        {validatorsStatus === TxStatus.IDLE ? (
          <div
            className="cursor-pointer text-[#FFFFFFBF] text-[12px] font-extralight underline underline-offset-2"
            onClick={() => setAllValidatorsDialogOpen(true)}
          >
            View All
          </div>
        ) : null}
      </div>
      {validatorsStatus === TxStatus.PENDING ? (
        <div className="text-center mt-16">
          <CircularProgress size={32} />
        </div>
      ) : (
        <>
          {slicedValidatorsList.map((validator) => {
            const { moniker, identity } =
              validators.active[validator]?.description;
            const commission =
              Number(
                validators.active[validator]?.commission?.commission_rates.rate
              ) * 100;
            const tokens = Number(validators.active[validator]?.tokens);
            return (
              <ValidatorItem
                key={validator}
                moniker={moniker}
                identity={identity}
                commission={commission}
                tokens={tokens}
                currency={currency}
                onMenuAction={onMenuAction}
                validators={validators}
                validator={validator}
              />
            );
          })}
        </>
      )}
      <DialogAllValidators
        handleClose={handleClose}
        open={allValidatorsDialogOpen}
        validators={validators}
        onMenuAction={onMenuAction}
      />
    </div>
  );
};

export default AllValidators;
