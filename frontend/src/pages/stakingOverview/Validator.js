import React from 'react';
import PropTypes from 'prop-types'
import { Avatar, Box, Typography } from '@mui/material';
import { StyledTableCell, StyledTableRow } from '../../components/CustomTable';

export const Validator = (props) => {
  return (
    <StyledTableRow>
      <StyledTableCell size="small">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={props.validator.imageUrl} sx={{ width: 24, height: 24 }} />&nbsp;&nbsp;
          <Typography>{props.validator.validatorName}</Typography>
        </Box>
      </StyledTableCell>
      <StyledTableCell>{props.validator.stakedAmount}&nbsp;{props.denom}</StyledTableCell>
      <StyledTableCell>{props.reward}&nbsp;{props.denom}</StyledTableCell>
    </StyledTableRow>
  );
};


Validator.propTypes = {
  validator: PropTypes.shape({
    imageUrl: PropTypes.string,
    validatorName: PropTypes.string,
    stakedAmount: PropTypes.number,
  }).isRequired,
  denom: PropTypes.string.isRequired,
  reward: PropTypes.number.isRequired,
};


