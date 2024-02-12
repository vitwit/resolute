import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { CircularProgress, Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import NetworkItem from '../../authz/components/NetworkItem';
import { FieldValues, useForm } from 'react-hook-form';
import CreateFeegrantForm from './CreateFeegrantForm';
import {
  MAP_TXN_MSG_TYPES,
  getFeegrantFormDefaultValues,
} from '@/utils/feegrant';
import useGetFeegrantMsgs from '@/custom-hooks/useGetFeegrantMsgs';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import useMultiTxTracker from '@/custom-hooks/useGetCreateFeegrantTxLoading';
import MultiChainTxnStatus from '../../authz/components/MultiChainTxnStatus';
import ConfirmDialogClose from '../../authz/components/ConfirmDialogClose';
import {
  CHAIN_NOT_SELECTED_ERROR,
  MSG_NOT_SELECTED_ERROR,
} from '@/utils/errors';
import useGetFeegranter from '@/custom-hooks/useGetFeegranter';

interface DialogCreateFeegrantProps {
  open: boolean;
  onClose: () => void;
}

const DialogCreateFeegrant: React.FC<DialogCreateFeegrantProps> = (props) => {
  const { open, onClose } = props;
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [displayedChains, setDisplayedChains] = useState<string[]>(
    chainIDs?.slice(0, 5) || []
  );
  const [isPeriodic, setIsPeriodic] = useState<boolean>(false);
  const [viewAllChains, setViewAllChains] = useState<boolean>(false);
  const [selectedMsgs, setSelectedMsgs] = useState<string[]>([]);
  const [allTxns, setAllTxns] = useState<boolean>(true);
  const [txnStarted, setTxnStarted] = useState(false);
  const [formValidationError, setFormValidationError] = useState({
    chains: '',
    msgs: '',
  });
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);

  const { getFeegrantMsgs } = useGetFeegrantMsgs();
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const { getFeegranter } = useGetFeegranter();
  const { trackTxs, chainsStatus, currentTxCount } = useMultiTxTracker();

  const handleSelectChain = (chainID: string) => {
    if (txnStarted) {
      return;
    }
    const updatedSelection = selectedChains.includes(chainID)
      ? selectedChains.filter((id) => id !== chainID)
      : [...selectedChains, chainID];
    setSelectedChains(updatedSelection);
  };

  const handleSelectMsg = (msgType: string) => {
    if (txnStarted) {
      return;
    }
    const updatedSelection = selectedMsgs.includes(msgType)
      ? selectedMsgs.filter((id) => id !== msgType)
      : [...selectedMsgs, msgType];
    setSelectedMsgs(updatedSelection);
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset: resetForm,
    getValues,
  } = useForm({
    defaultValues: getFeegrantFormDefaultValues(),
  });

  const onSubmit = (fieldValues: FieldValues) => {
    if (!validateForm()) {
      return;
    }
    const { chainWiseGrants } = getFeegrantMsgs({
      isFiltered: !allTxns,
      msgsList: selectedMsgs,
      selectedChains,
      isPeriodic,
      fieldValues: fieldValues,
    });
    const txCreateFeegrantInputs: MultiChainFeegrantTx[] = [];

    chainWiseGrants.forEach((chain) => {
      const chainID = chain.chainID;
      const msgs = chain.msg;
      const basicChainInfo = getChainInfo(chainID);
      const { minimalDenom, decimals } = getDenomInfo(chainID);
      const { feeAmount: avgFeeAmount } = basicChainInfo;
      const feeAmount = avgFeeAmount * 10 ** decimals;

      txCreateFeegrantInputs.push({
        ChainID: chainID,
        txInputs: {
          basicChainInfo: basicChainInfo,
          msg: msgs,
          denom: minimalDenom,
          feeAmount: feeAmount,
          feegranter: getFeegranter(
            chainID,
            MAP_TXN_MSG_TYPES['grant_feegrant']
          ),
        },
      });
    });

    setTxnStarted(true);
    trackTxs(txCreateFeegrantInputs);
  };

  useEffect(() => {
    if (viewAllChains) {
      setDisplayedChains(chainIDs);
    } else {
      setDisplayedChains(chainIDs?.slice(0, 5) || []);
    }
  }, [viewAllChains]);

  const validateForm = () => {
    if (!selectedChains.length) {
      setFormValidationError((prevState) => ({
        ...prevState,
        chains: CHAIN_NOT_SELECTED_ERROR,
      }));
      return false;
    } else if (!selectedMsgs.length && !allTxns) {
      setFormValidationError((prevState) => ({
        ...prevState,
        msgs: MSG_NOT_SELECTED_ERROR,
      }));
      return false;
    }
    setFormValidationError({ chains: '', msgs: '' });
    return true;
  };

  useEffect(() => {
    if (allTxns) {
      setFormValidationError((prevState) => ({
        ...prevState,
        msgs: '',
      }));
      setSelectedMsgs([]);
    }
  }, [allTxns]);

  useEffect(() => {
    if (selectedMsgs.length) {
      setFormValidationError((prevState) => ({
        ...prevState,
        msgs: '',
      }));
    } else if (!allTxns) {
      setFormValidationError((prevState) => ({
        ...prevState,
        msgs: MSG_NOT_SELECTED_ERROR,
      }));
    }
  }, [selectedMsgs]);

  useEffect(() => {
    if (selectedChains.length) {
      setFormValidationError((prevState) => ({
        ...prevState,
        chains: '',
      }));
    }
  }, [selectedChains]);

  /*
   * This function is to close the CreateFeegrant dialog box
   * and to reset all the inputs
   */
  const closeMainDialog = () => {
    setTxnStarted(false);
    resetForm();
    setSelectedChains([]);
    setAllTxns(true);
    setViewAllChains(false);
    setSelectedMsgs([]);
    setFormValidationError({ chains: '', msgs: '' });
    onClose();
  };

  const handleDialogClose = () => {
    if (
      selectedChains?.length ||
      selectedMsgs?.length ||
      getValues('grantee_address')?.length
    ) {
      setConfirmCloseOpen(true);
    } else {
      closeMainDialog();
    }
  };

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
          <div className="px-10 pb-6 pt-10 flex justify-end">
            <div onClick={handleDialogClose}>
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
          <div className="mb-[72px] px-10">
            <div className="space-y-4">
              <h2 className="text-[20px] font-bold">Create Feegrant</h2>
            </div>
            <div className="divider-line"></div>
            <>
              <div>
                <div className="space-y-4">
                  <div className="text-[16px]">Select Networks</div>
                  <div className="networks-list">
                    {displayedChains.map((chainID, index) => (
                      <NetworkItem
                        key={index}
                        chainName={networks[chainID].network.config.chainName}
                        logo={networks[chainID].network.logos.menu}
                        onSelect={handleSelectChain}
                        selected={selectedChains.includes(chainID)}
                        chainID={chainID}
                        disable={false}
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    <button
                      onClick={() => {
                        setViewAllChains((prevState) => !prevState);
                      }}
                      className="text-[14px] leading-[20px] underline underline-offset-2 tracking-[0.56px]"
                    >
                      {viewAllChains ? 'View less' : 'View all'}
                    </button>
                  </div>
                </div>
                <div className="mt-10">
                  {txnStarted ? (
                    <MultiChainTxnStatus
                      selectedMsgs={
                        allTxns ? ['All Transactions'] : selectedMsgs
                      }
                      selectedChains={selectedChains}
                      chainsStatus={chainsStatus}
                    />
                  ) : (
                    <form
                      onSubmit={handleSubmit((e) => onSubmit(e))}
                      id="create-feegrant-form"
                    >
                      <CreateFeegrantForm
                        control={control}
                        errors={errors}
                        isPeriodic={isPeriodic}
                        setIsPeriodic={(value: boolean) => setIsPeriodic(value)}
                        handleSelectMsg={handleSelectMsg}
                        selectedMsgs={selectedMsgs}
                        allTxns={allTxns}
                        setAllTxns={(value: boolean) => setAllTxns(value)}
                        getValues={getValues}
                      />
                    </form>
                  )}
                </div>
                {!txnStarted && (
                  <div className="mt-10 relative h-10">
                    <div className="flex-1 flex items-center justify-center h-10">
                      <div className="error-box">
                        <span
                          className={
                            formValidationError.chains ||
                            formValidationError.msgs
                              ? 'error-chip opacity-80'
                              : 'error-chip opacity-0'
                          }
                        >
                          {formValidationError.chains ||
                            formValidationError.msgs}
                        </span>
                      </div>
                    </div>
                    <button
                      type="submit"
                      form="create-feegrant-form"
                      className="primary-custom-btn w-[186px] absolute right-0 bottom-0"
                    >
                      {currentTxCount !== 0 ? (
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                      ) : (
                        'Create Grant'
                      )}
                    </button>
                  </div>
                )}
              </div>
            </>
          </div>
        </div>
        <ConfirmDialogClose
          open={confirmCloseOpen}
          onClose={() => setConfirmCloseOpen(false)}
          closeMainDialog={closeMainDialog}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateFeegrant;
