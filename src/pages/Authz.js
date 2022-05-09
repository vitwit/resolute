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
  getGrantsToMe, getGrantsByMe, txAuthzRevoke
} from './../features/authz/authzSlice';
import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from '@mui/material/Chip';
import { getTypeURLName, shortenAddress } from '../utils/util';
import { useNavigate } from "react-router-dom";
import { StyledTableCell, StyledTableRow } from './table';
import { Link, Typography } from '@mui/material';
import { getLocalTime } from '../utils/datetime';
import { AuthorizationInfo } from '../components/AuthorizationInfo';
import { resetError, resetTxHash, setError, setTxHash } from '../features/common/commonSlice';
import { getTypeURLFromAuthorization } from '../utils/authorizations';



export default function Authz() {
  const grantsToMe = useSelector((state) => state.authz.grantsToMe);
  const grantsByMe = useSelector((state) => state.authz.grantsByMe);
  const dispatch = useDispatch();

  const [infoOpen, setInfoOpen] = React.useState(false);
  const [selected, setSelected] = React.useState({});
  const handleInfoClose = (value) => {
    setInfoOpen(false);
  };

  const [grantType, setGrantType] = React.useState('by-me');

  const chainInfo = useSelector((state) => state.wallet.chainInfo);
  const address = useSelector((state) => state.wallet.address);
  const revokeTx = useSelector((state) => state.authz.tx.revoke);
  const currency = useSelector((state) => state.wallet.chainInfo.currencies[0]);

  useEffect(() => {
    if (address !== "") {
      dispatch(getGrantsByMe({
        baseURL: chainInfo.lcd,
        granter: address
      }))
    }
  }, [chainInfo]);

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

  useEffect(() => {
    if (revokeTx?.txHash?.length > 0) {
      dispatch(setTxHash({
        hash: revokeTx?.txHash,
      }))

      dispatch(getGrantsByMe({
        baseURL: chainInfo.lcd,
        granter: address
      }))

    }

    if (revokeTx?.errMsg !== '') {
      dispatch(setError({
        type: 'error',
        message: revokeTx.errMsg
      }))
    }
  }, [revokeTx])

  const onRevoke = (granter, grantee, typeURL) => {
    dispatch(txAuthzRevoke({
      granter: granter,
      grantee: grantee,
      typeURL: typeURL,
      denom: currency.coinMinimalDenom,
      memo: "",
      chainId: chainInfo.chainId,
      rpc: chainInfo.rpc,
      feeAmount: 25000
    }))

  }

  useEffect(() => {
    dispatch(resetError())
    dispatch(resetTxHash())
  }, [])

  let navigate = useNavigate();
  function navigateTo(path) {
    navigate(path);
  }


  return (
    <>
      {
        selected?.authorization ?
          <AuthorizationInfo
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
          onClick={() => navigateTo("/authz/new")}
        >
          Grant New
        </Button>
      </div>
      <Paper elevation={0} style={{ padding: 12 }}>
        <ButtonGroup variant="outlined" aria-label="validators" style={{ display: 'flex', marginBottom: 12 }}>
          <Button
            variant={grantType === 'by-me' ? 'contained' : 'outlined'}
            onClick={() => {
              dispatch(getGrantsByMe({
                baseURL: chainInfo.lcd,
                granter: address
              }))
              setGrantType('by-me')
            }}
          >Granted by me</Button>
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
          >Granted to me</Button>
        </ButtonGroup>

        <TableContainer component={Paper} elevation={0}>
          {
            grantType === 'by-me' ?
              (
                <>
                  {
                    grantsByMe.grants.length === 0 ?
                      <Typography
                        variant='h6'
                        color="text.primary"
                        style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
                        No Authorizations Found
                      </Typography>
                      :
                      <>
                        <Table sx={{ minWidth: 700 }} aria-label="simple table">
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
                            {grantsByMe.grants && grantsByMe.grants.map((row, index) => (
                              <>
                                <StyledTableRow
                                  key={index}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                  <StyledTableCell component="th" scope="row">
                                    {shortenAddress(row.grantee, 21)}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <Chip label={getTypeURLName(row.authorization['@type'])} variant="filled" size="medium" />
                                  </StyledTableCell>
                                  <StyledTableCell>{row.expiration ? getLocalTime(row.expiration) : <span dangerouslySetInnerHTML={{ "__html": "&infin;" }} />}</StyledTableCell>
                                  <StyledTableCell>
                                    <Link onClick={() => {
                                      setSelected(row)
                                      setInfoOpen(true)
                                    }
                                    }>Details</Link>
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      disableElevation
                                      color='primary'
                                      disabled={revokeTx?.status === 'pending' ? true : false}
                                      onClick={() => onRevoke(row.granter, row.grantee, getTypeURLFromAuthorization(row.authorization))}
                                    >
                                      Revoke
                                    </Button>
                                  </StyledTableCell>
                                </StyledTableRow>
                              </>
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
                    grantsToMe.grants.length === 0 ?

                      <Typography
                        variant='h6'
                        color="text.primary"
                        style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
                        No Authorizations Found
                      </Typography>
                      :

                      <>
                        <Table sx={{ minWidth: 700 }} aria-label="simple table">
                          <TableHead>
                            <StyledTableRow>
                              <StyledTableCell >Granter</StyledTableCell>
                              <StyledTableCell >Type</StyledTableCell>
                              <StyledTableCell>Expiration</StyledTableCell>
                              <StyledTableCell >Details</StyledTableCell>
                              <StyledTableCell >Actions</StyledTableCell>
                            </StyledTableRow>
                          </TableHead>
                          <TableBody>
                            {grantsToMe.grants && grantsToMe.grants.map((row, index) => (
                              <StyledTableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <StyledTableCell component="th" scope="row">
                                  {shortenAddress(row.granter, 21)}
                                </StyledTableCell>
                                <StyledTableCell>
                                  <Chip label={getTypeURLName(row.authorization['@type'])} variant="filled" size="medium" />
                                </StyledTableCell>
                                <StyledTableCell>{row.expiration ? getLocalTime(row.expiration) : <span dangerouslySetInnerHTML={{ "__html": "&infin;" }} />}</StyledTableCell>
                                <StyledTableCell>
                                  <Link onClick={() => {
                                    setSelected(row)
                                    setInfoOpen(true)
                                  }}
                                  >
                                    Details
                                  </Link>
                                </StyledTableCell>
                                <StyledTableCell>
                                  <Button
                                    size='small'
                                    color='info'
                                    onClick={() => { alert("TODO://") }}
                                  >
                                    Use
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
