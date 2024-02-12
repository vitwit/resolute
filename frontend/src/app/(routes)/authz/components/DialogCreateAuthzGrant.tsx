import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import {
  customMUITextFieldStyles,
  dialogBoxPaperPropStyles,
} from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { convertToSnakeCase, shortenAddress } from '@/utils/util';
import {
  CircularProgress,
  Dialog,
  DialogContent,
  TextField,
} from '@mui/material';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { fromBech32 } from '@cosmjs/encoding';
import {
  GENRIC_GRANTS,
  STAKE_GRANTS,
  authzMsgTypes,
  grantAuthzFormDefaultValues,
} from '@/utils/authorizations';
import { FieldValues, useForm } from 'react-hook-form';
import ExpirationField from './ExpirationField';
import SendAuthzForm from './SendAuthzForm';
import StakeAuthzForm from './StakeAuthzForm';
import useGetGrantAuthzMsgs from '@/custom-hooks/useGetGrantAuthzMsgs';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import CommonCopy from '@/components/CommonCopy';
import useMultiTxTracker from '@/custom-hooks/useGetMultiChainTxLoading';
import MultiChainTxnStatus from './MultiChainTxnStatus';
import ConfirmDialogClose from './ConfirmDialogClose';
import MsgItem from './MsgItem';
import NetworkItem from './NetworkItem';
import useGetFeegranter from '@/custom-hooks/useGetFeegranter';
import { MAP_TXN_MSG_TYPES } from '@/utils/feegrant';
import { PERMISSION_NOT_SELECTED_ERROR } from '@/utils/errors';

interface DialogCreateAuthzGrantProps {
  open: boolean;
  onClose: () => void;
}

const STEP_ONE = 1;
const STEP_TWO = 2;

const DialogCreateAuthzGrant: React.FC<DialogCreateAuthzGrantProps> = (
  props
) => {
  const { open, onClose } = props;
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const { trackTxs, ChainsStatus, currentTxCount } = useMultiTxTracker();
  const { getFeegranter } = useGetFeegranter();
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );
  const msgTypes = authzMsgTypes();

  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const [step, setStep] = useState(STEP_ONE);
  const [txnStarted, setTxnStarted] = useState(false);
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [displayedChains, setDisplayedChains] = useState<string[]>(
    chainIDs?.slice(0, 5) || []
  );
  const [viewAllChains, setViewAllChains] = useState<boolean>(false);
  const [granteeAddress, setGranteeAddress] = useState('');
  const [addressValidationError, setAddressValidationError] = useState('');

  const [selectedMsgs, setSelectedMsgs] = useState<string[]>([]);
  const [displayedSelectedChains, setDisplayedSelectedChains] = useState<
    string[]
  >(chainIDs?.slice(0, 5) || []);
  const [formValidationError, setFormValidationError] = useState('');
  const [viewAllSelectedChains, setViewAllSelectedChains] =
    useState<boolean>(false);

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

  const handleSelectChain = (chainID: string) => {
    const updatedSelection = selectedChains.includes(chainID)
      ? selectedChains.filter((id) => id !== chainID)
      : [...selectedChains, chainID];

    setSelectedChains(updatedSelection);
  };

  const handleSelectMsg = (msgType: string) => {
    const updatedSelection = selectedMsgs.includes(msgType)
      ? selectedMsgs.filter((id) => id !== msgType)
      : [...selectedMsgs, msgType];

    setSelectedMsgs(updatedSelection);
  };

  const handleAddressChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setGranteeAddress(e.target.value);
    validateAddress(e.target.value);
  };

  const validateAddress = (address: string) => {
    if (address.length) {
      try {
        fromBech32(address);
        setAddressValidationError('');
        return true;
      } catch (error) {
        setAddressValidationError('Invalid grantee address');
        return false;
      }
    } else {
      setAddressValidationError('Please enter address');
      return false;
    }
  };

  useEffect(() => {
    if (viewAllChains) {
      setDisplayedChains(chainIDs);
    } else {
      setDisplayedChains(chainIDs?.slice(0, 5) || []);
    }
  }, [viewAllChains]);

  useEffect(() => {
    if (viewAllSelectedChains) {
      setDisplayedSelectedChains(selectedChains);
    } else {
      setDisplayedSelectedChains(selectedChains?.slice(0, 5) || []);
    }
  }, [viewAllSelectedChains]);

  const validateForm = () => {
    if (!selectedChains.length) {
      setFormValidationError('Atleast one chain must be selected');
      return false;
    } else if (!validateAddress(granteeAddress)) {
      setFormValidationError('');
      return false;
    } else if (!selectedMsgs.length) {
      setFormValidationError(PERMISSION_NOT_SELECTED_ERROR);
      return false;
    }
    setFormValidationError('');
    return true;
  };

  const resetStakeForm = () => {
    setSelectedDelegateValidators([]);
    setSelectedUndelegateValidators([]);
    setSelectedRedelegateValidators([]);
    setIsDenyDelegateList(false);
    setIsDenyUndelegateList(false);
    setIsDenyRedelegateList(false);
    setDelegateAdvanced(false);
    setUndelegateAdvanced(false);
    setRedelegateAdvanced(false);
  };

  const onNext = () => {
    setDisplayedSelectedChains(selectedChains?.slice(0, 5) || []);
    if (selectedChains.length > 1) {
      resetStakeForm();
    }
    if (validateForm()) {
      setStep(STEP_TWO);
    }
  };

  const { getGrantAuthzMsgs } = useGetGrantAuthzMsgs();

  const onSubmit = (e: FieldValues) => {
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
    trackTxs(txCreateAuthzInputs);
  };

  const [sendAdvanced, setSendAdvanced] = useState(false);
  const [delegateAdvanced, setDelegateAdvanced] = useState(false);
  const [undelegateAdvanced, setUndelegateAdvanced] = useState(false);
  const [redelegateAdvanced, setRedelegateAdvanced] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors: formErrors },
    reset: resetTxnMsgForms,
  } = useForm({
    defaultValues: grantAuthzFormDefaultValues(),
  });

  const renderForm = (msg: string) => {
    const msgType = convertToSnakeCase(msg);
    const sendGrant = 'send';
    if (GENRIC_GRANTS.includes(msgType)) {
      return <ExpirationField msg={msgType} control={control} />;
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
              selectedValidators={selectedDelegateValidators}
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
              selectedValidators={selectedUndelegateValidators}
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
              selectedValidators={selectedRedelegateValidators}
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
    resetStakeForm();
  }, [selectedChains]);

  /*
    This function is to close the createAuthzGrant dialog box 
    and to reset all the inputs
  */
  const closeMainDialog = () => {
    resetStakeForm();
    setTxnStarted(false);
    setSelectedChains([]);
    setViewAllChains(false);
    setViewAllSelectedChains(false);
    setSelectedMsgs([]);
    setSendAdvanced(false);
    setAddressValidationError('');
    setFormValidationError('');
    setGranteeAddress('');
    resetTxnMsgForms();
    setStep(STEP_ONE);
    onClose();
  };

  const handleDialogClose = () => {
    setConfirmCloseOpen(true);
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
              <h2 className="text-[20px] font-bold">
                Create Grant : Step {step}
              </h2>
              {/* TODO: Change the below text content  */}
              {/* <div className="text-[14px]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </div> */}
            </div>
            <div className="divider-line"></div>
            {step === STEP_ONE ? (
              <>
                <div>
                  <div className="space-y-4">
                    <div className="text-[16px]">
                      You are giving Authz access to
                    </div>
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
                  <div className="mt-10 mb-3">
                    <div className="py-[6px] mb-2">Grantee Address</div>
                    <TextField
                      className="bg-[#FFFFFF0D] rounded-2xl w-full"
                      name="granteeAddress"
                      value={granteeAddress}
                      onChange={handleAddressChange}
                      required
                      placeholder="Enter Grantee Address Here"
                      InputProps={{
                        sx: {
                          input: {
                            color: 'white',
                            fontSize: '14px',
                            padding: 2,
                          },
                        },
                      }}
                      sx={customMUITextFieldStyles}
                    />
                    <div className="error-box">
                      <span
                        className={
                          addressValidationError
                            ? 'error-chip opacity-80'
                            : 'error-chip opacity-0'
                        }
                      >
                        {addressValidationError}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="py-[6px] mb-2">Add Permissions</div>
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
              </>
            ) : (
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="text-[16px] flex gap-2 items-center">
                    <span>You are giving Authz access to</span>
                    <CommonCopy
                      message={shortenAddress(granteeAddress, 40)}
                      style="h-8 truncate"
                      plainIcon={true}
                    />
                    <span>on below networks</span>
                  </div>
                  <div className="networks-list">
                    {displayedSelectedChains.map((chainID, index) => (
                      <NetworkItem
                        key={index}
                        chainName={networks[chainID]?.network?.config.chainName}
                        logo={networks[chainID]?.network?.logos.menu}
                        onSelect={handleSelectChain}
                        selected={false}
                        chainID={chainID}
                        disable={true}
                      />
                    ))}
                  </div>
                  {selectedChains.length > 5 && (
                    <div className="text-center">
                      <button
                        onClick={() => {
                          setViewAllSelectedChains((prevState) => !prevState);
                        }}
                        className="text-[14px] leading-[20px] underline underline-offset-2 tracking-[0.56px]"
                      >
                        {viewAllSelectedChains ? 'View less' : 'View all'}
                      </button>
                    </div>
                  )}
                </div>
                {txnStarted ? (
                  <MultiChainTxnStatus
                    selectedMsgs={selectedMsgs}
                    selectedChains={selectedChains}
                    chainsStatus={ChainsStatus}
                  />
                ) : (
                  <form
                    onSubmit={handleSubmit((e) => onSubmit(e))}
                    id="msgs-form"
                  >
                    <div className="font-medium py-[6px] mb-4">Permissions</div>
                    <div className="space-y-6">
                      {selectedMsgs.map((msg) => (
                        <div className="grant-authz-form" key={msg}>
                          <h3 className="py-[6px]">{msg}</h3>
                          <div className="my-2">{renderForm(msg)}</div>
                        </div>
                      ))}
                    </div>
                  </form>
                )}
              </div>
            )}

            {step === STEP_ONE ? (
              <div className="mt-10 relative h-10">
                <div className="flex-1 flex items-center justify-center h-10">
                  <div className="error-box">
                    <span
                      className={
                        formValidationError
                          ? 'error-chip opacity-80'
                          : 'error-chip opacity-0'
                      }
                    >
                      {formValidationError}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="primary-custom-btn absolute right-0 bottom-0"
                  onClick={() => {
                    onNext();
                  }}
                >
                  Next
                </button>
              </div>
            ) : null}
            {step === STEP_TWO && !txnStarted ? (
              <div className="mt-10 flex gap-10 items-center justify-end">
                {currentTxCount === 0 ? (
                  <button
                    type="button"
                    className="font-medium tracking-[0.64px] text-[16px] underline underline-offset-[3px]"
                    onClick={() => setStep(STEP_ONE)}
                  >
                    Go back
                  </button>
                ) : null}
                <button
                  type="submit"
                  form="msgs-form"
                  className="primary-custom-btn w-[124px]"
                >
                  {currentTxCount !== 0 ? (
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                  ) : (
                    'Grant'
                  )}
                </button>
              </div>
            ) : null}
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

export default DialogCreateAuthzGrant;
