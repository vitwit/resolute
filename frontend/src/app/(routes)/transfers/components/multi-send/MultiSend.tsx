import React, { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CustomSubmitButton from '@/components/CustomButton';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { multiTxns } from '@/store/features/bank/bankSlice';
import { TxStatus } from '@/types/enums';
import {
  setChangeNetworkDialogOpen,
  setError,
} from '@/store/features/common/commonSlice';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { Box, TextField } from '@mui/material';
import { ALL_NETWORKS_ICON, MULTISEND_PLACEHOLDER } from '@/utils/constants';
import Image from 'next/image';
import { shortenName } from '@/utils/util';
import { multiSendInputFieldStyles } from '../../styles';
import { parseSendMsgsFromContent } from '@/utils/parseMsgs';
import Messages from '../Messages';

const MultiSend = ({ chainID }: { chainID: string }) => {
  const dispatch = useAppDispatch();
  const { getChainInfo, getDenomInfo } = useGetChainInfo();

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [chainLogo, setChainLogo] = useState(ALL_NETWORKS_ICON);
  const [chainGradient, setChainGradient] = useState('');

  const txPendingStatus = useAppSelector((state) => state.bank.tx.status);
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const selectedNetwork = useAppSelector(
    (state) => state.common.selectedNetwork
  );
  const allNetworks = useAppSelector((state) => state.common.allNetworksInfo);
  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);

  useEffect(() => {
    if (txPendingStatus === TxStatus.IDLE) {
      setMsgs([]);
    }
  }, [txPendingStatus]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      memo: '',
    },
  });

  const addMsgs = (msgs: Msg[]) => {
    setMsgs(msgs);
  };

  const onDelete = (index: number) => {
    setMsgs((msgs) => {
      return [...msgs.slice(0, index), ...msgs.slice(index + 1, msgs.length)];
    });
  };

  const onDeleteAll = () => {
    setMsgs([]);
  };

  const onSubmit = (data: { memo: string }) => {
    if (txPendingStatus === TxStatus.PENDING) {
      dispatch(
        setError({
          type: 'error',
          message: 'A transaction is still pending..',
        })
      );
      return;
    }
    if (msgs.length === 0) {
      dispatch(
        setError({
          type: 'error',
          message: 'No transactions found',
        })
      );

      return;
    }
    const denomInfo = getDenomInfo(chainID);
    const txnInputs: MultiTxnsInputs = {
      basicChainInfo: getChainInfo(chainID),
      msgs,
      memo: data.memo,
      denom: denomInfo.minimalDenom,
      feegranter: '',
    };
    dispatch(multiTxns(txnInputs));
  };

  const changeNetwork = () => {
    dispatch(setChangeNetworkDialogOpen({ open: true, showSearch: false }));
  };

  useEffect(() => {
    if (selectedNetwork.chainName && isWalletConnected) {
      const chainID = nameToChainIDs[selectedNetwork.chainName];
      setChainLogo(allNetworks[chainID].logos.menu);
      setChainGradient(allNetworks[chainID].config.theme.gradient);
    } else {
      setChainLogo(ALL_NETWORKS_ICON);
    }
  }, [selectedNetwork, isWalletConnected]);

  return (
    <div>
      <div className="single-send-box w-[550px]">
        <Box
          sx={{
            background:
              chainGradient ||
              'linear-gradient(180deg, #7A7E9C 0.5%, #09090A 100%)',
          }}
          className="select-network"
        >
          <div
            onClick={() => changeNetwork()}
            className="flex items-center gap-2 cursor-pointer w-fit"
          >
            <Image src={chainLogo} height={40} width={40} alt="" />
            <div className="text-[20px] font-bold capitalize">
              {shortenName(selectedNetwork.chainName, 15) || 'All Networks'}
            </div>
            <Image src="/drop-down-icon.svg" height={24} width={24} alt="" />
          </div>
        </Box>
        <div className="py-10 px-6 space-y-10">
          <form
            className={`${msgs.length ? 'space-y-6' : 'space-y-10'}`}
            onSubmit={handleSubmit(onSubmit)}
          >
            <AddMessages addMsgs={addMsgs} chainID={chainID} msgs={msgs} />
            {msgs?.length ? (
              <div className="space-y-10">
                <AmountSummary />
                <Messages
                  msgs={msgs}
                  onDelete={onDelete}
                  onDeleteAll={onDeleteAll}
                />
              </div>
            ) : null}
            <CustomSubmitButton
              pendingStatus={txPendingStatus === TxStatus.PENDING}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default MultiSend;

const AmountSummary = () => {
  return (
    <div className="px-6 py-4 bg-[#FFFFFF05] text-[14px] text-[#FFFFFF80] rounded-2xl w-full text-center space-x-2">
      <span>You are sending</span>
      <span className="font-bold text-white text-[16px]">50 AKT</span>
      <span>to</span>
      <span className="font-bold text-white text-[16px]">10 Addresses</span>
    </div>
  );
};

const AddMessages = ({
  chainID,
  addMsgs,
  msgs,
}: {
  chainID: string;
  addMsgs: (msgs: Msg[]) => void;
  msgs: Msg[];
}) => {
  const dispatch = useAppDispatch();
  const address = useAppSelector(
    (state) => state.wallet.networks[chainID].walletInfo.bech32Address
  );
  const [inputs, setInputs] = useState('');
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputs(e.target.value);
  };

  const onFileContents = (content: string | ArrayBuffer | null) => {
    const [parsedTxns, error] = parseSendMsgsFromContent(
      address,
      '\n' + content
    );
    if (error) {
      dispatch(
        setError({
          type: 'error',
          message: error,
        })
      );
    } else {
      addMsgs(parsedTxns);
    }
  };

  const addInputs = () => {
    const [parsedTxns, error] = parseSendMsgsFromContent(
      address,
      '\n' + inputs
    );
    if (error) {
      dispatch(
        setError({
          type: 'error',
          message: error,
        })
      );
    } else {
      addMsgs(parsedTxns);
      if (parsedTxns?.length) {
        setInputs('');
      } else {
        dispatch(
          setError({
            type: 'error',
            message: 'Invalid input',
          })
        );
      }
    }
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="relative">
          <TextField
            multiline
            fullWidth
            className="text-white"
            onChange={handleInputChange}
            value={inputs}
            spellCheck={false}
            rows={msgs.length ? 2 : 15}
            sx={{
              ...multiSendInputFieldStyles,
              ...{ height: msgs.length ? '90px' : '392px' },
            }}
            placeholder={MULTISEND_PLACEHOLDER}
            autoFocus={true}
          />
          <button
            onClick={() => addInputs()}
            type="button"
            className="primary-btn !px-6 absolute top-4 right-4 z-100"
          >
            Add
          </button>
        </div>
        <div>
          <div
            className="upload-box"
            onClick={() => {
              const element = document.getElementById('multiTxns_file');
              if (element) element.click();
            }}
          >
            <div className="flex gap-1 items-center">
              <Image
                src="/icons/upload-icon.svg"
                height={24}
                width={24}
                alt=""
              />
              <div className="text-[14px]">Upload CSV here</div>
            </div>
            <div className="flex items-center gap-1">
              <div className="secondary-text">Download Sample</div>
              <div className="text-[14px] underline underline-offset-[3px] font-bold">
                here
              </div>
            </div>
            <input
              id="multiTxns_file"
              accept=".csv"
              hidden
              type="file"
              onChange={(e) => {
                if (!e?.target?.files) return;
                const file = e.target.files[0];
                if (!file) {
                  return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                  if (!e.target) return null;
                  const contents = e.target.result;
                  onFileContents(contents);
                };
                reader.onerror = (e) => {
                  dispatch(
                    setError({
                      type: 'error',
                      message:
                        '' + (e.target?.error || 'Something went wrong. '),
                    })
                  );
                };
                reader.readAsText(file);
                e.target.value = '';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
