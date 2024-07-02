import { I_ICON, NO_MESSAGES_ILLUSTRATION } from '@/constants/image-names';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import Image from 'next/image';
import React from 'react';
import {
  Controller,
  FieldArrayWithId,
  useFieldArray,
  useForm,
  UseFormSetValue,
} from 'react-hook-form';
import '@/app/(routes)/multiops/multiops.css';
import { TextField } from '@mui/material';
import { customMUITextFieldStyles } from '@/app/(routes)/multiops/styles';
import SendMessage from './messages/SendMessage';
import CustomButton from '../common/CustomButton';
import DelegateMessage from './messages/DelegateMessage';
import UndelegateMessage from './messages/UndelegateMessage';
import RedelegateMessage from './messages/RedelegateMessage';
import VoteMessage from './messages/VoteMessage';
import CustomMessage from './messages/CustomMessage';
import { TXN_BUILDER_MSGS } from '@/constants/txn-builder';

type MsgType =
  | 'Send'
  | 'Delegate'
  | 'Undelegate'
  | 'Redelegate'
  | 'Vote'
  | 'Custom';

const TxnBuilder = ({
  chainID,
  onSubmit,
  loading,
}: {
  chainID: string;
  onSubmit: (data: TxnBuilderForm) => void;
  loading: boolean;
}) => {
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const basicChainInfo = getChainInfo(chainID);
  const { decimals, displayDenom, minimalDenom } = getDenomInfo(chainID);
  const currency = {
    coinDenom: displayDenom,
    coinDecimals: decimals,
    coinMinimalDenom: minimalDenom,
  };
  const { feeAmount } = basicChainInfo;

  const { handleSubmit, control, reset, setValue } = useForm<TxnBuilderForm>({
    defaultValues: {
      gas: 900000,
      memo: '',
      fees: feeAmount * 10 ** currency.coinDecimals,
      msgs: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'msgs',
  });

  const handleAddMessage = (type: MsgType) => {
    if (type === 'Send') {
      append({ type: 'Send', address: '', amount: '' });
    } else if (type === 'Delegate') {
      append({ type: 'Delegate', validator: '', amount: '' });
    } else if (type === 'Undelegate') {
      append({ type: 'Undelegate', validator: '', amount: '' });
    } else if (type === 'Redelegate') {
      append({
        type: 'Redelegate',
        sourceValidator: '',
        destValidator: '',
        amount: '',
      });
    } else if (type === 'Vote') {
      append({
        type: 'Vote',
        option: '',
        proposalId: '',
      });
    } else if (type === 'Custom') {
      append({
        type: 'Custom',
        typeUrl: '',
        value: '',
      });
    }
  };

  const handleClearAll = () => {
    reset({
      gas: 900000,
      memo: '',
      fees: feeAmount * 10 ** currency.coinDecimals,
      msgs: [],
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-10 h-full overflow-y-scroll flex gap-10"
    >
      <SelectMessage control={control} handleAddMessage={handleAddMessage} />
      <MessagesList
        control={control}
        fields={fields}
        remove={remove}
        handleClearAll={handleClearAll}
        setValue={setValue}
        chainID={chainID}
        loading={loading}
      />
    </form>
  );
};

export default TxnBuilder;

const SelectMessage = ({
  control,
  handleAddMessage,
}: {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  control: any;
  handleAddMessage: (type: MsgType) => void;
}) => {
  return (
    <div className="w-[40%]">
      <div className="text-b1">Add Messages</div>
      <div className="space-y-10">
        <div className="space-y-6 mt-6">
          <div className="flex gap-2">
            <div className="text-b1-light">Select Message</div>
            <Image src={I_ICON} height={20} width={20} alt="" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {TXN_BUILDER_MSGS.map((msg) => (
              <button
                key={msg}
                className="msg-btn"
                type="button"
                onClick={() => handleAddMessage(msg as MsgType)}
              >
                {msg}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="text-b1-light">Enter Gas</div>
          <Controller
            name="gas"
            control={control}
            render={({ field }) => (
              <TextField
                className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
                {...field}
                sx={{
                  ...customMUITextFieldStyles,
                }}
                placeholder="Enter gas"
                fullWidth
                InputProps={{
                  sx: {
                    input: {
                      color: 'white',
                      fontSize: '14px',
                      padding: 2,
                    },
                  },
                }}
              />
            )}
          />
        </div>
        <div className="flex-1 space-y-2">
          <div className="text-b1-light">Enter Memo (optional)</div>
          <Controller
            name="memo"
            control={control}
            render={({ field }) => (
              <TextField
                className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
                {...field}
                sx={{
                  ...customMUITextFieldStyles,
                }}
                placeholder="Enter memo"
                fullWidth
                InputProps={{
                  sx: {
                    input: {
                      color: 'white',
                      fontSize: '14px',
                      padding: 2,
                    },
                  },
                }}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

const MessagesList = ({
  control,
  fields,
  remove,
  handleClearAll,
  setValue,
  chainID,
  loading,
}: {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  control: any;
  fields: FieldArrayWithId<TxnBuilderForm, 'msgs', 'id'>[];
  remove: (index: number) => void;
  handleClearAll: () => void;
  setValue: UseFormSetValue<TxnBuilderForm>;
  chainID: string;
  loading: boolean;
}) => {
  return (
    <div className="flex-1 space-y-6 h-full flex flex-col justify-between bg-[#FFFFFF05] rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          Messages {fields?.length ? <span>({fields?.length})</span> : null}{' '}
        </div>
        <div className="secondary-btn cursor-pointer" onClick={handleClearAll}>
          Clear All
        </div>
      </div>
      <div className="space-y-6 flex-1 overflow-y-scroll">
        {fields.map((field, index) => (
          <div key={field.id}>
            {field.type === 'Send' && (
              <SendMessage control={control} index={index} remove={remove} />
            )}
            {field.type === 'Delegate' && (
              <DelegateMessage
                control={control}
                index={index}
                remove={remove}
                setValue={setValue}
                chainID={chainID}
              />
            )}
            {field.type === 'Undelegate' && (
              <UndelegateMessage
                control={control}
                index={index}
                remove={remove}
                setValue={setValue}
                chainID={chainID}
              />
            )}
            {field.type === 'Redelegate' && (
              <RedelegateMessage
                control={control}
                index={index}
                remove={remove}
                setValue={setValue}
                chainID={chainID}
              />
            )}
            {field.type === 'Vote' && (
              <VoteMessage
                index={index}
                remove={remove}
                setValue={setValue}
                chainID={chainID}
              />
            )}
            {field.type === 'Custom' && (
              <CustomMessage control={control} index={index} remove={remove} />
            )}
          </div>
        ))}
      </div>
      {fields?.length ? (
        <CustomButton
          btnType="submit"
          btnText="Create Transaction"
          btnStyles="w-full"
          btnDisabled={loading}
          btnLoading={loading}
        />
      ) : (
        <div className="h-full flex flex-col items-center justify-center">
          <Image
            src={NO_MESSAGES_ILLUSTRATION}
            height={260}
            width={390}
            alt="No Messages"
          />
          <div className="text-b1 font-light">No messages yet</div>
        </div>
      )}
    </div>
  );
};
