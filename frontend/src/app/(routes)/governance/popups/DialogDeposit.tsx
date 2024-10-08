import CustomButton from '@/components/common/CustomButton';
import CustomDialog from '@/components/common/CustomDialog';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { parseBalance } from '@/utils/denom';
import React, { useEffect, useState } from 'react';
import AmountInputWrapper from '../utils-components/AmountInputWrapper';
import { TxStatus } from '@/types/enums';
import useGetTxInputs from '@/custom-hooks/useGetTxInputs';
import useAuthzExecHelper from '@/custom-hooks/useAuthzExecHelper';
import useGetFeegranter from '@/custom-hooks/useGetFeegranter';
import { txDeposit } from '@/store/features/gov/govSlice';
import { MAP_TXN_MSG_TYPES } from '@/utils/feegrant';

const DialogDeposit = ({
  onClose,
  open,
  chainID,
  endTime,
  proposalTitle,
  proposalId,
}: {
  open: boolean;
  onClose: () => void;
  chainID: string;
  proposalTitle: string;
  endTime: string;
  proposalId: string;
}) => {
  const dispatch = useAppDispatch();
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const { getVoteTxInputs } = useGetTxInputs();
  const { txAuthzDeposit } = useAuthzExecHelper();

  const { decimals, minimalDenom, displayDenom } = getDenomInfo(chainID);
  const { feeAmount } = getChainInfo(chainID);

  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);

  const [availableBalance, setAvailableBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const balanceLoading = useAppSelector((state) =>
    isAuthzMode
      ? state.bank?.authz?.balances?.[chainID]?.status
      : state.bank?.balances?.[chainID]?.status
  );
  const balance = useAppSelector((state) =>
    isAuthzMode
      ? state.bank?.authz?.balances?.[chainID]
      : state.bank?.balances?.[chainID]
  );
  const authzGranter = useAppSelector((state) => state.authz.authzAddress);

  const quickSelectAmount = (value: string) => {
    if (value === 'half') {
      let halfAmount = Math.max(0, (availableBalance || 0) - feeAmount) / 2;
      halfAmount = +halfAmount.toFixed(6);
      setDepositAmount(halfAmount.toString());
    } else {
      let maxAmount = Math.max(0, (availableBalance || 0) - feeAmount);
      maxAmount = +maxAmount.toFixed(6);
      setDepositAmount(maxAmount.toString());
    }
  };

  const handleDepositAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value;
    if (/^-?\d*\.?\d*$/.test(input)) {
      if ((input.match(/\./g) || []).length <= 1) {
        setDepositAmount(input);
      }
    }
  };

  const loading = useAppSelector(
    (state) => state.gov.chains?.[chainID]?.tx?.status
  );
  const authzLoading = useAppSelector(
    (state) => state.authz.chains?.[chainID]?.tx?.status || TxStatus.INIT
  );

  const { getFeegranter } = useGetFeegranter();

  const handleDeposit = () => {
    const {
      aminoConfig,
      prefix,
      rest,
      feeAmount,
      address,
      rpc,
      minimalDenom,
      basicChainInfo,
    } = getVoteTxInputs(chainID);

    if (isAuthzMode) {
      txAuthzDeposit({
        grantee: address,
        proposalId: Number(proposalId),
        amount: Number(depositAmount) * 10 ** decimals,
        granter: authzGranter,
        chainID: chainID,
        memo: '',
      });
      return;
    }

    if (isAuthzMode) {
      txAuthzDeposit({
        grantee: address,
        proposalId: Number(proposalId),
        amount: Number(depositAmount) * 10 ** decimals,
        granter: authzGranter,
        chainID: chainID,
        memo: '',
      });
      return;
    }

    dispatch(
      txDeposit({
        isAuthzMode: false,
        basicChainInfo,
        depositer: address,
        proposalId: Number(proposalId),
        amount: Number(depositAmount) * 10 ** decimals,
        denom: minimalDenom,
        chainID: chainID,
        rpc: rpc,
        rest: rest,
        aminoConfig: aminoConfig,
        prefix: prefix,
        feeAmount: feeAmount,
        feegranter: getFeegranter(chainID, MAP_TXN_MSG_TYPES['deposit']),
      })
    );
  };

  useEffect(() => {
    if (balance) {
      setAvailableBalance(
        parseBalance(
          balance?.list?.length ? balance.list : [],
          decimals,
          minimalDenom
        )
      );
    }
  }, [balance]);

  return (
    <CustomDialog
      open={open}
      title="Deposit"
      onClose={onClose}
      styles="w-[800px]"
      description="Enter Your Deposit Details"
    >
      <div className="space-y-10 w-full">
        <div className="space-y-2 w-full">
          <div className="flex items-center justify-between w-full gap-10">
            <div className="text-[18px] font-bold max-w-[450px] truncate">
              {proposalTitle}
            </div>
            <div className="flex gap-1 items-center">
              <span className="text-small-light !text-[14px]">Deposit</span>
              <p className="text-b1">ends in {endTime}</p>
            </div>
          </div>
          <div className="divider-line"></div>
        </div>
        <div>
          <AmountInputWrapper
            balance={availableBalance}
            displayDenom={displayDenom}
            quickSelectAmount={quickSelectAmount}
            depositAmount={depositAmount}
            handleInputChange={handleDepositAmountChange}
            balanceLoading={balanceLoading === TxStatus.PENDING}
          />
        </div>
        <div>
          <CustomButton
            btnText="Deposit"
            btnStyles="w-full"
            btnLoading={
              loading === TxStatus.PENDING ||
              (isAuthzMode && authzLoading === TxStatus.PENDING)
            }
            btnDisabled={
              loading === TxStatus.PENDING ||
              (isAuthzMode && authzLoading === TxStatus.PENDING)
            }
            btnOnClick={handleDeposit}
          />
        </div>
      </div>
    </CustomDialog>
  );
};

export default DialogDeposit;
