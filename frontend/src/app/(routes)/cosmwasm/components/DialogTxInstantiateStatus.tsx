import { useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { TxStatus } from '@/types/enums';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { TXN_FAILED_ICON, TXN_SUCCESS_ICON } from '@/utils/constants';
import { parseBalance } from '@/utils/denom';
import { Box, Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import CustomCopyField from './txn-status-components/CustomCopyField';
import ActionButtonsGroup from './txn-status-components/ActionButtonsGroup';

const DialogTxInstantiateStatus = ({ chainID }: { chainID: string }) => {
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const { explorerTxHashEndpoint } = getChainInfo(chainID);
  const {
    decimals = 0,
    displayDenom = '',
    minimalDenom = '',
  } = getDenomInfo(chainID);
  const currency = useMemo(
    () => ({
      coinMinimalDenom: minimalDenom,
      coinDecimals: decimals,
      coinDenom: displayDenom,
    }),
    [minimalDenom, decimals, displayDenom]
  );

  const [open, setOpen] = useState(false);
  const txInstantiateStatus = useAppSelector(
    (state) => state.cosmwasm.chains?.[chainID]?.txInstantiate?.status
  );
  const txHash = useAppSelector(
    (state) => state.cosmwasm.chains?.[chainID]?.txInstantiate?.txHash
  );
  const txResponse = useAppSelector(
    (state) => state.cosmwasm.chains?.[chainID]?.txInstantiate?.txResponse
  );

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (txHash && txInstantiateStatus === TxStatus.IDLE) setOpen(true);
  }, [txHash]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      sx={{ backgroundColor: '#07051360' }}
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <Box
          sx={{
            width: '600px',
            borderRadius: '40px',
            overflow: 'hidden',
            background:
              'linear-gradient(178deg, #241B61 1.71%, #69448D 98.35%, #69448D 98.35%)',
          }}
        >
          <div className="w-[600px] text-white flex py-[46px] flex-col justify-center items-center">
            <div className="flex flex-col items-center gap-4  px-[60px]">
              <div>
                <Image
                  src={
                    txResponse?.code === 0 ? TXN_SUCCESS_ICON : TXN_FAILED_ICON
                  }
                  height={48}
                  width={48}
                  alt="Transaction Successful"
                />
              </div>
              <div className="txn-status-text">
                {txResponse?.code === 0 ? (
                  <span className="txt-success-text">
                    Transaction Successful !
                  </span>
                ) : (
                  <span className="txn-failed-text">Transaction Failed !</span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              <Image
                src="/semi-circle-left.svg"
                draggable={false}
                height={30}
                width={30}
                alt=""
              />
              <div className="divider my-10"></div>
              <Image
                src="/semi-circle-right.svg"
                draggable={false}
                height={30}
                width={30}
                alt=""
              />
            </div>
            <div className="px-[60px] w-full">
              <div className="txn-details">
                <CustomCopyField name="Code ID" value={txResponse?.codeId} />
                <CustomCopyField
                  name="Contract Address"
                  value={txResponse?.contractAddress}
                />
                <CustomCopyField name="Transaction Hash" value={txHash} />
                <div className="txn-details-item">
                  <div className="txn-details-item-title">Fees</div>
                  <div className="txn-details-item-content">
                    {txResponse?.fee?.[0]
                      ? parseBalance(
                          txResponse?.fee,
                          currency.coinDecimals,
                          currency.coinMinimalDenom
                        )
                      : '-'}{' '}
                    {currency.coinDenom}
                  </div>
                </div>
                <div className="txn-details-item">
                  <div className="txn-details-item-title">Memo</div>
                  <div className="txn-details-item-content">
                    {txResponse?.memo || '-'}
                  </div>
                </div>
                {txResponse?.code === 0 ? null : (
                  <div className="txn-details-item">
                    <div className="txn-details-item-title">Raw Log</div>
                    <div className="txn-details-item-content !leading-4 text-[#e75656]">
                      {txResponse?.rawLog || '-'}
                    </div>
                  </div>
                )}
              </div>
              <ActionButtonsGroup
                explorer={explorerTxHashEndpoint}
                txHash={txHash}
              />
            </div>
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DialogTxInstantiateStatus;
