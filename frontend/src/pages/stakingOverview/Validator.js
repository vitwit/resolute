import React from 'react';
import { TableRow, TableCell, Avatar, Box, Typography } from '@mui/material';

export const Validator = (props) => {
  return (
    <TableRow>
      <TableCell size="small">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={props.validator.imageUrl} sx={{ width: 24, height: 24 }} />&nbsp;&nbsp;
          <Typography>{props.validator.validatorName}</Typography>
        </Box>
      </TableCell>
      <TableCell>{props.validator.stakedAmount}&nbsp;{props.denom}</TableCell>
      <TableCell>{props.validator.rewards}&nbsp;{props.denom}</TableCell>
    </TableRow>
  );
};

