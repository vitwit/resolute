import * as React from 'react';
import { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { useSelector, useDispatch } from 'react-redux';
import {
  getGrantsToMe, getGrantsByMe
} from './../features/feegrant/feegrantSlice';
import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from '@mui/material/Chip';
import { getTypeURLName } from '../utils/util';
import { useNavigate } from "react-router-dom";
import { StyledTableCell, StyledTableRow } from './table';
import { Typography } from '@mui/material';

export default function Feegrant() {
  const grantsToMe = useSelector((state) => state.feegrant.grantsToMe.grants);
  const grantsByMe = useSelector((state) => state.feegrant.grantsByMe.grants);
  const dispatch = useDispatch();

  const [grantType, setGrantType] = React.useState('by-me');

  const chainInfo = useSelector((state) => state.wallet.chainInfo);
  const address = useSelector((state) => state.wallet.bech32Address);

  useEffect(() => {
    dispatch(getGrantsByMe({
      baseURL: chainInfo.lcd,
      granter: address
    }))
  }, [chainInfo]);

  let navigate = useNavigate();
  function navigateTo(path) {
    navigate(path);
  }



  return (
    <>
      <div style={{ display: 'flex', marginBottom: 12, flexDirection: 'row-reverse' }}>
        <Button variant='contained' size='medium'
          onClick={() => navigateTo("/feegrant/new")}
        >
          Grant New
        </Button>
      </div>
      <Paper elevation={0} style={{ padding: 12 }}>
        <ButtonGroup variant="outlined" aria-label="validators" style={{ display: 'flex', marginBottom: 12 }}>
          <Button
            variant={grantType === 'by-me' ? 'contained' : 'outlined'}
            onClick={() => setGrantType('by-me')}
          >Granted By Me</Button>
          <Button
            variant={grantType === 'to-me' ? 'contained' : 'outlined'}
            onClick={() => {
              dispatch(getGrantsToMe({
                baseURL: chainInfo.lcd,
                grantee: address
              }))
              setGrantType('to-me')
            }
            }
          >Granted To Me</Button>
        </ButtonGroup>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            {
              grantType === 'by-me' ?
                (
                  <>
                    {
                      grantsByMe.length === 0 ?
                        <Typography
                          variant='h6'
                          color="text.primary"
                          style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
                          No Authorizations found
                        </Typography>
                        :
                        <>
                          <TableHead>
                            <StyledTableRow>
                              <StyledTableCell>Grantee</StyledTableCell>
                              <StyledTableCell >Type</StyledTableCell>
                              <StyledTableCell>SpendLimit</StyledTableCell>
                              <StyledTableCell>Expiration</StyledTableCell>
                            </StyledTableRow>
                          </TableHead>
                          <TableBody>
                            {grantsByMe && grantsByMe.allowances && grantsByMe.allowances.map((row) => (
                              <StyledTableRow
                                key={row.index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <StyledTableCell component="th" scope="row">
                                  {JSON.stringify(row)}
                                </StyledTableCell>
                                <StyledTableCell>{row.allowance['@type']}</StyledTableCell>
                                <StyledTableCell>{row.allowance.spend_limit.length > 0 ? row.allowance.spend_limit : "-"}</StyledTableCell>
                                <StyledTableCell>{row.allowance.expiration ? row.allowance.expiration : "-"}</StyledTableCell>
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        </>
                    }
                  </>
                )
                :
                (
                  <>
                    {
                      grantsToMe.length === 0 ?
                        <Typography
                          variant='h6'
                          color="text.primary"
                          style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
                          No Authorizations found
                        </Typography>
                        :
                        <>
                          <TableHead>
                            <StyledTableRow>
                              <StyledTableCell >Granter</StyledTableCell>
                              <StyledTableCell >Type</StyledTableCell>
                              <StyledTableCell >Basic SpendLimit</StyledTableCell>
                              <StyledTableCell>Expiration</StyledTableCell>
                            </StyledTableRow>
                          </TableHead>
                          <TableBody>
                            {grantsToMe && grantsToMe.allowances && grantsToMe.allowances.map((row) => (
                              <StyledTableRow
                                key={row.index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <StyledTableCell component="th" scope="row">
                                  {row.granter}
                                </StyledTableCell>
                                <StyledTableCell>
                                  <Chip label={getTypeURLName(row.allowance['@type'])} variant="filled" size="medium" />
                                </StyledTableCell>
                                <StyledTableCell>{row.allowance.spend_limit?.length > 0 ? row.allowance.spend_limit : "-"}</StyledTableCell>
                                <StyledTableCell>{row.allowance.expiration ? row.allowance.expiration : "-"}</StyledTableCell>
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        </>
                    }
                  </>
                )
            }
          </Table>
        </TableContainer>
      </Paper>
    </>

  );
}
