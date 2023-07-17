import React from 'react';
import { Table, TableContainer, TableHead, TableBody } from '@mui/material';
import { Validator } from './Validator';
import { StyledTableCell, StyledTableRow } from '../../components/CustomTable';

export const Validators = (props) => {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <StyledTableRow >
            <StyledTableCell>
              Validator Name
            </StyledTableCell>
            <StyledTableCell>
              Staked Amount
            </StyledTableCell>
            <StyledTableCell>
              Rewards
            </StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {props.validators.map((validator) => (
            <Validator
              validator={validator}
              reward={props?.rewards?.[validator.validatorAddress]?.toFixed(3) || 0}
              key={validator.validatorName}
              denom={props.denom}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
