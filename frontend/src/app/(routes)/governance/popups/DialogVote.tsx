import CustomButton from '@/components/common/CustomButton';
import CustomDialog from '@/components/common/CustomDialog';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import React, { useEffect, useState } from 'react';
import { TxStatus } from '@/types/enums';
import useAuthzExecHelper from '@/custom-hooks/useAuthzExecHelper';
import useGetFeegranter from '@/custom-hooks/useGetFeegranter';
import { MAP_TXN_MSG_TYPES } from '@/utils/feegrant';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';
import { setError } from '@/store/features/common/commonSlice';
import { voteOptionNumber } from '@/utils/constants';
import { txVote } from '@/store/features/gov/govSlice';
import { GOV_VOTE_OPTIONS } from '@/constants/gov-constants';

const DialogVote = ({
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
  const { getFeegranter } = useGetFeegranter();
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const [voteOption, setVoteOption] = useState('');
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);

  const handleOptionClick = (optionLabel: string) => {
    setVoteOption((prev) => (prev === optionLabel ? '' : optionLabel));
  };

  const loading = useAppSelector(
    (state) => state.gov.chains?.[chainID]?.tx?.status
  );

  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const authzGranter = useAppSelector((state) => state.authz.authzAddress);
  const { txAuthzVote } = useAuthzExecHelper();

  const authzLoading = useAppSelector(
    (state) => state.authz.chains?.[chainID]?.tx?.status || TxStatus.INIT
  );

  const dispatch = useAppDispatch();

  const handleVote = () => {
    if (!isWalletConnected) {
      dispatch(setConnectWalletOpen(true));
      return;
    }
    if (!voteOption) {
      dispatch(
        setError({ type: 'error', message: 'Please select vote option' })
      );
      return;
    }
    const basicChainInfo = getChainInfo(chainID);
    const { address, aminoConfig, feeAmount, prefix, rest, rpc } =
      basicChainInfo;
    const { minimalDenom } = getDenomInfo(chainID);

    if (isAuthzMode) {
      txAuthzVote({
        grantee: address,
        proposalId: Number(proposalId),
        option: voteOptionNumber[voteOption],
        granter: authzGranter,
        chainID,
        memo: '',
      });
      return;
    }

    dispatch(
      txVote({
        basicChainInfo,
        isAuthzMode: false,
        voter: address,
        proposalId: Number(proposalId),
        option: voteOptionNumber[voteOption.toLowerCase()],
        denom: minimalDenom,
        chainID: chainID,
        rpc: rpc,
        rest: rest,
        aminoConfig: aminoConfig,
        prefix: prefix,
        feeAmount: feeAmount,
        feegranter: getFeegranter(chainID, MAP_TXN_MSG_TYPES['vote']),
        justification: '',
      })
    );
  };

  useEffect(() => {
    setVoteOption('');
  }, [proposalId]);

  return (
    <CustomDialog
      open={open}
      title="Vote"
      onClose={onClose}
      styles="w-[800px]"
      description="Cast your vote"
    >
      <div className="space-y-10">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-[18px] font-normal max-w-[450px] truncate text-[#ffffffad]">
              {proposalTitle}
            </div>
            <div className="flex gap-1 items-center">
              <span className="text-small-light">Voting</span>
              <p className="text-b1">ends in {endTime}</p>
            </div>
          </div>
          <div className="divider-line"></div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {GOV_VOTE_OPTIONS?.map((option) => (
            <button
              key={option.label}
              className={`vote-optn-btn flex-1 text-b1`}
              onClick={() => handleOptionClick(option.label)}
              style={{
                backgroundColor:
                  voteOption === option.label
                    ? option.selectedColor
                    : 'transparent',
                borderColor: '',
              }}
              disabled={
                loading === TxStatus.PENDING ||
                (isAuthzMode && authzLoading === TxStatus.PENDING)
              }
            >
              {option.label} <br />
            </button>
          ))}
        </div>
        <div>
          <CustomButton
            btnText={
              isWalletConnected ? 'Submit Vote' : 'Connect Wallet to Vote'
            }
            btnLoading={
              loading === TxStatus.PENDING ||
              (isAuthzMode && authzLoading === TxStatus.PENDING)
            }
            btnDisabled={
              loading === TxStatus.PENDING ||
              (isAuthzMode && authzLoading === TxStatus.PENDING)
            }
            btnOnClick={handleVote}
            btnStyles="w-full"
          />
        </div>
      </div>
    </CustomDialog>
  );
};

export default DialogVote;
