import useContracts from '@/custom-hooks/useContracts';
import { CircularProgress, SelectChangeEvent, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AttachFunds from './AttachFunds';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { TxStatus } from '@/types/enums';
import { executeContract } from '@/store/features/cosmwasm/cosmwasmSlice';

const getFormattedFundsList = (
  funds: FundInfo[],
  fundsInput: string,
  attachFundType: string
) => {
  if (attachFundType === 'select') {
    const result: {
      denom: string;
      amount: string;
    }[] = [];
    funds.forEach((fund) => {
      if (fund.amount.length) {
        result.push({
          denom: fund.denom,
          amount: (Number(fund.amount) * 10 ** fund.decimals).toString(),
        });
      }
    });
    return result;
  } else if (attachFundType === 'json') {
    try {
      const parsedFunds = JSON.parse(fundsInput);
      return parsedFunds;
    } catch (error: any) {
      console.log(error);
    }
  }
};

const ExecuteContract = ({
  address,
  baseURLs,
  chainID,
  rpcURLs,
  walletAddress,
  chainName,
}: {
  address: string;
  baseURLs: string[];
  chainID: string;
  rpcURLs: string[];
  walletAddress: string;
  chainName: string;
}) => {
  const dispatch = useAppDispatch();
  const { getExecutionOutput } = useContracts();
  const [executeInput, setExecuteInput] = useState('');
  const [attachFundType, setAttachFundType] = useState('no-funds');
  const { getDenomInfo } = useGetChainInfo();
  const { decimals, minimalDenom } = getDenomInfo(chainID);
  const txExecuteLoading = useAppSelector(
    (state) => state.cosmwasm.chains?.[chainID].txExecute.status
  );
  const [funds, setFunds] = useState<FundInfo[]>([
    {
      amount: '',
      denom: minimalDenom,
      decimals: decimals,
    },
  ]);
  const [fundsInput, setFundsInput] = useState('');

  const handleQueryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setExecuteInput(e.target.value);
  };

  const onExecute = async () => {
    const attachedFunds = getFormattedFundsList(
      funds,
      fundsInput,
      attachFundType
    );
    // await getExecutionOutput({
    //   chainID,
    //   contractAddress: address,
    //   msgs: executeInput,
    //   rpcURLs,
    //   walletAddress,
    //   funds: attachedFunds,
    // });
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

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(executeInput);
      const formattedJSON = JSON.stringify(parsed, undefined, 4);
      setExecuteInput(formattedJSON);
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleAttachFundTypeChange = (event: SelectChangeEvent<string>) => {
    setAttachFundType(event.target.value);
  };

  return (
    <div className="flex gap-10">
      <div className="execute-field flex flex-col gap-4">
        <div className="relative flex-1 border-[1px] rounded-2xl border-[#ffffff1e] hover:border-[#ffffff50]">
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
            sx={{
              '& .MuiTypography-body1': {
                color: 'white',
                fontSize: '12px',
                fontWeight: 200,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '& .MuiOutlinedInput-root': {
                border: 'none',
                borderRadius: '16px',
                color: 'white',
              },
              '& .Mui-focused': {
                border: 'none',
                borderRadius: '16px',
              },
            }}
          />
          <button
            onClick={onExecute}
            className="primary-gradient h-10 rounded-lg px-3 py-[6px] absolute bottom-6 right-6 min-w-[85px]"
          >
            {txExecuteLoading === TxStatus.PENDING ? (
              <CircularProgress size={18} sx={{ color: 'white' }} />
            ) : (
              'Execute'
            )}
          </button>
          <div className="styled-btn-wrapper absolute top-6 right-6">
            <button
              onClick={formatJSON}
              className="styled-btn w-[144px] !bg-[#232034]"
            >
              Format JSON
            </button>
          </div>
        </div>
      </div>
      <div className="execute-output-box">
        <div className="border-b-[1px] border-[#ffffff1e] pb-4 space-y-2">
          <div className="text-[18px] font-bold">Attach Funds</div>
          {/* TODO: Update the dummy description */}
          <div className="leading-[18px] text-[12px] font-extralight">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Necessitatibus fuga consectetur reiciendis fugit suscipit ab.
          </div>
        </div>
        <div className="flex-1 overflow-y-scroll">
          <AttachFunds
            handleAttachFundTypeChange={handleAttachFundTypeChange}
            attachFundType={attachFundType}
            chainID={chainID}
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
