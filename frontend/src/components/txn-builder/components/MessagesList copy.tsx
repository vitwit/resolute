import React from 'react';
import { FieldArrayWithId, UseFormSetValue } from 'react-hook-form';
import SendMessage from '../messages/SendMessage';
import DelegateMessage from '../messages/DelegateMessage';
import UndelegateMessage from '../messages/UndelegateMessage';
import RedelegateMessage from '../messages/RedelegateMessage';
import CustomMessage from '../messages/CustomMessage';
import VoteMessage from '../messages/VoteMessage';
import CustomButton from '@/components/common/CustomButton';
import Image from 'next/image';
import { NO_MESSAGES_ILLUSTRATION } from '@/constants/image-names';

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

export default MessagesList;
