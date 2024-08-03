import React, { useState } from 'react';
import SelectNetworks from '../../../components/NetworksList';
import useGetFeegrantMsgs from '@/custom-hooks/useGetFeegrantMsgs';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { FieldValues, useForm } from 'react-hook-form';
import {
  getFeegrantFormDefaultValues,
  MAP_TXN_MSG_TYPES,
} from '@/utils/feegrant';
import useGetFeegranter from '@/custom-hooks/useGetFeegranter';
import CreateFeegrantForm from './CreateFeegrantForm';
import {
  CHAIN_NOT_SELECTED_ERROR,
  MSG_NOT_SELECTED_ERROR,
} from '@/utils/errors';
import useMultiTxTracker from '@/custom-hooks/useGetCreateFeegrantTxLoading';
import CustomButton from '@/components/common/CustomButton';
import { CircularProgress } from '@mui/material';

const NewFeegrantPage = () => {
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [isPeriodic, setIsPeriodic] = useState<boolean>(false);
  const [selectedMsgs, setSelectedMsgs] = useState<string[]>([]);
  const [allTxns, setAllTxns] = useState<boolean>(true);
  const [txnStarted, setTxnStarted] = useState(false);
  const [formValidationError, setFormValidationError] = useState({
    chains: '',
    msgs: '',
  });

  const { getFeegrantMsgs } = useGetFeegrantMsgs();
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const { getFeegranter } = useGetFeegranter();
  const { trackTxs, chainsStatus, currentTxCount } = useMultiTxTracker();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset: resetForm,
    getValues,
  } = useForm({
    defaultValues: getFeegrantFormDefaultValues(),
  });

  const handleSelectChain = (chainName: string) => {
    if (txnStarted) {
      return;
    }
    const updatedSelection = selectedChains.includes(chainName)
      ? selectedChains.filter((id) => id !== chainName)
      : [...selectedChains, chainName];
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
          feegranter: '',
        },
      });
    });

    setTxnStarted(true);
    trackTxs(txCreateFeegrantInputs);
  };

  return (
    <div className="flex h-full overflow-y-scroll mt-10 gap-20">
      <div className="space-y-6 overflow-y-scroll w-[40%] max-h-[70vh]">
        <SelectNetworks
          selectedNetworks={selectedChains}
          handleSelectChain={handleSelectChain}
        />
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
      </div>
      <div className="flex-1">
        <div>
          <div>Selected</div>
          <div>{JSON.stringify(selectedChains)}</div>
        </div>
        <div>
          <div>Grantee</div>
          <div>{getValues('grantee_address')}</div>
        </div>
        <div>
          <div>Spend Limit</div>
          <div>{getValues('spend_limit')}</div>
        </div>
        <button
          className="primary-btn"
          disabled={currentTxCount !== 0}
          type="submit"
        >
          {currentTxCount !== 0 ? (
            <div className="flex justify-center items-center gap-2">
              <CircularProgress size={12} sx={{ color: 'white' }} />
              <span className="italic">
                Pending<span className="dots-flashing"></span>{' '}
              </span>
            </div>
          ) : (
            'Create Feegrant'
          )}
        </button>
      </div>
    </div>
  );
};

export default NewFeegrantPage;
