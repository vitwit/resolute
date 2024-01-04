import { StakingMenuAction, Validators } from '@/types/staking';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import ActiveValidators from './ActiveValidators';
import InactiveValidators from './InactiveValidators';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';

interface DialogAllValidatorsProps {
  toggleValidatorsDialog: () => void;
  open: boolean;
  validators: Validators;
  onMenuAction: StakingMenuAction;
}

const DialogAllValidators = ({
  toggleValidatorsDialog,
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
        toggleValidatorsDialog();
        setActive(true);
      }}
      maxWidth="lg"
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="min-h-[816px] relative">
          <div className="allvalidators px-10 py-6 pt-10 flex justify-end w-[890px]">
            <div
              onClick={() => {
                setSearchTerm('');
                toggleValidatorsDialog();
              }}
            >
              <Image
                className="cursor-pointer"
                src={CLOSE_ICON_PATH}
                width={24}
                height={24}
                alt="Close"
                draggable={false}
              />
            </div>
          </div>
          <div className="px-10">
            <h2 className="txt-lg font-medium text-white">All Validators</h2>
            <div className="mt-4 py-2">
              <div className="flex gap-6 text-white">
                <div
                  className="custom-radio-button-label"
                  onClick={() => setActive(true)}
                >
                  <div className="custom-radio-button">
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
                  <div className="custom-radio-button">
                    {!active ? (
                      <div className="custom-radio-button-checked"></div>
                    ) : null}
                  </div>
                  <div>Inactive</div>
                </div>
              </div>
            </div>
            <div className="search-validator-field">
              <div>
                <Image
                  src="/search-icon.svg"
                  width={24}
                  height={24}
                  alt="Search"
                  draggable={false}
                />
              </div>
              <div className="w-full">
                <input
                  className="search-validator-input focus:border-[1px]"
                  type="text"
                  placeholder="Search Validator"
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAllValidators;
