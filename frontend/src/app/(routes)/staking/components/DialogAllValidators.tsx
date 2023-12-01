import { StakingMenuAction, Validators } from '@/types/staking';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import ActiveValidators from './ActiveValidators';
import InactiveValidators from './InactiveValidators';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { allValidatorDialogStyles } from '../styles';

type HandleClose = () => void;

interface DialogAllValidatorsProps {
  handleClose: HandleClose;
  open: boolean;
  validators: Validators;
  onMenuAction: StakingMenuAction;
}

const DialogAllValidators = ({
  handleClose,
  open,
  validators,
  onMenuAction,
}: DialogAllValidatorsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [active, setActive] = useState<boolean>(true);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setSearchTerm('');
        handleClose();
        setActive(true);
      }}
      maxWidth="lg"
      PaperProps={allValidatorDialogStyles}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="allvalidators px-10 py-6 flex justify-end w-[890px]">
          <div
            onClick={() => {
              setSearchTerm('');
              handleClose();
            }}
          >
            <Image
              className="cursor-pointer"
              src={CLOSE_ICON_PATH}
              width={24}
              height={24}
              alt="Close"
            />
          </div>
        </div>
        <div className="px-10">
          <h2 className="txt-lg font-bold text-white">All Validators</h2>
          <div className="mt-4 py-2">
            <div className="flex gap-6 text-white">
              <div
                className="custom-radio-button-label"
                onClick={() => setActive(true)}
              >
                <div className="custom-ratio-button">
                  {active ? (
                    <div className="custom-radio-button-checked"></div>
                  ) : null}
                </div>
                <div>Active</div>
              </div>
              <div
                className="custom-radio-button-label"
                onClick={() => setActive(false)}
              >
                <div className="custom-ratio-button">
                  {!active ? (
                    <div className="custom-radio-button-checked"></div>
                  ) : null}
                </div>
                <div>Inactive</div>
              </div>
            </div>
          </div>
          <div className="my-6 h-12 flex bg-[#FFFFFF1A] items-center px-6 py-2 rounded-2xl hover:bg-[#ffffff11]">
            <div>
              <Image
                src="/search-icon.svg"
                width={24}
                height={24}
                alt="Search"
              />
            </div>
            <div className="w-full">
              <input
                className="search-validator-input"
                type="text"
                placeholder="Search Chain"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus={true}
              />
            </div>
          </div>
        </div>
        {active ? (
          <ActiveValidators
            validators={validators}
            searchTerm={searchTerm}
            onMenuAction={onMenuAction}
          />
        ) : (
          <InactiveValidators
            validators={validators}
            searchTerm={searchTerm}
            onMenuAction={onMenuAction}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogAllValidators;
