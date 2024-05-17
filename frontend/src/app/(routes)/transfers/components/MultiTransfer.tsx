import React, { useEffect, useState } from 'react';
import Messages from './Messages';
import Summary from './Summary';
import MultiTxUpload from './MultiTxUpload';
import { useForm } from 'react-hook-form';
import { CustomMultiLineTextField } from '@/components/CustomTextField';
import props from '../customTextFields.json';
import CustomSubmitButton from '@/components/CustomButton';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '../../../../custom-hooks/useGetChainInfo';
import { multiTxns } from '@/store/features/bank/bankSlice';
import { TxStatus } from '@/types/enums';
import { setError } from '@/store/features/common/commonSlice';
import NotSupported from '@/components/illustrations/NotSupported';

const MultiTransfer = ({ chainID }: { chainID: string }) => {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const txPendingStatus = useAppSelector((state) => state.bank.tx.status);
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);

  useEffect(() => {
    if (txPendingStatus === TxStatus.IDLE) {
      setMsgs([]);
    }
  }, [txPendingStatus]);

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
      dispatch(
        setError({
          type: 'error',
          message: 'A transaction is still pending..',
        })
      );
      return;
    }
    if (msgs.length === 0) {
      dispatch(
        setError({
          type: 'error',
          message: 'No transactions found',
        })
      );

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
    <div className="flex flex-col flex-1">
      <div>
        <Summary
          chainIDs={[chainID]}
          borderStyle="rounded-[16px_16px_0px_0px]"
        />
      </div>
      {isAuthzMode ? (
        <NotSupported feature="Multi-Transfer" />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1"
        >
          <div className="w-full flex p-6 flex-1">
            <div className="w-1/2 flex flex-col space-y-6 pr-5 flex-1">
              <MultiTxUpload addMsgs={addMsgs} chainID={chainID} />
              <div>
                <div className="text-sm not-italic font-normal leading-[normal] mb-2">
                  Memo
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
                  textFieldCustomMuiSx={
                    multiSendProps.memo.textFieldCustomMuiSx
                  }
                  inputProps={multiSendProps.memo.inputProps}
                  required={false}
                />
              </div>
              <CustomSubmitButton
                pendingStatus={txPendingStatus === TxStatus.PENDING}
                circularProgressSize={20}
                buttonStyle="primary-custom-btn w-[144px]"
                buttonContent="Send"
              />
            </div>
            <div className="w-[1px] bg-[#6e6d7d] opacity-10"></div>
            <div className="w-1/2 h-full pl-[20px] flex flex-col">
              <Messages
                msgs={msgs}
                onDelete={onDelete}
                onDeleteAll={onDeleteAll}
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default MultiTransfer;
