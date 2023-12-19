export const textFieldStyles = {
  '& .MuiTypography-body1': {
    color: 'white',
    fontSize: '12px',
    fontWeight: 200,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .Mui-disabled': {
    //Important is used here to override the mui's styling
    '-webkit-text-fill-color': '#ffffff6b !important',
  },
  mb: "24px",
  borderRadius: "16px"
};

export const autoCompleteStyles = {
  '& .MuiAutocomplete-inputRoot': {
    padding: '7px !important',
    '& input': {
      color: 'white',
    },
    '& button': {
      color: 'white',
    },
  },
  '& .MuiAutocomplete-popper': {
    display: 'none !important',
  },
  mb: "24px",
  borderRadius: "16px"
};

export const autoCompleteTextFieldStyles = {
  '& .MuiTypography-body1': {
    color: 'white',
    fontSize: '12px',
    fontWeight: 200,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  borderRadius: "16px"
};

export const sendTxnTextFieldStyles = {
  '& .MuiTypography-body1': {
    color: 'white',
    fontSize: '12px',
    fontWeight: 200,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .Mui-disabled': {
    '-webkit-text-fill-color': '#ffffff6b !important',
  },
  mb: "24px",
  borderRadius: "16px"
};

export const createMultisigTextFieldStyles = {
  my: 1,
  '& .MuiTypography-body1': {
    color: 'white',
    fontSize: '12px',
    fontWeight: 200,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .Mui-disabled': {
    '-webkit-text-fill-color': '#ffffff6b !important',
  },
  '& Mui-focused': {
    border: '2px solid red',
  },
};

export const createTxnTextFieldStyles = {
  '& .MuiTypography-body1': {
    color: 'white',
    fontSize: '12px',
    fontWeight: 200,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  mb: "24px",
  borderRadius: "16px"
};

export const selectTxnStyles = {
  '& .MuiOutlinedInput-input': {
    color: 'white',
  },
  '& .MuiOutlinedInput-root': {
    padding: '0px !important',
    border: 'none',
  },
  '& .MuiSvgIcon-root': {
    color: 'white',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none !important',
  },
  '& .MuiTypography-body1': {
    color: 'white',
    fontSize: '12px',
    fontWeight: 200,
  },
  borderRadius: "16px",
  mb: "24px",
};

export const dialogTxnFailedStyles = {
  borderRadius: '24px',
  background: 'linear-gradient(90deg, #704290 0.11%, #241b61 70.28%)',
}