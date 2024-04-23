import { TextField } from '@mui/material';
import React from 'react';

interface ProvideFundsJsonI {
  fundsInput: string;
  setFundsInput: (value: string) => void;
}

const ProvideFundsJson = (props: ProvideFundsJsonI) => {
  const { fundsInput, setFundsInput } = props;
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
    <div className="bg-[#FFFFFF0D] p-4 rounded-2xl">
      <div className=" border-[1px] border-[#ffffff1e] hover:border-[#ffffff50] rounded-2xl relative">
        <TextField
          value={fundsInput}
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
        <button
          type="button"
          onClick={formatJSON}
          className="border-[1px] border-[#FFFFFF33] rounded-full p-2 text-[12px] font-extralight top-4 right-4 absolute"
        >
          Format JSON
        </button>
      </div>
    </div>
  );
};

export default ProvideFundsJson;
