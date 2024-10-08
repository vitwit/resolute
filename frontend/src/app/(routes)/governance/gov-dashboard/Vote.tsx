import { GOV_VOTE_OPTIONS } from '@/constants/gov-constants';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useAuthzExecHelper from '@/custom-hooks/useAuthzExecHelper';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { txVote } from '@/store/features/gov/govSlice';
import { TxStatus } from '@/types/enums';
import { voteOptionNumber } from '@/utils/constants';
import React, { useEffect, useState } from 'react';
import useGetFeegranter from '@/custom-hooks/useGetFeegranter';
import { MAP_TXN_MSG_TYPES } from '@/utils/feegrant';
import CustomButton from '@/components/common/CustomButton';
import { setError } from '@/store/features/common/commonSlice';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';
import { getColorForVoteOption } from '@/utils/util';
import useGetProposals from '@/custom-hooks/governance/useGetProposals';
import useAddressConverter from '@/custom-hooks/useAddressConverter';

const Vote = ({
  chainID,
  proposalId,
  colCount,
}: {
  proposalId: string;
  chainID: string;
  colCount: number;
}) => {
  const { getFeegranter } = useGetFeegranter();
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const { convertAddress } = useAddressConverter();
  const [voteOption, setVoteOption] = useState('');
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);

  const handleOptionClick = (optionLabel: string) => {
    setVoteOption((prev) => (prev === optionLabel ? '' : optionLabel));
  };

  const loading = useAppSelector(
    (state) => state.gov.chains?.[chainID]?.tx?.status
  );
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const authzAddress = useAppSelector((state) => state.authz.authzAddress);
  const authzGranter = useAppSelector((state) => state.authz.authzAddress);
  const { txAuthzVote } = useAuthzExecHelper();

  const authzLoading = useAppSelector(
    (state) => state.authz.chains?.[chainID]?.tx?.status || TxStatus.INIT
  );

  const dispatch = useAppDispatch();
  const basicChainInfo = getChainInfo(chainID);
  const { address, aminoConfig, feeAmount, prefix, rest, rpc } = basicChainInfo;
  const authzGranterAddress = convertAddress(chainID, authzAddress);
  const { minimalDenom } = getDenomInfo(chainID);
  const { getVote } = useGetProposals();
  const alreadyVotedOption = getVote({
    address: isAuthzMode ? authzGranterAddress : address,
    chainID,
    proposalId,
  });

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

    if (isAuthzMode) {
      txAuthzVote({
        grantee: address,
        proposalId: Number(proposalId),
        option: voteOptionNumber[voteOption.toLowerCase()],
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
    <div className="flex flex-col gap-6 w-full">
      {alreadyVotedOption?.length ? (
        <div className="flex justify-end italic">
          <div className="text-[14px]">
            <span className="font-light ">You have voted </span>
            <span
              style={{ color: getColorForVoteOption(alreadyVotedOption) }}
              className="capitalize font-bold"
            >
              {alreadyVotedOption}
            </span>
          </div>
        </div>
      ) : null}

      <div className={`grid-cols-${colCount} grid gap-6`}>
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
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = option.selectedColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                voteOption === option.label
                  ? option.selectedColor
                  : 'transparent')
            }
            disabled={
              loading === TxStatus.PENDING ||
              (isAuthzMode && authzLoading === TxStatus.PENDING)
            }
          >
            {option.label} <br />
          </button>
        ))}
      </div>

      <CustomButton
        btnText={isWalletConnected ? 'Submit Vote' : 'Connect Wallet to Vote'}
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
  );
};

export default Vote;
