import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Typography } from '@mui/material';
import { StyledTableCell, StyledTableRow } from '../../components/CustomTable';

export const Validator = (props) => {
  let reward = (+props.reward).toLocaleString();
  let stake = (+props.validator.stakedAmount).toLocaleString();
  return (
    <StyledTableRow>
      <StyledTableCell size="small">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={props.validator.imageUrl} sx={{ width: 24, height: 24 }} />&nbsp;&nbsp;
          <Typography>{props.validator.validatorName}</Typography>
        </Box>
      </StyledTableCell>
      <StyledTableCell>{stake}&nbsp;{props.denom}</StyledTableCell>
      <StyledTableCell>{reward}&nbsp;{props.denom}</StyledTableCell>
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


