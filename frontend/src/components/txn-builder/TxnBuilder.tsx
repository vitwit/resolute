import { I_ICON } from '@/constants/image-names';
import { TXN_BUILDER_MSGS } from '@/constants/multisig';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import Image from 'next/image';
import React, { useEffect } from 'react';
import {
  Controller,
  FieldArrayWithId,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import '@/app/(routes)/multiops/multiops.css';
import { TextField } from '@mui/material';
import { customMUITextFieldStyles } from '@/app/(routes)/multiops/styles';
import SendMessage from './messages/SendMessage';
import CustomButton from '../common/CustomButton';
import { fee } from '@/txns/execute';
import { getAuthToken } from '@/utils/localStorage';
import { COSMOS_CHAIN_ID } from '@/utils/constants';
import { createTxn } from '@/store/features/multisig/multisigSlice';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { msgSendTypeUrl } from '@/txns/bank/send';
import { setError } from '@/store/features/common/commonSlice';
import { useRouter } from 'next/navigation';
import { Decimal } from '@cosmjs/math';

type MsgType = 'Send' | 'Delegate';

type SendMsg = {
  type: 'Send';
  address: string;
  amount: string;
};

type DelegateMsg = {
  type: 'Delegate';
  validator: string;
  amount: string;
};

type Message = SendMsg | DelegateMsg;

type FormData = {
  gas: number;
  memo: string;
  fees: number;
  msgs: Message[];
};

const TxnBuilder = ({
  chainID,
  multisigAddress,
  chainName,
}: {
  chainID: string;
  multisigAddress: string;
  chainName: string;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const basicChainInfo = getChainInfo(chainID);
  const { decimals, displayDenom, minimalDenom } = getDenomInfo(chainID);
  const currency = {
    coinDenom: displayDenom,
    coinDecimals: decimals,
    coinMinimalDenom: minimalDenom,
  };
  const { address: walletAddress, feeAmount } = basicChainInfo;

  const { handleSubmit, control, reset } = useForm<FormData>({
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

  const onSubmit = (data: FormData) => {
    const feeObj = fee(
      currency.coinMinimalDenom,
      data.fees.toString(),
      data.gas
    );
    const authToken = getAuthToken(COSMOS_CHAIN_ID);
    const formattedMsgs = formatMsgs(
      data.msgs,
      multisigAddress,
      minimalDenom,
      decimals
    );
    dispatch(
      createTxn({
        data: {
          address: multisigAddress,
          chain_id: chainID,
          messages: formattedMsgs,
          fee: feeObj,
          memo: data.memo,
          gas: data.gas,
        },
        queryParams: {
          address: walletAddress,
          signature: authToken?.signature || '',
        },
      })
    );
  };

  const handleBackToMultisig = () => {
    router.push(`/multisig/${chainName}/${multisigAddress}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-10 h-full overflow-y-scroll flex gap-10"
    >
      <SelectMessage control={control} handleAddMessage={handleAddMessage} />
      <DividerLine />
      <MessagesList
        control={control}
        fields={fields}
        remove={remove}
        handleClearAll={handleClearAll}
        handleBackToMultisig={handleBackToMultisig}
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
    <div className="w-[35%]">
      <div className="text-b1">Add Messages</div>
      <div className="space-y-10">
        <div className="space-y-6 mt-6">
          <div className="flex gap-2">
            <div className="text-b1-light">Select Message</div>
            <Image src={I_ICON} height={20} width={20} alt="" />
          </div>
          <div>
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

const DividerLine = () => {
  return <div className="h-full w-[1px] bg-[#ffffff80] opacity-20"></div>;
};

const MessagesList = ({
  control,
  fields,
  remove,
  handleClearAll,
  handleBackToMultisig,
}: {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  control: any;
  fields: FieldArrayWithId<FormData, 'msgs', 'id'>[];
  remove: (index: number) => void;
  handleClearAll: () => void;
  handleBackToMultisig: () => void;
}) => {
  const dispatch = useAppDispatch();
  const createRes = useAppSelector((state) => state.multisig.createTxnRes);
  useEffect(() => {
    if (createRes?.status === 'rejected') {
      dispatch(
        setError({
          type: 'error',
          message: createRes?.error,
        })
      );
    } else if (createRes?.status === 'idle') {
      dispatch(
        setError({
          type: 'success',
          message: 'Transaction created',
        })
      );
      setTimeout(handleBackToMultisig, 1000);
    }
  }, [createRes]);

  return (
    <div className="flex-1 space-y-6 h-full overflow-y-scroll">
      <div className="flex items-center justify-between">
        <div>Messages</div>
        <div className="secondary-btn cursor-pointer" onClick={handleClearAll}>
          Clear All
        </div>
      </div>
      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id}>
            {field.type === 'Send' && (
              <SendMessage control={control} index={index} remove={remove} />
            )}
          </div>
        ))}
      </div>
      {fields?.length ? (
        <CustomButton
          btnType="submit"
          btnText="Create Transaction"
          btnStyles="w-full"
          btnDisabled={createRes.status === 'pending'}
          btnLoading={createRes.status === 'pending'}
        />
      ) : (
        <div className="my-20 h-80 flex items-center justify-center">
          - No Messages -
        </div>
      )}
    </div>
  );
};

const formatMsgs = (
  msgs: Message[],
  fromAddress: string,
  minimalDenom: string,
  coinDecimals: number
) => {
  const messages: Msg[] = [];
  msgs.forEach((msg) => {
    if (msg.type === 'Send') {
      const amountInAtomics = Decimal.fromUserInput(
        msg.amount,
        Number(coinDecimals)
      ).atomics;
      messages.push({
        typeUrl: msgSendTypeUrl,
        value: {
          fromAddress,
          toAddress: msg.address,
          amount: [
            {
              amount: amountInAtomics,
              denom: minimalDenom,
            },
          ],
        },
      });
    }
  });
  return messages;
};
