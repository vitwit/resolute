import React from 'react';
import { Control, FieldErrors, UseFormGetValues } from 'react-hook-form';
import GranteeAddressField from './GranteeAddressField';
import ExpirationField from './ExpirationField';
import { feegrantMsgTypes } from '@/utils/feegrant';
import MsgItem from './MsgItem';
import Image from 'next/image';
import CustomTextField from './CustomTextField';

interface CreateFeegrantFormFields {
  grantee_address: string;
  expiration: string;
  spend_limit: string;
  period: string;
  period_spend_limit: string;
}

const CreateFeegrantForm = ({
  control,
  errors,
  isPeriodic,
  setIsPeriodic,
  handleSelectMsg,
  selectedMsgs,
  allTxns,
  setAllTxns,
  getValues,
}: {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  control: Control<any, any>;
  errors: FieldErrors<CreateFeegrantFormFields>;
  isPeriodic: boolean;
  setIsPeriodic: (value: boolean) => void;
  handleSelectMsg: (msgType: string) => void;
  selectedMsgs: string[];
  allTxns: boolean;
  setAllTxns: (value: boolean) => void;
  getValues: UseFormGetValues<any>;
}) => {
  const msgTypes = feegrantMsgTypes();
  return (
    <div>
      <div className="space-y-10">
        <div className="flex gap-10">
          <GranteeAddressField
            error={errors?.grantee_address?.message || ''}
            control={control}
            getValues={getValues}
          />
          <ExpirationField control={control} />
        </div>
        <CustomTextField
          control={control}
          error={errors?.spend_limit?.message || ''}
          name={'spend_limit'}
          title={'Spend Limit'}
        />
        {isPeriodic && (
          <div className="flex gap-10">
            <CustomTextField
              error={errors?.period?.message || ''}
              control={control}
              name="period"
              title={'Period'}
            />
            <CustomTextField
              control={control}
              error={errors?.period_spend_limit?.message || ''}
              name={'period_spend_limit'}
              title={'Period Spend Limit'}
            />
          </div>
        )}
      </div>
      <div className="text-right mt-6">
        <button
          type="button"
          className="text-[14px] leading-[20px] underline underline-offset-2 tracking-[0.56px]"
          onClick={() => setIsPeriodic(!isPeriodic)}
        >
          {isPeriodic ? 'Use Basic' : 'Use Periodic'}
        </button>
      </div>
      <div>
        <div className="py-[6px] mt-10 mb-2 flex justify-between">
          <div>Transaction Messages</div>
          <div
            onClick={() => setAllTxns(!allTxns)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div>
              <Image
                width={32}
                height={32}
                src={
                  allTxns
                    ? '/check-box-checked.svg'
                    : '/check-box-unchecked.svg'
                }
                alt={allTxns ? 'All Txns' : 'Selected Txns'}
              />
            </div>
            <div>All Transactions</div>
          </div>
        </div>
        {!allTxns && (
          <div className="flex flex-wrap gap-4">
            {msgTypes.map((msg, index) => (
              <MsgItem
                key={index}
                msg={msg.txn}
                onSelect={handleSelectMsg}
                selected={selectedMsgs.includes(msg.txn)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateFeegrantForm;
