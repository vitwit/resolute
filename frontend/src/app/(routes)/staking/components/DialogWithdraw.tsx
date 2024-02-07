import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import {
  CircularProgress,
  Dialog,
  DialogContent,
  TextField,
} from '@mui/material';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { withdrawAddressFieldStyles } from '../styles';
import useGetTxInputs from '@/custom-hooks/useGetTxInputs';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import {
  txSetWithdrawAddress,
  txWithdrawValidatorCommissionAndRewards,
} from '@/store/features/distribution/distributionSlice';
import { TxStatus } from '@/types/enums';
import useAuthzStakingExecHelper from '@/custom-hooks/useAuthzStakingExecHelper';
import useGetDistributionMsgs from '@/custom-hooks/useGetDistributionMsgs';
import useGetWithdrawPermissions from '@/custom-hooks/useGetWithdrawPermissions';
import WithdrawActions from './WithdrawAction';

const DialogWithdraw = ({
  open,
  onClose,
  chainID,
  claimRewards,
}: {
  open: boolean;
  onClose: () => void;
  chainID: string;
  claimRewards: () => void;
}) => {
  const handleDialogClose = () => {
    onClose();
  };
  const { txSetWithdrawAddressInputs, txWithdrawCommissionAndRewardsInputs } =
    useGetTxInputs();
  const { getWithdrawCommissionAndRewardsMsgs } = useGetDistributionMsgs();
  const { getChainInfo } = useGetChainInfo();
  const { txAuthzWithdrawRewardsAndCommission } = useAuthzStakingExecHelper();
  const { getWithdrawPermissions } = useGetWithdrawPermissions();
  const dispatch = useAppDispatch();

  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const authzAddress = useAppSelector((state) => state.authz.authzAddress);
  const authzDistributionData = useAppSelector(
    (state) => state.distribution.authzChains
  );
  const distributionData = useAppSelector((state) => state.distribution.chains);
  const stakingData = useAppSelector(
    (state: RootState) => state.staking.chains
  );
  const authzStakingData = useAppSelector(
    (state: RootState) => state.staking.authz.chains
  );
  const { withdrawCommissionAllowed, withdrawRewardsAllowed } =
    getWithdrawPermissions({ chainID, granter: authzAddress });

  const withdraw_address = isAuthzMode
    ? authzDistributionData?.[chainID]?.withdrawAddress
    : distributionData?.[chainID]?.withdrawAddress;

  const isAuthzValidator = authzStakingData?.[chainID]?.validator?.validatorInfo
    ?.operator_address
    ? true
    : false;

  const isSelfValidator = stakingData?.[chainID]?.validator?.validatorInfo
    ?.operator_address
    ? true
    : false;

  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [updateAddress, setUpdateAddress] = useState(false);

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setWithdrawAddress(value);
  };

  useEffect(() => {
    if (withdraw_address?.length) setWithdrawAddress(withdraw_address);
  }, [withdraw_address]);

  const { address } = getChainInfo(chainID);
  const onSubmit = () => {
    const txInputs = txSetWithdrawAddressInputs(
      chainID,
      address,
      withdrawAddress
    );
    dispatch(txSetWithdrawAddress(txInputs));
  };

  const claimRewardsAndCommission = () => {
    if (isAuthzMode) {
      txAuthzWithdrawRewardsAndCommission({
        chainID: chainID,
        grantee: address,
        granter: authzAddress,
      });
    } else {
      const msgs = getWithdrawCommissionAndRewardsMsgs({ chainID });
      const txInputs = txWithdrawCommissionAndRewardsInputs(chainID, msgs);
      dispatch(txWithdrawValidatorCommissionAndRewards(txInputs));
    }
  };

  const claimCommission = () => {};

  const withdrawCommissionLoading = useAppSelector(
    (state) => state.distribution.chains?.[chainID]?.txWithdrawCommission.status
  );

  const withdrawRewardsLoading = useAppSelector(
    (state) => state.distribution.chains?.[chainID]?.tx.status
  );

  const updateWithdrawAddressLoading = useAppSelector(
    (state) => state.distribution.chains?.[chainID]?.txSetWithdrawAddress.status
  );

  useEffect(() => {
    if (withdrawCommissionLoading === TxStatus.IDLE) {
      onClose();
    }
  }, [withdrawCommissionLoading]);

  useEffect(() => {
    if (withdrawRewardsLoading === TxStatus.IDLE) {
      onClose();
    }
  }, [withdrawRewardsLoading]);

  useEffect(() => {
    if (updateWithdrawAddressLoading === TxStatus.IDLE) {
      onClose();
    }
  }, [updateWithdrawAddressLoading]);

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="lg"
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white">
          <div className="px-10 py-6 pt-10 flex justify-end">
            <div onClick={onClose}>
              <Image
                className="cursor-pointer"
                src={CLOSE_ICON_PATH}
                width={24}
                height={24}
                alt="Close"
                draggable={false}
              />
            </div>
          </div>
          <div className="mb-10 flex gap-6 px-10 items-center">
            <div className="flex flex-col gap-6 w-full">
              <h2 className="text-[20px] font-bold leading-normal">
                Withdraw Rewards
              </h2>
              <div className="bg-[#ffffff1a] rounded-3xl p-6 pb-10 flex gap-6">
                <div className="flex-1 relative">
                  <TextField
                    className="bg-[#FFFFFF0D] rounded-2xl w-full"
                    name="granteeAddress"
                    value={withdrawAddress}
                    onChange={handleAddressChange}
                    required
                    disabled={!updateAddress}
                    autoFocus={true}
                    placeholder="Enter withdraw address"
                    InputProps={{
                      sx: {
                        input: {
                          color: 'white',
                          fontSize: '14px',
                          padding: 2,
                        },
                      },
                    }}
                    sx={withdrawAddressFieldStyles}
                  />
                  <div className="absolute right-0 pt-2">
                    <div className="flex space-x-2 justify-end items-center">
                      <Image
                        src="/info.svg"
                        width={16}
                        height={16}
                        alt="Info-Icon"
                        draggable={false}
                      />
                      <p className="txt-xs">
                        Your claimed rewards will be updated to this address
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (updateAddress) {
                      onSubmit();
                    } else {
                      setUpdateAddress(true);
                    }
                  }}
                  className="primary-gradient rounded-2xl flex justify-center items-center w-[212px]"
                >
                  {updateWithdrawAddressLoading === TxStatus.PENDING ? (
                    <CircularProgress sx={{ color: 'white' }} size={20} />
                  ) : (
                    <>{updateAddress ? 'Confirm' : 'Update Address'}</>
                  )}
                </button>
              </div>
              <WithdrawActions
                claimRewards={claimRewards}
                claimRewardsAndCommission={claimRewardsAndCommission}
                claimCommission={claimCommission}
                isAuthzMode={isAuthzMode}
                isSelfValidator={isSelfValidator}
                isAuthzValidator={isAuthzValidator}
                withdrawCommissionLoading={withdrawCommissionLoading}
                withdrawRewardsAllowed={withdrawRewardsAllowed}
                withdrawRewardsLoading={withdrawRewardsLoading}
                withdrawCommissionAllowed={withdrawCommissionAllowed}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogWithdraw;
