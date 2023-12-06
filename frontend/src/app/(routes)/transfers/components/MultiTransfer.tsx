import React, { useState } from 'react';
import Messages from './Messages';
import Summary from './Summary';
import MultiTxUpload from './MultiTxUpload';
import { useForm } from 'react-hook-form';
import { CustomMultiLineTextField } from '@/components/CustomTextField';
import props from '../customTextFeilds.json';
import CustomSubmitButton from '@/components/CustomButton';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '../../../../custom-hooks/useGetChainInfo';
import { multiTxns } from '@/store/features/bank/bankSlice';
import { TxStatus } from '@/types/enums';

const MultiTransfer = ({ chainID }: { chainID: string }) => {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const txPendingStatus = useAppSelector((state) => state.bank.tx.status);

  const multiSendProps = props['multi-send'];
  const dispatch = useAppDispatch();
  const { getChainInfo, getDenomInfo } = useGetChainInfo();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      memo: '',
    },
  });

  const addMsgs = (msgs: Msg[]) => {
    setMsgs(msgs);
  };

  const onDelete = (index: number) => {
    setMsgs((msgs) => {
      return [...msgs.slice(0, index), ...msgs.slice(index + 1, msgs.length)];
    });
  };

  const onDeleteAll = () => {
    setMsgs([]);
  };

  const onSubmit = (data: { memo: string }) => {
    if (txPendingStatus === TxStatus.PENDING) {
      alert('A transaction is still pending..');
      return;
    }
    if (msgs.length === 0) {
      alert('No transactions');
      return;
    }
    const denomInfo = getDenomInfo(chainID);
    const txnInputs: MultiTxnsInputs = {
      basicChainInfo: getChainInfo(chainID),
      msgs,
      memo: data.memo,
      denom: denomInfo.minimalDenom,
      feegranter: '',
    };
    dispatch(multiTxns(txnInputs));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full h-[605px] flex">
        <div className="w-1/2 flex flex-col justify-between pr-5">
          <div>
            <Summary chainIDs={[chainID]} />
          </div>
          <MultiTxUpload addMsgs={addMsgs} chainID={chainID} />
          <div>
            <div className="text-sm not-italic font-normal leading-[normal] mb-2">
              Enter Memo
            </div>
            <CustomMultiLineTextField
              rows={4}
              name={multiSendProps.memo.name}
              rules={multiSendProps.memo.rules}
              control={control}
              error={!!errors.memo}
              textFieldClassName={multiSendProps.memo.textFieldClassName}
              textFieldSize={multiSendProps.memo.textFieldSize}
              placeHolder={multiSendProps.memo.placeHolder}
              textFieldCustomMuiSx={multiSendProps.memo.textFieldCustomMuiSx}
              inputProps={multiSendProps.memo.inputProps}
              required={false}
            />
          </div>
          <CustomSubmitButton
            pendingStatus={txPendingStatus}
            circularProgressSize={24}
            buttonStyle="primary-action-btn w-[144px] h-[40px]"
            buttonContent="Send"
          />
        </div>
        <div className="w-[1px] bg-[#6e6d7d]"></div>
        <div className="w-1/2 h-full pl-[20px] flex flex-col">
          <Messages msgs={msgs} onDelete={onDelete} onDeleteAll={onDeleteAll} />
        </div>
      </div>
    </form>
  );
};

export default MultiTransfer;
