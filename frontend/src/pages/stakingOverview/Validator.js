import React from 'react';
import { TableRow, TableCell, Avatar, Box, Typography } from '@mui/material';

export const Validator = (props) => {
  return (
    <TableRow>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={props.validator.imageUrl} sx={{ width: 30, height: 30, borderRadius: '50%' }} />
          <Typography sx={{ marginLeft: '10px' }}>{props.validator.validatorName}</Typography>
        </Box>
      </TableCell>
      <TableCell>{props.validator.stakedAmount + " " + props.denom}</TableCell>
      <TableCell>{props.validator.rewards + " " + props.denom}</TableCell>
      <TableCell>{props.validator.apr}%</TableCell>
    </TableRow>
  );
};

