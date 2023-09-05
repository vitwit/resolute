import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  Paper,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import DialogCreateMultisig from "../../components/multisig/DialogCreateMultisig";
import {
  deleteAccount,
  getMultisigAccounts,
  resetCreateMultisigRes,
  resetDeleteAccountTxnState,
} from "../../features/multisig/multisigSlice";
import { shortenAddress } from "../../utils/util";
import { StyledTableCell, StyledTableRow } from "../../components/CustomTable";
import { getLocalTime } from "../../utils/datetime";
import { useParams } from "react-router-dom";
import SelectNetwork from "../../components/common/SelectNetwork";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import { copyToClipboard } from "../../utils/clipboard";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogConfirm from "../../components/multisig/DialogConfirm";
import { setError } from "../../features/common/commonSlice";

export default function PageMultisig() {
  const [open, setOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteAccountData, setDeleteAccountData] = useState({});

  const params = useParams();
  const [chainInfo, setChainInfo] = useState({});

  const navigate = useNavigate();

  const createMultiAccRes = useSelector(
    (state) => state.multisig.createMultisigAccountRes
  );
  const deleteAccountRes = useSelector((state) => state.multisig.deleteAccountRes);
  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const multisigAccounts = useSelector(
    (state) => state.multisig.multisigAccounts
  );
  const wallet = useSelector((state) => state.wallet);
  const { connected } = wallet;
  const { walletInfo, network } = chainInfo;
  const address = walletInfo?.bech32Address;

  const accounts = multisigAccounts.accounts;
  const pendingTxns = multisigAccounts.txnCounts;

  const dispatch = useDispatch();
  const [currentNetwork, setCurrentNetwork] = useState();
  useEffect(() => {
    const network = params.networkName;
    setCurrentNetwork(network);
    if (network.length > 0 && connected) {
      const chainId = nameToChainIDs[network];
      if (chainId?.length > 0) {
        setChainInfo(networks[chainId]);
      } else {
        throw new Error("you shouldn't be here");
      }
    }
  }, [params, connected]);

  useEffect(() => {
    if (chainInfo?.walletInfo?.bech32Address) {
      dispatch(getMultisigAccounts(chainInfo?.walletInfo?.bech32Address));
      dispatch(resetDeleteAccountTxnState())
    }
  }, [chainInfo, connected]);

  useEffect(() => {
    if (createMultiAccRes.status === "idle") {
      setOpen(false);
      dispatch(getMultisigAccounts(walletInfo?.bech32Address));
      dispatch(resetCreateMultisigRes());
    }
  }, [createMultiAccRes]);

  useEffect(() => {
    if(deleteAccountRes.status === "idle") {
      dispatch(getMultisigAccounts(walletInfo?.bech32Address));
      dispatch(resetCreateMultisigRes());
      dispatch(
        setError({
          type: "success",
          message: "Account deleted successfully",
        })
      );
    } else if (deleteAccountRes.status === "rejected") {
      dispatch(
        setError({
          type: "error",
          message: deleteAccountRes.error,
        })
      );
    }
  }, [deleteAccountRes])

  const onClose = () => {
    setOpen(false);
  };

  const onDialogConfirmClose = () => {
    setConfirmDialogOpen(false);
  };

  const deleteMultisigAccount = () => {
    dispatch(deleteAccount(deleteAccountData));
  };

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 0 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600} color="text.primary">
          Create / Select Multisig Account
        </Typography>
        <SelectNetwork
          onSelect={(name) => {
            navigate(`/${name}/multisig`);
          }}
          networks={Object.keys(nameToChainIDs)}
          defaultNetwork={
            params.networkName?.length > 0
              ? params.networkName.toLowerCase().replace(/ /g, "")
              : "cosmoshub"
          }
        />
      </Box>
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
          size="small"
          startIcon={<AddIcon />}
        >
          New Multisig
        </Button>
      </Box>
      <Box sx={{ mt: 1 }}>
        {multisigAccounts?.status !== "pending" && !accounts?.length ? (
          <Box
            sx={{
              mt: 2,
            }}
          >
            <Typography variant="h6">
              No Multisig accounts found on your address
            </Typography>
          </Box>
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
                  <StyledTableCell>Created At</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {accounts.map((row, index) => (
                  <StyledTableRow
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                  >
                    <StyledTableCell
                      onClick={() => {
                        navigate(
                          `/${currentNetwork}/multisig/${row.address}/txs`
                        );
                      }}
                    >
                      {row?.name}
                    </StyledTableCell>
                    <StyledTableCell
                      onClick={() => {
                        navigate(
                          `/${currentNetwork}/multisig/${row.address}/txs`
                        );
                      }}
                    >
                      <Chip
                        label={shortenAddress(row?.address, 21)}
                        variant="filled"
                        size="medium"
                        deleteIcon={<ContentCopyOutlined />}
                        onDelete={() => {
                          copyToClipboard(row?.address, dispatch);
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell
                      onClick={() => {
                        navigate(
                          `/${currentNetwork}/multisig/${row.address}/txs`
                        );
                      }}
                    >
                      {row?.threshold || 0}
                    </StyledTableCell>
                    <StyledTableCell
                      onClick={() => {
                        navigate(
                          `/${currentNetwork}/multisig/${row.address}/txs`
                        );
                      }}
                    >
                      <strong> {pendingTxns[row?.address] || 0} </strong> txns
                    </StyledTableCell>
                    <StyledTableCell
                      onClick={() => {
                        navigate(
                          `/${currentNetwork}/multisig/${row.address}/txs`
                        );
                      }}
                    >
                      {getLocalTime(row?.created_at)}
                    </StyledTableCell>
                    <StyledTableCell>
                      <IconButton
                        aria-label="delete account"
                        color="error"
                        onClick={() => {
                          setDeleteAccountData({
                            address: row?.address,
                            creatorAddress: address,
                          });
                          setConfirmDialogOpen(true);
                        }}
                        disabled={address !== row?.created_by}
                      >
                        <DeleteIcon />
                      </IconButton>
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
          addressPrefix={network?.config?.bech32Config?.bech32PrefixAccAddr}
          chainId={network?.config?.chainId}
          onClose={onClose}
          open={open}
          address={walletInfo?.bech32Address}
          pubKey={walletInfo?.pubKey}
        />
      ) : null}
      {confirmDialogOpen ? (
        <>
          <DialogConfirm
            open={confirmDialogOpen}
            onClose={onDialogConfirmClose}
            deleteMultisigAccount={deleteMultisigAccount}
          />
        </>
      ) : null}
    </Paper>
  );
}
