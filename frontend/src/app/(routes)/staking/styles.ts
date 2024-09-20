export const paginationComponentStyles = {
  '& .MuiPaginationItem-page': {
    '&:hover': {
      backgroundColor: '#FFFFFF05',
    },
    fontSize: '12px',
    minWidth: '24px',
    height: '24px',
    borderRadius: '4px',
    color: '#ffffff80',
    fontWeight: '200',
  },
  '& .Mui-selected': {
    backgroundColor: '#FFFFFF05',
    fontWeight: '600',
    color: '#ffffff',
  },
  '& .MuiPaginationItem-icon': {
    color: '#fff',
  },
  '& .MuiPaginationItem-ellipsis, & .MuiPaginationItem-ellipsisIcon': {
    color: 'white',
  },
};

export const dialogBoxStyles = {
  sx: {
    borderRadius: '24px',
    background: 'linear-gradient(90deg, #704290 0.11%, #241b61 70.28%)',
  },
};

export const allValidatorDialogStyles = {
  sx: {
    borderRadius: '16px',
    background: 'linear-gradient(90deg, #704290 0.11%, #241b61 70.28%)',
  },
};

export const textFieldStyles = {
  '& .MuiTypography-body1': {
    color: 'white',
    fontSize: '12px',
    fontWeight: 200,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiOutlinedInput-root': {
    border: '1px solid transparent',
    borderRadius: '16px',
  },
  '& .Mui-focused': {
    border: '1px solid #ffffff4a',
    borderRadius: '16px',
  },
};

export const textFieldInputPropStyles = {
  input: {
    color: 'white',
    fontSize: '14px',
    padding: 2,
  },
  'input[type=number]::-webkit-inner-spin-button ': {
    WebkitAppearance: 'none',
    appearance: 'none',
  },
};

export const withdrawAddressFieldStyles = {
  '& .MuiTypography-body1': {
    color: 'white',
    fontSize: '12px',
    fontWeight: 200,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiOutlinedInput-root': {
    border: '1px solid transparent',
    borderRadius: '16px',
    color: 'white',
  },
  '& .Mui-focused': {
    border: '1px solid #ffffff4a',
    borderRadius: '16px',
  },
  '& .Mui-disabled': {
    WebkitTextFillColor: '#ffffff6b !important',
  },
};
