import { useAppSelector } from '@/custom-hooks/StateHooks';
import { TextField } from '@mui/material';
import React, { ChangeEvent } from 'react';
import { createMultisigTextFieldStyles } from '../../styles';
import CustomButton from '@/components/common/CustomButton';
import { TxStatus } from '@/types/enums';

const ImportMultisig = ({
  addressValidationError,
  fetchMultisigAccount,
  handleMultisigAddressChange,
  multisigAddress,
  switchToCreateMultisig,
}: {
  multisigAddress: string;
  handleMultisigAddressChange: (e: ChangeEvent<HTMLInputElement>) => void;
  addressValidationError: string;
  fetchMultisigAccount: () => void;
  switchToCreateMultisig: () => void;
}) => {
  const importMultisigAccountRes = useAppSelector(
    (state) => state.multisig.multisigAccountData
  );

  return (
    <div className="flex-1 space-y-10">
      <div className="flex gap-6 my-6">
        <div className="flex-1 space-y-4">
          <div className="text-b1-light !font-light">Import Multisig</div>
          <div>
            <div className="flex items-center gap-10">
              <TextField
                className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
                name="multisigAddress"
                value={multisigAddress}
                onChange={handleMultisigAddressChange}
                required
                autoFocus={true}
                fullWidth
                placeholder="Enter Multisig Address Here"
                InputProps={{
                  sx: {
                    input: {
                      color: 'white',
                      fontSize: '14px',
                      padding: 2,
                    },
                  },
                }}
                sx={createMultisigTextFieldStyles}
              />
              <CustomButton
                btnText="Import"
                btnLoading={
                  importMultisigAccountRes.status === TxStatus.PENDING
                }
                btnDisabled={
                  importMultisigAccountRes.status === TxStatus.PENDING
                }
                btnOnClick={fetchMultisigAccount}
                btnStyles="w-[150px]"
              />
            </div>
            <div className="address-error !text-left">
              {addressValidationError || ''}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-1 justify-center">
        <div className="text-[16px] font-extralight text-[#ffffff80]">
          Do not have an existing MultiSig account ? Create New
        </div>{' '}
        <button
          onClick={switchToCreateMultisig}
          className="secondary-btn !text-[16px] !font-bold !text-[#ffffffad]"
        >
          here
        </button>
      </div>
    </div>
  );
};

export default ImportMultisig;
