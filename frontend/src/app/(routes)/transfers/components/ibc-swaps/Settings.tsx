import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setSlippage } from '@/store/features/swaps/swapsSlice';
import { TextField } from '@mui/material';
import React from 'react'
import { customTextFieldStyles } from '../../styles';
import CustomButton from '@/components/common/CustomButton';

const Settings = ({
  onClose,
  handleSlippageChange,
}: {
  onClose: () => void;
  handleSlippageChange: HandleChangeEvent;
}) => {
  const dispatch = useAppDispatch();
  const slippage = useAppSelector((state) => state.swaps.slippage);
  const quickSelectSlippage = (value: number) => {
    dispatch(setSlippage(value));
  };
  return (
    <div className="w-full h-[700px] flex flex-col justify-between">
      <div className="w-full space-y-10">
        <div className="flex items-center justify-between w-full">
          <div className="text-b1 text-[#ffffff80]">Swap</div>
          <button onClick={onClose} className="secondary-btn">
            close
          </button>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-[18px]">Slippage</div>
            <div className="text-b1-light">
              Slippage is how much price movement you can tolerate between the
              time you send out a transaction and the time it&apos;s executed.
            </div>
            <div className="divider-line"></div>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => quickSelectSlippage(1)}
              className={`rounded-full flex-1 px-4 py-[10.5px] text-center border-[0.25px] ${slippage === 1 ? 'bg-[#FFFFFF14] border-transparent' : 'bg-transparent border-[#ffffff10]'}`}
            >
              1%
            </button>
            <button
              onClick={() => quickSelectSlippage(2)}
              className={`rounded-full flex-1 px-4 py-[10.5px] text-center border-[0.25px] ${slippage === 2 ? 'bg-[#FFFFFF14] border-transparent' : 'bg-transparent border-[#ffffff10]'}`}
            >
              2%
            </button>
            <button
              onClick={() => quickSelectSlippage(3)}
              className={`rounded-full flex-1 px-4 py-[10.5px] text-center border-[0.25px] ${slippage === 3 ? 'bg-[#FFFFFF14] border-transparent' : 'bg-transparent border-[#ffffff10]'}`}
            >
              3%
            </button>
          </div>
          <div className="space-y-2">
            <div className="text-b1-light !font-light">Slippage</div>
            <TextField
              name="toAddress"
              className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
              fullWidth
              required={false}
              size="small"
              autoFocus={true}
              placeholder="Enter Address"
              sx={customTextFieldStyles}
              value={slippage}
              InputProps={{
                sx: {
                  input: {
                    color: 'white !important',
                    fontSize: '14px',
                    padding: 2,
                  },
                },
              }}
              onChange={handleSlippageChange}
            />
          </div>
        </div>
      </div>
      <CustomButton btnText="Continue" btnOnClick={onClose} />
    </div>
  );
};

export default Settings