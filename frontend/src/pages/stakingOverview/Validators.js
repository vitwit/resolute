import React from 'react';
import { Typography, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { Validator } from './Validator';

export const Validators = (props) => {
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow >
              <TableCell>Validator Name</TableCell>
              <TableCell>Staked Amount</TableCell>
              <TableCell>Rewards</TableCell>
              <TableCell>APR</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.validators.map((validator) => (
              <Validator validator={validator} key={validator.validatorName} denom={props.denom}/>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
