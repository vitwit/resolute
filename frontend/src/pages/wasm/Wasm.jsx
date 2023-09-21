import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCodes } from "../../features/wasm/wasmSlice";
import PaginationElement from "../../components/group/PaginationElement";
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
} from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../components/CustomTable";
import { wasmStyles } from "./wasm-css";

const Wasm = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const selectedNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const currentNetwork = params?.networkName || selectedNetwork.toLowerCase();
  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const chainID = nameToChainIDs?.[currentNetwork];
  const chainInfo = networks?.[chainID].network;

  const contractCodes = useSelector(
    (state) => state.wasm?.codes?.[chainID]?.codes
  );
  const codesPagination = useSelector(
    (state) => state.wasm?.codes?.[chainID]?.pagination
  );
  const codesStatus = useSelector(
    (state) => state.wasm?.codes?.[chainID]?.status
  );

  const PER_PAGE = 20;
  const fetchCodes = (offset = 0, limit = PER_PAGE) => {
    dispatch(
      getCodes({
        chainID: chainID,
        baseURL: chainInfo?.config?.rest,
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

  const handleClick = (item) => {
    navigate(`/${currentNetwork}/wasm/${item.code_id}/contracts`);
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
        <Typography color="text.primary">
          CosmWasm Smart Contracts
        </Typography>
      </Box>
      {contractCodes?.length ? (
        <TableContainer>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell sx={wasmStyles.paddingTopBottom}>
                  Code Id
                </StyledTableCell>
                <StyledTableCell sx={wasmStyles.paddingTopBottom}>
                  Code Hash
                </StyledTableCell>
                <StyledTableCell sx={wasmStyles.paddingTopBottom}>
                  Creator
                </StyledTableCell>
                <StyledTableCell sx={wasmStyles.paddingTopBottom}>
                  Permissions
                </StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {contractCodes.map((item, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{item.code_id}</StyledTableCell>
                  <StyledTableCell>
                    <abbr
                      title={item.data_hash}
                      style={{ textDecoration: "none" }}
                    >
                      <Box
                        onClick={() => handleClick(item)}
                        sx={wasmStyles.codeHashStyle}
                      >
                        {item.data_hash}
                      </Box>
                    </abbr>
                  </StyledTableCell>
                  <StyledTableCell>{item.creator}</StyledTableCell>
                  <StyledTableCell>
                    {item.instantiate_permission.permission}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <>
          {codesStatus === "pending" ? (
            <CircularProgress />
          ) : (
            <Typography>No Codes Exist</Typography>
          )}
        </>
      )}
      <Box sx={{ display: "grid", placeItems: "center" }}>
        <PaginationElement
          handlePagination={handlePagination}
          paginationKey={codesPagination?.next_key}
          total={Number(codesPagination?.total) / PER_PAGE}
        />
      </Box>
    </Paper>
  );
};

export default Wasm;
