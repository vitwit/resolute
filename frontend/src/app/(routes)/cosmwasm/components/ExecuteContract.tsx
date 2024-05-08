import useContracts from '@/custom-hooks/useContracts';
import { CircularProgress, SelectChangeEvent, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AttachFunds from './AttachFunds';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { TxStatus } from '@/types/enums';
import { executeContract } from '@/store/features/cosmwasm/cosmwasmSlice';
import { getFormattedFundsList } from '@/utils/util';
import { queryInputStyles } from '../styles';
import { setError } from '@/store/features/common/commonSlice';

interface ExecuteContractI {
  address: string;
  baseURLs: string[];
  chainID: string;
  rpcURLs: string[];
  walletAddress: string;
  chainName: string;
}

const ExecuteContract = (props: ExecuteContractI) => {
  const { address, baseURLs, chainID, rpcURLs, walletAddress, chainName } =
    props;

  // ------------------------------------------//
  // ---------------DEPENDENCIES---------------//
  // ------------------------------------------//
  const dispatch = useAppDispatch();
  const {
    getExecutionOutput,
    getExecuteMessages,
    executeMessagesError,
    executeMessagesLoading,
  } = useContracts();
  const { getDenomInfo } = useGetChainInfo();
  const { decimals, minimalDenom } = getDenomInfo(chainID);

  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const [executeInput, setExecuteInput] = useState('');
  const [attachFundType, setAttachFundType] = useState('no-funds');
  const [funds, setFunds] = useState<FundInfo[]>([
    {
      amount: '',
      denom: minimalDenom,
      decimals: decimals,
    },
  ]);
  const [fundsInput, setFundsInput] = useState('');
  const [executeMessages, setExecuteMessages] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState('');

  const txExecuteLoading = useAppSelector(
    (state) => state.cosmwasm.chains?.[chainID].txExecute.status
  );

  // ------------------------------------------------//
  // -----------------CHANGE HANDLERS----------------//
  // ------------------------------------------------//
  const handleQueryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setExecuteInput(e.target.value);
  };

  const handleAttachFundTypeChange = (event: SelectChangeEvent<string>) => {
    setAttachFundType(event.target.value);
  };

  const handleSelectMessage = async (msg: string) => {
    setExecuteInput(`{\n\t"${msg}": {}\n}`);
    setSelectedMessage(msg);
  };

  // ----------------------------------------------------//
  // -----------------CUSTOM VALIDATIONS-----------------//
  // ----------------------------------------------------//
  const validateJSONInput = (
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    errorMessagePrefix: string
  ): boolean => {
    try {
      if (!input?.length) {
        dispatch(
          setError({
            type: 'error',
            message: `Please enter ${errorMessagePrefix}`,
          })
        );
        return false;
      }
      const parsed = JSON.parse(input);
      const formattedJSON = JSON.stringify(parsed, undefined, 4);
      setInput(formattedJSON);
      return true;
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      dispatch(
        setError({
          type: 'error',
          message: `Invalid JSON input: (${errorMessagePrefix}) ${error?.message || ''}`,
        })
      );
      return false;
    }
  };

  const formatExecutionMessage = () => {
    return validateJSONInput(
      executeInput,
      setExecuteInput,
      'Execution Message'
    );
  };

  const validateFunds = () => {
    return validateJSONInput(fundsInput, setFundsInput, 'Attach Funds List');
  };

  // ------------------------------------------//
  // ---------------TRANSACTION----------------//
  // ------------------------------------------//
  const onExecute = async () => {
    if (!formatExecutionMessage()) return;
    if (attachFundType === 'json' && !validateFunds()) return;

    const attachedFunds = getFormattedFundsList(
      funds,
      fundsInput,
      attachFundType
    );

    dispatch(
      executeContract({
        chainID,
        contractAddress: address,
        msgs: executeInput,
        rpcURLs,
        walletAddress,
        funds: attachedFunds,
        baseURLs,
        getExecutionOutput,
      })
    );
  };

  useEffect(() => {
    getExecuteMessages({ chainID, contractAddress: address, rpcURLs });
  }, [chainID]);

  // ------------------------------------------//
  // ---------------SIDE EFFECT----------------//
  // ------------------------------------------//
  useEffect(() => {
    const fetchMessages = async () => {
      const { messages } = await getExecuteMessages({
        chainID,
        contractAddress: address,
        rpcURLs,
      });
      setExecuteMessages(messages);
    };
    fetchMessages();
  }, [address]);

  return (
    <div className="flex gap-10">
      <div className="execute-field-wrapper">
        <div className="space-y-4">
          <div className="font-light">
            Suggested Messages:
            {executeMessagesLoading ? (
              <span className="italic ">
                Fetching messages<span className="dots-flashing"></span>{' '}
              </span>
            ) : executeMessages?.length ? null : (
              <span className=" italic"> No messages found</span>
            )}
          </div>
          <div className="flex gap-4 flex-wrap">
            {executeMessages?.map((msg) => (
              <div
                onClick={() => handleSelectMessage(msg)}
                key={msg}
                className={`query-shortcut-msg`}
              >
                {msg}
              </div>
            ))}
          </div>
        </div>
        <div className="execute-input-field">
          <TextField
            value={executeInput}
            name="executeInputsField"
            onChange={handleQueryChange}
            fullWidth
            multiline
            rows={7}
            InputProps={{
              sx: {
                input: {
                  color: 'white',
                  fontSize: '14px',
                  padding: 2,
                },
              },
            }}
            sx={queryInputStyles}
          />
          <button onClick={onExecute} className="primary-gradient execute-btn">
            {txExecuteLoading === TxStatus.PENDING ? (
              <CircularProgress size={18} sx={{ color: 'white' }} />
            ) : (
              'Execute'
            )}
          </button>
          <button
            onClick={formatExecutionMessage}
            className="format-json-btn !bg-[#232034]"
          >
            Format JSON
          </button>
        </div>
      </div>
      <div className="execute-output-box">
        <div className="attach-funds-header">
          <div className="text-[18px] font-bold">Attach Funds</div>
          <div className="attach-funds-description">
            Provide the list of funds you would like to attach.
          </div>
        </div>
        <div className="flex-1 overflow-y-scroll">
          <AttachFunds
            handleAttachFundTypeChange={handleAttachFundTypeChange}
            attachFundType={attachFundType}
            chainName={chainName}
            funds={funds}
            setFunds={setFunds}
            fundsInputJson={fundsInput}
            setFundsInputJson={setFundsInput}
          />
        </div>
      </div>
    </div>
  );
};

export default ExecuteContract;
