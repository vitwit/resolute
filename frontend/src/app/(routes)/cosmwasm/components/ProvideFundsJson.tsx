import { TextField } from '@mui/material';
import React, { useState } from 'react';

const ProvideFundsJson = ({
  fundsInput,
  setFundsInput,
}: {
  fundsInput: string;
  setFundsInput: (value: string) => void;
}) => {
  // const [fundsInput, setFundsInput] = useState('');
  const handleFundsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFundsInput(e.target.value);
  };
  const formatJSON = () => {
    try {
      const parsed = JSON.parse(fundsInput);
      const formattedJSON = JSON.stringify(parsed, undefined, 4);
      setFundsInput(formattedJSON);
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#FFFFFF0D] p-6 rounded-2xl">
      <div className=" border-[1px] border-[#ffffff1e] hover:border-[#ffffff50] rounded-2xl relative">
        <TextField
          value={fundsInput}
          name="queryField"
          onChange={handleFundsChange}
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
        <div className="styled-btn-wrapper absolute top-2 right-2 ">
          <button
            onClick={formatJSON}
            className="styled-btn w-[144px] !bg-[#232034]"
          >
            Format JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProvideFundsJson;
