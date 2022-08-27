import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Paper,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { DialogCreateMultisig } from "../../components/DialogCreateMultisig";
import { getMultisigAccounts } from "../../features/multisig/multisigSlice";
import { shortenAddress } from "../../utils/util";
import { StyledTableCell, StyledTableRow } from "../../components/CustomTable";
import { getNetworkByChainId } from "../../utils/networks";

export default function PageMultisig() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const createMultiAccRes = useSelector(
    (state) => state.multisig.createMultisigAccountRes
  );

  const wallet = useSelector((state) => state.wallet);
  const { chainInfo, connected } = wallet;

  const multisigAccounts = useSelector(
    (state) => state.multisig.multisigAccounts
  );
  const accounts = (multisigAccounts.data && multisigAccounts.data.data) || [];
  const walletAddress = useSelector((state) => state.wallet.address);

  const { config } = chainInfo;
  const { chainId } = config;
  const networkInfo = getNetworkByChainId(chainId);
  const addressPrefix = networkInfo?.config?.bech32Config?.bech32PrefixAccAddr;

  const dispatch = useDispatch();
  useEffect(() => {
    if (createMultiAccRes.status === "idle") {
      setOpen(false);
      dispatch(getMultisigAccounts(walletAddress));
    }
  }, [createMultiAccRes]);

  useEffect(() => {
    if (connected) {
      dispatch(getMultisigAccounts(walletAddress));
    }
  }, [chainInfo]);

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 0 }}>
      <Typography
        variant="h6"
        fontWeight={600}
        color="text.primary"
        gutterBottom
      >
        Create / Select Multisig Account
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "right",
          mt: 1,
        }}
      >
        <Button
          onClick={() => {
            setOpen(!open);
          }}
          variant="contained"
          disableElevation
          sx={{
            textTransform: "none",
          }}
        >
          Create New Multisig
        </Button>
      </Box>
      <Box sx={{ mt: 1 }}>
        {multisigAccounts?.status !== "pending" && !accounts?.length ? (
          <Typography variant="body1" color="error" fontWeight={500}>
            No Multisig Accounts found on your address
          </Typography>
        ) : (
          ""
        )}
        {multisigAccounts?.status === "pending" ? (
          <CircularProgress size={40} />
        ) : null}
      </Box>

      {accounts?.length > 0 ? (
        <FormControl fullWidth sx={{ mt: 2 }}>
          <TableContainer>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="simple table"
              size="small"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Address</StyledTableCell>
                  <StyledTableCell>Threshold</StyledTableCell>
                  <StyledTableCell>Actions Required</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {accounts.map((row) => (
                  <StyledTableRow
                    key={row.name}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => {
                      localStorage.setItem(
                        "multisigAddress",
                        JSON.stringify(row)
                      );
                      navigate(`/multisig/${row.address}/txs`);
                    }}
                  >
                    <StyledTableCell>{row?.name}</StyledTableCell>
                    <StyledTableCell>
                      <Chip
                        label={shortenAddress(row?.address, 21)}
                        variant="filled"
                        size="medium"
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      {row?.pubkeyjson?.value?.threshold || 0}
                    </StyledTableCell>
                    <StyledTableCell>
                      <strong> {row?.txns?.length || 0} </strong> txns
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </FormControl>
      ) : null}

      {open ? (
        <DialogCreateMultisig
          addressPrefix={addressPrefix}
          chainId={chainId}
          onClose={onClose}
          open={open}
        />
      ) : null}
    </Paper>
  );
}
