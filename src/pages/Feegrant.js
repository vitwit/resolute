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
  getGrantsToMe, getGrantsByMe, txRevoke
} from './../features/feegrant/feegrantSlice';
import {
  setError
} from './../features/common/commonSlice';

import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from '@mui/material/Chip';
import { getTypeURLName, shortenAddress } from '../utils/util';
import { getLocalTime } from './../utils/datetime'
import { useNavigate } from "react-router-dom";
import { StyledTableCell, StyledTableRow } from './table';
import { Link, Typography } from '@mui/material';

export default function Feegrant() {
  const grantsToMe = useSelector((state) => state.feegrant.grantsToMe.grants);
  const grantsByMe = useSelector((state) => state.feegrant.grantsByMe.grants);
  const dispatch = useDispatch();

  const [grantType, setGrantType] = React.useState('by-me');

  const chainInfo = useSelector((state) => state.wallet.chainInfo);
  const address = useSelector((state) => state.wallet.address);
  const errState = useSelector((state) => state.feegrant.errState);
  const currency = useSelector((state) => state.wallet.chainInfo.currencies[0]);

  useEffect(() => {
    if (address && address.length > 0) {
      dispatch(getGrantsByMe({
        baseURL: chainInfo.lcd,
        granter: address
      }))
      dispatch(getGrantsToMe({
        baseURL: chainInfo.lcd,
        grantee: address
      }))
    }
  }, [address]);

  const revoke = (a) => {
    dispatch(txRevoke({
      granter: a.granter,
      grantee: a.grantee,
      denom: currency.coinMinimalDenom,
      chainId: chainInfo.chainId,
      rpc: chainInfo.rpc,
      feeAmount: 25000,
  }))
  }

  let navigate = useNavigate();
  function navigateTo(path) {
    navigate(path);
  }

  useEffect(() => {
    if (errState.message !== '' && errState.type === 'error') {
      dispatch(setError(errState))
    }
  }, [errState]);

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
              setGrantType('to-me')
            }
            }
          >Granted To Me</Button>
        </ButtonGroup>

        <TableContainer component={Paper} elevation={0}>
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
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                            <StyledTableRow>
                              <StyledTableCell>Grantee</StyledTableCell>
                              <StyledTableCell >Type</StyledTableCell>
                              <StyledTableCell>Expiration</StyledTableCell>
                              <StyledTableCell>Details</StyledTableCell>
                              <StyledTableCell>Action</StyledTableCell>
                            </StyledTableRow>
                          </TableHead>
                          <TableBody>
                            { grantsByMe.map((row, index) => (
                              <StyledTableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <StyledTableCell component="th" scope="row">
                                  {shortenAddress(row.grantee, 21)}
                                </StyledTableCell>
                                <StyledTableCell>
                                  <Chip label={getTypeURLName(row.allowance['@type'])} variant="filled" size="medium" />
                                </StyledTableCell>
                                <StyledTableCell>{row.expiration ? getLocalTime(row.expiration) : <span dangerouslySetInnerHTML={{ "__html": "&infin;" }} />}</StyledTableCell>
                                <StyledTableCell>
                                  <Link
                                  onClick={() => alert("TODO")}
                                  >
                                  Details
                                  </Link>
                                </StyledTableCell>
                                <StyledTableCell>
                                  <Button
                                    variant='outlined'
                                    color='error'
                                    size='small'
                                    disableElevation
                                    onClick={() => revoke(row)}
                                  >
                                    Revoke
                                  </Button>
                                </StyledTableCell>
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </>
                  }
                </>
              )
              :
              (
                <>
                  {
                    grantsToMe?.length === 0 ?
                      <Typography
                        variant='h6'
                        color="text.primary"
                        style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
                        No Authorizations found
                      </Typography>
                      :
                      <>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                            <StyledTableRow>
                              <StyledTableCell >Granter</StyledTableCell>
                              <StyledTableCell >Type</StyledTableCell>
                              <StyledTableCell>Expiration</StyledTableCell>
                              <StyledTableCell >Action</StyledTableCell>
                            </StyledTableRow>
                          </TableHead>
                          <TableBody>
                            {grantsToMe && grantsToMe.allowances && grantsToMe.allowances.map((row, index) => (
                              <StyledTableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <StyledTableCell component="th" scope="row">
                                  {shortenAddress(row.granter, 21)}
                                </StyledTableCell>
                                <StyledTableCell>
                                  <Chip label={getTypeURLName(row.allowance['@type'])} variant="filled" size="medium" />
                                </StyledTableCell>
                                <StyledTableCell>{row.allowance.expiration ? getLocalTime(row.allowance.expiration) : <span dangerouslySetInnerHTML={{ "__html": "&infin;" }} />}</StyledTableCell>
                                <StyledTableCell>
                                  <Button
                                    variant='outlined'
                                    color='primary'
                                    size='small'
                                    disableElevation
                                  >
                                    Info
                                  </Button>
                                </StyledTableCell>
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </>
                  }
                </>
              )
          }
      </TableContainer>
    </Paper>
    </>

  );
}
