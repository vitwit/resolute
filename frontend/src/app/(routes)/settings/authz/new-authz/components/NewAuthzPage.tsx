import React, { ChangeEvent, useEffect, useState } from 'react';
import SelectNetworks from '../../../components/NetworksList';
import { fromBech32 } from '@cosmjs/encoding';
import { convertToSnakeCase, shortenAddress } from '@/utils/util';
import Copy from '@/components/common/Copy';
import SelectedChains from '../../../(general)/components/SelectedChains';
import { PERMISSION_NOT_SELECTED_ERROR } from '@/utils/errors';
import useMultiTxTracker from '@/custom-hooks/useGetMultiChainTxLoading';
import { CircularProgress } from '@mui/material';
import GranteeAddress from './GranteeAddress';
import {
  authzMsgTypes,
  GENRIC_GRANTS,
  grantAuthzFormDefaultValues,
  MAP_TXN_MSG_TYPES,
  STAKE_GRANTS,
} from '@/utils/authorizations';
import MsgItem from '../../../(general)/components/MsgItem';
import { FieldValues, useForm } from 'react-hook-form';
import ExpirationField from './ExpirationField';
import SendAuthzForm from './SendAuthzForm';
import StakeAuthzForm from './StakeAuthzForm';
import useGetGrantAuthzMsgs from '@/custom-hooks/useGetGrantAuthzMsgs';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import useGetFeegranter from '@/custom-hooks/useGetFeegranter';
import Image from 'next/image';
import CustomButton from '@/components/common/CustomButton';
import DialogAuthzTxStatus from './DialogAuthzTxStatus';
import { NO_MESSAGES_ILLUSTRATION } from '@/constants/image-names';

const NewAuthzPage = () => {
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const {
    trackTxs,
    ChainsStatus: chainsStatus,
    currentTxCount,
  } = useMultiTxTracker();
  const { getFeegranter } = useGetFeegranter();
  const msgTypes = authzMsgTypes();

  const [txStatusOpen, setTxStatusOpen] = useState(false);
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [txnStarted, setTxnStarted] = useState(false);
  const [granteeAddress, setGranteeAddress] = useState('');
  const [addressValidationError, setAddressValidationError] = useState('');
  const [formValidationError, setFormValidationError] = useState('');
  const [selectedMsgs, setSelectedMsgs] = useState<string[]>([]);
  /* 
  List of allow/deny validators for StakeAuthorization
  */
  const [selectedDelegateValidators, setSelectedDelegateValidators] = useState<
    string[]
  >([]);
  const [isDenyDelegateList, setIsDenyDelegateList] = useState<boolean>(false);
  const [selectedUndelegateValidators, setSelectedUndelegateValidators] =
    useState<string[]>([]);
  const [isDenyUndelegateList, setIsDenyUndelegateList] =
    useState<boolean>(false);
  const [selectedRedelegateValidators, setSelectedRedelegateValidators] =
    useState<string[]>([]);
  const [isDenyRedelegateList, setIsDenyRedelegateList] =
    useState<boolean>(false);
  const [sendAdvanced, setSendAdvanced] = useState(false);
  const [delegateAdvanced, setDelegateAdvanced] = useState(false);
  const [undelegateAdvanced, setUndelegateAdvanced] = useState(false);
  const [redelegateAdvanced, setRedelegateAdvanced] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<number | null>(null);

  const {
    handleSubmit,
    control,
    formState: { errors: formErrors },
  } = useForm({
    defaultValues: grantAuthzFormDefaultValues(),
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

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGranteeAddress(e.target.value);
    validateAddress(e.target.value);
  };

  const handleSelectMsg = (msgType: string) => {
    if (selectedMsgs.includes(msgType)) {
      resetCustomData(msgType);
    }
    const updatedSelection = selectedMsgs.includes(msgType)
      ? selectedMsgs.filter((id) => id !== msgType)
      : [msgType, ...selectedMsgs];

    setSelectedMsgs(updatedSelection);
    setRecentlyAdded(0);
  };

  useEffect(() => {
    if (recentlyAdded !== null) {
      const timer = setTimeout(() => setRecentlyAdded(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [recentlyAdded]);

  const resetCustomData = (msg: string) => {
    switch (msg) {
      case 'Send':
        setSendAdvanced(false);
        break;
      case 'Delegate':
        setSelectedDelegateValidators([]);
        setDelegateAdvanced(false);
        setIsDenyDelegateList(false);
        break;
      case 'Undelegate':
        setSelectedUndelegateValidators([]);
        setUndelegateAdvanced(false);
        setIsDenyUndelegateList(false);
        break;
      case 'Redelegate':
        setSelectedRedelegateValidators([]);
        setRedelegateAdvanced(false);
        setIsDenyRedelegateList(false);
        break;
      default:
        break;
    }
  };

  const handleRemoveMsg = (index: number, msg: string) => {
    resetCustomData(msg);
    const arr = selectedMsgs.filter((_, i) => i !== index);
    setSelectedMsgs(arr);
  };

  const validateAddress = (address: string) => {
    if (!address.length) {
      setAddressValidationError('Please enter grantee address');
      return false;
    }
    try {
      fromBech32(address);
      setAddressValidationError('');
      return true;
    } catch (error) {
      setAddressValidationError('Invalid grantee address');
      return false;
    }
  };

  const validateForm = () => {
    if (!selectedChains.length) {
      setFormValidationError('Atleast one chain must be selected');
      return false;
    }
    if (!validateAddress(granteeAddress)) {
      setFormValidationError('');
      return false;
    }
    if (!selectedMsgs.length) {
      setFormValidationError(PERMISSION_NOT_SELECTED_ERROR);
      return false;
    }
    setFormValidationError('');
    return true;
  };

  const { getGrantAuthzMsgs } = useGetGrantAuthzMsgs();

  const onSubmit = (e: FieldValues) => {
    if (!validateForm()) {
      return;
    }
    const fieldValues = e;
    fieldValues['delegate'] = {
      expiration: fieldValues['delegate'].expiration,
      max_tokens: fieldValues['delegate'].max_tokens,
      isDenyList: isDenyDelegateList,
      validators_list: selectedDelegateValidators,
    };
    fieldValues['undelegate'] = {
      expiration: fieldValues['undelegate'].expiration,
      max_tokens: fieldValues['undelegate'].max_tokens,
      isDenyList: isDenyUndelegateList,
      validators_list: selectedUndelegateValidators,
    };
    fieldValues['redelegate'] = {
      expiration: fieldValues['redelegate'].expiration,
      max_tokens: fieldValues['redelegate'].max_tokens,
      isDenyList: isDenyRedelegateList,
      validators_list: selectedRedelegateValidators,
    };
    const msgsList: string[] = selectedMsgs.reduce((list: string[], msg) => {
      list.push(convertToSnakeCase(msg));
      return list;
    }, []);
    const grantsList: Grant[] = [];
    msgsList.forEach((msg) => {
      grantsList.push({ msg: msg, ...fieldValues[msg] });
    });

    /* 
     getGrantAuthzMsgs returns the all messages chainwise 
    */
    const { chainWiseGrants } = getGrantAuthzMsgs({
      grantsList,
      selectedChains,
      granteeAddress,
    });
    const txCreateAuthzInputs: MultiChainTx[] = [];
    chainWiseGrants.forEach((chain) => {
      const chainID = chain.chainID;
      const msgs = chain.msgs;
      const basicChainInfo = getChainInfo(chainID);
      const { minimalDenom, decimals } = getDenomInfo(chainID);
      const { feeAmount: avgFeeAmount } = basicChainInfo;
      const feeAmount = avgFeeAmount * 10 ** decimals;

      txCreateAuthzInputs.push({
        ChainID: chainID,
        txInputs: {
          basicChainInfo: basicChainInfo,
          msgs: msgs,
          denom: minimalDenom,
          feeAmount: feeAmount,
          feegranter: getFeegranter(chainID, MAP_TXN_MSG_TYPES['grant_authz']),
        },
      });
    });
    setTxnStarted(true);
    setTxStatusOpen(true);
    trackTxs(txCreateAuthzInputs);
  };

  const renderForm = (msg: string) => {
    const msgType = convertToSnakeCase(msg);
    const sendGrant = 'send';
    if (GENRIC_GRANTS.includes(msgType)) {
      return (
        <div className="space-y-2">
          <div className="text-[12px] text-[#ffffff80] font-light">
            Set Expiry
          </div>
          <ExpirationField msg={msgType} control={control} />
        </div>
      );
    } else if (msgType === sendGrant) {
      return (
        <SendAuthzForm
          control={control}
          advanced={sendAdvanced}
          formError={formErrors.send?.spend_limit?.message || ''}
          toggle={() => setSendAdvanced((prevState) => !prevState)}
        />
      );
    } else if (STAKE_GRANTS.includes(msgType)) {
      switch (msgType) {
        case 'delegate':
          return (
            <StakeAuthzForm
              control={control}
              advanced={delegateAdvanced}
              msg={msgType}
              selectedChains={selectedChains}
              maxTokensError={formErrors.delegate?.max_tokens?.message || ''}
              setSelectedValidators={setSelectedDelegateValidators}
              isDenyList={isDenyDelegateList}
              setIsDenyList={setIsDenyDelegateList}
              toggle={() => setDelegateAdvanced((prevState) => !prevState)}
            />
          );
        case 'undelegate':
          return (
            <StakeAuthzForm
              control={control}
              advanced={undelegateAdvanced}
              msg={msgType}
              selectedChains={selectedChains}
              maxTokensError={formErrors.undelegate?.max_tokens?.message || ''}
              setSelectedValidators={setSelectedUndelegateValidators}
              isDenyList={isDenyUndelegateList}
              setIsDenyList={setIsDenyUndelegateList}
              toggle={() => setUndelegateAdvanced((prevState) => !prevState)}
            />
          );
        case 'redelegate':
          return (
            <StakeAuthzForm
              control={control}
              advanced={redelegateAdvanced}
              msg={msgType}
              selectedChains={selectedChains}
              maxTokensError={formErrors.redelegate?.max_tokens?.message || ''}
              setSelectedValidators={setSelectedRedelegateValidators}
              isDenyList={isDenyRedelegateList}
              setIsDenyList={setIsDenyRedelegateList}
              toggle={() => setRedelegateAdvanced((prevState) => !prevState)}
            />
          );
      }
    }
  };

  useEffect(() => {
    if (currentTxCount === 0) {
      setTxnStarted(false);
    }
  }, [currentTxCount]);

  return (
    <div className="flex h-full my-10 gap-20">
      <div className="space-y-6 w-[40%]">
        <GranteeAddress
          handleChange={handleAddressChange}
          value={granteeAddress}
        />
        <SelectNetworks
          selectedNetworks={selectedChains}
          handleSelectChain={handleSelectChain}
        />
        <div className="space-y-2">
          <div className="py-[6px] mt-10 mb-2 flex justify-between">
            <div className="text-[#FFFFFF80] text-[14px] font-light">
              Select Permissions
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {msgTypes.map((msg, index) => (
              <MsgItem
                key={index}
                msg={msg.txn}
                onSelect={handleSelectMsg}
                selected={selectedMsgs.includes(msg.txn)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 h-full flex flex-col p-6 bg-[#FFFFFF05] rounded-2xl min-h-[72vh]">
        <div className="space-y-6 flex-1">
          <SelectedChains selectedChains={selectedChains} />
          <div className="py-2 px-4 rounded-2xl flex items-center gap-6 bg-[#FFFFFF05] h-12">
            <div className="text-[#FFFFFF80] font-light text-[14px] w-[124px]">
              Grantee Address
            </div>
            <div className="flex items-center gap-2">
              <div className="">{shortenAddress(granteeAddress, 20)}</div>
              {granteeAddress ? <Copy content={granteeAddress} /> : null}
            </div>
          </div>
          <form
            onSubmit={handleSubmit((e) => onSubmit(e))}
            id="create-authz-form"
          >
            <div className="text-[14px] mb-4 text-[#ffffff80]">Permissions</div>
            {selectedMsgs?.length ? (
              <div className="space-y-6">
                {selectedMsgs.map((msg, index) => (
                  <div
                    className={`bg-[#FFFFFF05] p-6 rounded-2xl space-y-6 ${
                      recentlyAdded === index ? 'pop-in' : ''
                    }`}
                    key={msg}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-[14px]">{msg}</div>
                        <button
                          className="rounded-full p-[2px] hover:bg-[#ffffff10]"
                          onClick={() => handleRemoveMsg(index, msg)}
                          type="button"
                        >
                          <Image
                            src="/close.svg"
                            width={18}
                            height={18}
                            alt="Remove"
                          />
                        </button>
                      </div>
                      <div className="divider-line"></div>
                    </div>
                    <div className="my-2">{renderForm(msg)}</div>
                  </div>
                ))}
                <div className="space-y-6 w-full">
                  <div
                    className={`py-2 px-4 rounded-2xl flex items-center gap-6 bg-[#FFFFFF05] h-12 text-[#d92101f7] text-[14px] ${
                      addressValidationError || formValidationError
                        ? 'opacity-80'
                        : 'opacity-0'
                    }`}
                  >
                    {addressValidationError || formValidationError}
                  </div>
                  {selectedMsgs?.length ? (
                    <button
                      className="primary-btn w-full"
                      disabled={currentTxCount !== 0}
                      type="submit"
                      form="create-authz-form"
                    >
                      {currentTxCount !== 0 ? (
                        <div className="flex justify-center items-center gap-2">
                          <CircularProgress size={12} sx={{ color: 'white' }} />
                          <span className="italic">
                            Pending<span className="dots-flashing"></span>{' '}
                          </span>
                        </div>
                      ) : (
                        'Create Authz'
                      )}
                    </button>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="my-[15%] flex-1 flex flex-col items-center justify-center opacity-70">
                <Image
                  src={NO_MESSAGES_ILLUSTRATION}
                  height={130}
                  width={195}
                  alt="No Messages"
                />
                <div className="text-b1 font-light">
                  Select a permissions from the left side to add here
                </div>
              </div>
            )}
          </form>
        </div>
        {selectedMsgs?.length ? null : (
          <CustomButton
            btnText="Create Authz"
            btnDisabled={true}
            btnStyles="opacity-80"
          />
        )}
      </div>
      <DialogAuthzTxStatus
        open={txStatusOpen}
        onClose={() => {
          setTxStatusOpen(false);
          setTxnStarted(false);
        }}
        chainsStatus={chainsStatus}
        selectedChains={selectedChains}
        selectedMsgs={selectedMsgs}
        granteeAddress={granteeAddress}
      />
    </div>
  );
};

export default NewAuthzPage;
