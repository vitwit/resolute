import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import {
  customMUITextFieldStyles,
  dialogBoxPaperPropStyles,
} from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { shortenName } from '@/utils/util';
import {
  Avatar,
  Dialog,
  DialogContent,
  TextField,
  Tooltip,
} from '@mui/material';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { fromBech32 } from '@cosmjs/encoding';
import { authzMsgTypes } from '@/utils/authorizations';
import { FieldValues, useForm } from 'react-hook-form';
import ExpirationField from './ExpirationField';
import SendAuthzForm from './SendAuthzForm';
import StakeAuthzForm from './StakeAuthzForm';

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
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );
  const msgTypes = authzMsgTypes();
  const [step, setStep] = useState(1);
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
  const [viewAllSelectedChains, setViewAllSelectedChains] =
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

  const onNext = () => {
    setDisplayedSelectedChains(selectedChains?.slice(0, 5) || []);
  };

  const onSubmit = (e: FieldValues) => {
    console.log('erer');
    console.log(e);
  };

  const [sendAdvanced, setSendAdvanced] = useState(false);

  const date = new Date();
  const expiration = new Date(date.setTime(date.getTime() + 365 * 86400000));

  const { handleSubmit, control } = useForm({
    defaultValues: {
      grant_authz_expiration: expiration,
      revoke_authz_expiration: expiration,
      grant_feegrant_expiration: expiration,
      revoke_feegrant_expiration: expiration,
      submit_proposal_expiration: expiration,
      vote_expiration: expiration,
      deposit_expiration: expiration,
      withdraw_rewards: expiration,
      withdraw_commision: expiration,
      unjail: expiration,
      send_expiration: expiration,
      send_spend_limit: '',
      delegate_expiration: expiration,
      undelegate_expiration: expiration,
      redelegate_expiration: expiration,
    },
  });

  const renderForm = (msg: string) => {
    const msgType = msg.toLowerCase().replace(' ', '_');
    const genericGrants = [
      'grant_authz',
      'revoke_authz',
      'grant_feegrant',
      'revoke_feegrant',
      'submit_proposal',
      'vote',
      'deposit',
      'withdraw_rewards',
      'withdraw_commision',
      'unjail',
    ];
    const sendGrant = 'send';
    const stakeGrants = ['delegate', 'undelegate', 'redelegate'];
    if (genericGrants.includes(msgType)) {
      return <ExpirationField msg={msgType} control={control} />;
    } else if (msgType === sendGrant) {
      return (
        <SendAuthzForm
          control={control}
          advanced={sendAdvanced}
          toggle={() => setSendAdvanced((prevState) => !prevState)}
        />
      );
    } else if (stakeGrants.includes(msgType)) {
      return <StakeAuthzForm />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white">
          <div className="px-10 pb-6 pt-10 flex justify-end">
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
          <div className="mb-[72px] px-10">
            <div className="space-y-4">
              <h2 className="text-[20px] font-bold">Create Grant</h2>
              <div className="text-[14px]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </div>
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
                        View all
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
                    <div className="py-[6px] mb-2">Grantee Address</div>
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
                  <div className="text-[16px]">
                    You are giving Authz access to
                  </div>
                  <div className="networks-list">
                    {displayedSelectedChains.map((chainID, index) => (
                      <NetworkItem
                        key={index}
                        chainName={networks[chainID].network.config.chainName}
                        logo={networks[chainID].network.logos.menu}
                        onSelect={handleSelectChain}
                        selected={false}
                        chainID={chainID}
                        disable={true}
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    <button
                      onClick={() => {
                        setViewAllSelectedChains((prevState) => !prevState);
                      }}
                      className="text-[14px] leading-[20px] underline underline-offset-2 tracking-[0.56px]"
                    >
                      View all
                    </button>
                  </div>
                </div>
                <form
                  onSubmit={handleSubmit((e) => onSubmit(e))}
                  id="msgs-form"
                >
                  <div className="space-y-6">
                    {selectedMsgs.map((msg) => (
                      <div className="grant-authz-form" key={msg}>
                        <h3>{msg}</h3>
                        <div className="my-2">{renderForm(msg)}</div>
                      </div>
                    ))}
                  </div>
                </form>
              </div>
            )}
            <div className="mt-10 flex gap-10 items-center justify-end">
              {step === STEP_TWO ? (
                <button
                  type="button"
                  className="font-medium tracking-[0.64px] text-[16px] underline underline-offset-[3px]"
                  onClick={() => setStep(STEP_ONE)}
                >
                  Go back
                </button>
              ) : (
                <button
                  className="primary-custom-btn"
                  onClick={() => {
                    onNext();
                    setStep(STEP_TWO);
                  }}
                >
                  Next
                </button>
              )}
              {step === STEP_TWO ? (
                <button
                  type="submit"
                  form="msgs-form"
                  className="primary-custom-btn"
                >
                  Grant
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateAuthzGrant;

const NetworkItem = ({
  chainName,
  logo,
  onSelect,
  selected,
  chainID,
  disable,
}: {
  chainName: string;
  logo: string;
  onSelect: (chainID: string) => void;
  selected: boolean;
  chainID: string;
  disable: boolean;
}) => {
  return (
    <div
      className={
        selected ? 'network-item network-item-selected' : 'network-item'
      }
      onClick={() => {
        if (!disable) {
          onSelect(chainID);
        }
      }}
    >
      <Avatar src={logo} sx={{ width: 32, height: 32 }} />
      <Tooltip title={chainName} placement="bottom">
        <h3 className={`text-[14px] leading-normal opacity-100`}>
          <span>{shortenName(chainName, 6)}</span>
        </h3>
      </Tooltip>
    </div>
  );
};

const MsgItem = ({
  msg,
  onSelect,
  selected,
}: {
  msg: string;
  onSelect: (chainID: string) => void;
  selected: boolean;
}) => {
  return (
    <div
      className={selected ? 'msg-item  primary-gradient' : 'msg-item'}
      onClick={() => onSelect(msg)}
    >
      {msg}
    </div>
  );
};
