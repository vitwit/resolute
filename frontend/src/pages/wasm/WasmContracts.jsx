import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getContractsByCode } from "../../features/wasm/wasmSlice";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
} from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../components/CustomTable";
import PaginationElement from "../../components/group/PaginationElement";
import { wasmStyles } from "./wasm-css";

const WasmContracts = () => {
  const dispatch = useDispatch();
  const params = useParams();

  const selectedNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const currentNetwork = params?.networkName || selectedNetwork.toLowerCase();
  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const chainID = nameToChainIDs?.[currentNetwork];
  const chainInfo = networks?.[chainID].network;
  const codeId = params?.codeID;

  const contracts = useSelector(
    (state) => state.wasm?.contracts?.[chainID]?.contracts
  );
  const contractsPagination = useSelector(
    (state) => state.wasm?.contracts?.[chainID]?.pagination
  );

  const PER_PAGE = 20;
  const fetchCodes = (offset = 0, limit = PER_PAGE) => {
    dispatch(
      getContractsByCode({
        chainID: chainID,
        baseURL: chainInfo?.config?.rest,
        codeId: codeId,
        pagination: {
          offset,
          limit,
        },
      })
    );
  };

  const handlePagination = (page) => {
    fetchCodes(page * PER_PAGE, PER_PAGE);
  };

  useEffect(() => {
    fetchCodes(0, PER_PAGE);
  }, [chainInfo]);

  return (
    <Paper
    elevation={0}
    sx={{
      p: 2,
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 1,
      }}
    >
      <Typography color="text.primary" variant="h6">
        CosmWasm Smart Contracts
      </Typography>
    </Box>
    {contracts?.length ? (
      <TableContainer>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell sx={wasmStyles.paddingTopBottom}>
                Contract List
              </StyledTableCell>
              <StyledTableCell sx={wasmStyles.paddingTopBottom}>
                Actions
              </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {contracts.map((contractAddress, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell sx={wasmStyles.paddingTopBottom}>{contractAddress}</StyledTableCell>
                <StyledTableCell sx={wasmStyles.paddingTopBottom}>
                  <Button>Contract Info</Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <>
        <Typography>No Contracts Exist</Typography>
      </>
    )}
    <Box sx={{ display: "grid", placeItems: "center" }}>
      <PaginationElement
        handlePagination={handlePagination}
        paginationKey={contractsPagination?.next_key}
        total={Number(contractsPagination?.total) / PER_PAGE}
      />
    </Box>
  </Paper>
  );
};

export default WasmContracts;
