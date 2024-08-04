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
import Image from 'next/image';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import Copy from '@/components/common/Copy';
import { shortenAddress, shortenName } from '@/utils/util';

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
  const nameToChainIDs = useAppSelector((state) => state.common.nameToChainIDs);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset: resetForm,
    getValues,
    watch,
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
    <div className="flex h-full overflow-y-scroll my-10 gap-20">
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
      <div className="flex-1 flex flex-col p-6 bg-[#FFFFFF05] rounded-2xl">
        <div className="space-y-6 flex-1">
          <div className="py-2 px-4 rounded-2xl flex items-center gap-6 bg-[#FFFFFF05] h-12">
            <div className="text-[#FFFFFF80] font-light text-[14px]">
              Networks Selected
            </div>
            <div className="flex gap-6 items-center flex-wrap">
              {selectedChains.map((chainName) => {
                const chainID = nameToChainIDs?.[chainName.toLowerCase()];
                const { chainLogo } = getChainInfo(chainID);
                return <NetworkLogo key={chainName} logo={chainLogo} />;
              })}
            </div>
          </div>
          <div className="py-2 px-4 rounded-2xl flex items-center gap-6 bg-[#FFFFFF05] h-12">
            <div className="text-[#FFFFFF80] font-light text-[14px]">
              Grantee Address
            </div>
            <div className="flex items-center gap-2">
              <div className="">
                {shortenAddress(watch('grantee_address'), 20)}
              </div>
              {watch('grantee_address') ? (
                <Copy content={watch('grantee_address')} />
              ) : null}
            </div>
          </div>
          <DisplayNumber value={watch('spend_limit')} name="Spend Limit" />
          {isPeriodic ? (
            <DisplayNumber value={watch('period')} name="Period" />
          ) : null}
          {isPeriodic ? (
            <DisplayNumber
              value={watch('period_spend_limit')}
              name="Period Spend Limit"
            />
          ) : null}
        </div>
        <button
          className="primary-btn"
          disabled={currentTxCount !== 0}
          type="submit"
          form="create-feegrant-form"
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

const NetworkLogo = ({ logo }: { logo: string }) => {
  return (
    <Image className="rounded-full" src={logo} width={24} height={24} alt="" />
  );
};

const DisplayNumber = ({ value, name }: { value: string; name: string }) => {
  const parsedAmount = Number(value);
  return (
    <div className="py-2 px-4 rounded-2xl flex items-center gap-6 bg-[#FFFFFF05] h-12">
      <div className="text-[#FFFFFF80] font-light text-[14px]">{name}</div>
      <div className="flex items-center">
        <div className="text-[14px] font-medium">
          {!isNaN(parsedAmount) && parsedAmount ? parsedAmount : null}
        </div>
      </div>
    </div>
  );
};
