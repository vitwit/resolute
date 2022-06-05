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
  getGrantsToMe, getGrantsByMe, txRevoke, resetAlerts
} from './../features/feegrant/feegrantSlice';
import {
  resetError, resetTxHash,
  setError
} from './../features/common/commonSlice';

import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from '@mui/material/Chip';
import { getTypeURLName, shortenAddress } from '../utils/util';
import { getLocalTime } from './../utils/datetime'
import { useNavigate } from "react-router-dom";
import { StyledTableCell, StyledTableRow } from './../components/CustomTable';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { FeegrantInfo } from '../components/FeegrantInfo';
import Switch from '@mui/material/Switch';


export default function Feegrant() {
  const grantsToMe = useSelector((state) => state.feegrant.grantsToMe);
  const grantsByMe = useSelector((state) => state.feegrant.grantsByMe);
  const dispatch = useDispatch();

  const [useFeeChecked, setuseFeeChecked] = React.useState(localStorage.getItem("fee_payer"));
  const handleOnFeeChecked = (event, feeInfo) => {
    setuseFeeChecked(event.target.checked);
    if (event.target.checked) localStorage.setItem("fee_payer", feeInfo?.granter);
    else localStorage.removeItem("fee_payer");
  };

  const [grantType, setGrantType] = React.useState('by-me');

  const chainInfo = useSelector((state) => state.wallet.chainInfo);
  const address = useSelector((state) => state.wallet.address);
  const errState = useSelector((state) => state.feegrant.errState);
  const txStatus = useSelector((state) => state.feegrant.tx);
  const currency = useSelector((state) => state.wallet.chainInfo.currencies[0]);
  const [infoOpen, setInfoOpen] = React.useState(false);

  const [selected, setSelected] = React.useState({});
  const handleInfoClose = (value) => {
    setInfoOpen(false);
  };

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

  useEffect(() => {
    dispatch(resetAlerts())
    dispatch(resetError())
    dispatch(resetTxHash())
  }, []);


  useEffect(() => {
    if (grantsToMe?.errMsg !== '' && grantsToMe?.status === 'rejected') {
      dispatch(setError({
        type: 'error',
        message: grantsToMe.errMsg
      }))
    }
  }, [grantsToMe]);

  useEffect(() => {
    if (grantsByMe?.errMsg !== '' && grantsByMe?.status === 'rejected') {
      dispatch(setError({
        type: 'error',
        message: grantsByMe.errMsg
      }))
    }
  }, [grantsByMe]);

  const revoke = (a) => {
    dispatch(txRevoke({
      granter: a.granter,
      grantee: a.grantee,
      denom: currency.coinMinimalDenom,
      chainId: chainInfo.chainId,
      rpc: chainInfo.rpc,
      feeAmount: chainInfo?.config.gasPriceStep.average,
      baseURL: chainInfo?.lcd,
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
      {
        selected?.allowance ?
          <FeegrantInfo
            authorization={selected}
            displayDenom={currency?.coinDenom}
            open={infoOpen}
            onClose={handleInfoClose}
          />
          :
          <></>
      }
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
                    grantsByMe && grantsByMe?.grants.length === 0 ?
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
                            {grantsByMe && grantsByMe?.grants.map((row, index) => (
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
                                <StyledTableCell>{row?.allowance?.expiration ? getLocalTime(row?.allowance?.expiration) : <span dangerouslySetInnerHTML={{ "__html": "&infin;" }} />}</StyledTableCell>
                                <StyledTableCell>
                                  <Link onClick={() => {
                                    setSelected(row)
                                    setInfoOpen(true)
                                  }
                                  }
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
                                    disabled={txStatus?.status === 'pending' ? true : false}
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
                    grantsToMe && grantsToMe.grants?.length === 0 ?
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
                              <StyledTableCell>Details</StyledTableCell>
                              <StyledTableCell >Use Feegrant</StyledTableCell>
                            </StyledTableRow>
                          </TableHead>
                          <TableBody>
                            {grantsToMe && grantsToMe.grants?.map((row, index) => (
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
                                  <Link onClick={() => {
                                    setSelected(row)
                                    setInfoOpen(true)
                                  }
                                  }
                                  >
                                    Details
                                  </Link>
                                </StyledTableCell>
                                <StyledTableCell>
                                  <Switch checked={useFeeChecked}
                                    onChange={(e) => handleOnFeeChecked(e, row)}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                    size="small" />

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
