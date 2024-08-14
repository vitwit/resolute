import React from 'react';
import { Control, FieldErrors, UseFormGetValues } from 'react-hook-form';
import { feegrantMsgTypes } from '@/utils/feegrant';
import GranteeAddressField from './GranteeAddressField';
import CustomTextField from './CustomTextField';
import ExpirationField from './ExpirationField';
import ToggleSwitch from '@/components/common/ToggleSwitch';
import MsgItem from '../../../(general)/components/MsgItem';

interface CreateFeegrantFormFields {
  grantee_address: string;
  expiration: string;
  spend_limit: string;
  period: string;
  period_spend_limit: string;
}

interface ICreateFeegrantForm {
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
}

const CreateFeegrantForm: React.FC<ICreateFeegrantForm> = (props) => {
  const {
    control,
    errors,
    isPeriodic,
    setIsPeriodic,
    handleSelectMsg,
    selectedMsgs,
    allTxns,
    setAllTxns,
    getValues,
  } = props;
  const msgTypes = feegrantMsgTypes();
  return (
    <div className="space-y-6">
      <GranteeAddressField
        error={errors?.grantee_address?.message || ''}
        control={control}
        getValues={getValues}
      />
      <ExpirationField control={control} />
      <div>
        <div className="flex justify-between items-center">
          <div className="mb-2 text-[#FFFFFF80] text-[14px] font-light">
            Spend Limit
          </div>
          <ToggleSwitch
            checked={isPeriodic}
            onChange={(checked) => setIsPeriodic(checked)}
            text={'Use Periodic'}
          />
        </div>
        <CustomTextField
          control={control}
          error={errors?.spend_limit?.message || ''}
          name={'spend_limit'}
          title={'Spend Limit'}
        />
      </div>
      {isPeriodic && (
        <div className="flex gap-10">
          <div className='flex-1'>
            <div className="mb-2 text-[#FFFFFF80] text-[14px] font-light">
              Period
            </div>
            <CustomTextField
              error={errors?.period?.message || ''}
              control={control}
              name="period"
              title={'Period'}
            />
          </div>
          <div className='flex-1'>
            <div className="mb-2 text-[#FFFFFF80] text-[14px] font-light">
              Period Spend Limit
            </div>
            <CustomTextField
              control={control}
              error={errors?.period_spend_limit?.message || ''}
              name={'period_spend_limit'}
              title={'Period Spend Limit'}
            />
          </div>
        </div>
      )}
      <div>
        <div className="py-[6px] mt-10 mb-2 flex justify-between">
          <div className="text-[#FFFFFF80] text-[14px] font-light">
            Transaction Messages
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <ToggleSwitch
              checked={allTxns}
              onChange={(checked) => setAllTxns(checked)}
              text="All Transactions"
              height={16}
              width={22.7}
            />
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
