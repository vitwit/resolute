import React, { useEffect, useState } from "react";
import { MenuItem, Select, FormControl } from "@mui/material";
import { Box } from "@mui/system";
import PropTypes from "prop-types";
import {
  setSelectedNetwork,
  setSelectedNetworkLocal,
} from "../../features/common/commonSlice";
import { useDispatch, useSelector } from "react-redux";

export default function SelectNetwork(props) {
  const { onSelect, networks, defaultNetwork = "cosmoshub" } = props;
  const dispatch = useDispatch();

  const [selected, setSelected] = useState(defaultNetwork);
  const handleNetworkSelect = (e) => {
    setSelected(e.target.value);
    onSelect(e.target.value.toLowerCase().replace(/ /g, ""));
  };
  const selectNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );

  useEffect(() => {
    dispatch(
      setSelectedNetwork({
        chainName: selected,
      })
    );
  }, [selected]);

  useEffect(() => {
    setSelected(selectNetwork);
  }, [selectNetwork]);

  return (
    <Box sx={{ maxWidth: 150 }}>
      <FormControl fullWidth>
        <Select
          labelId="network-select-label"
          id="network-select"
          value={selected.toLowerCase()}
          onChange={handleNetworkSelect}
          variant="outlined"
          placeholder="chains"
          size="small"
          sx={{
            textTransform: "capitalize",
            boxShadow: "none",
            ".MuiOutlinedInput-notchedOutline": { border: 0 },
            fontWeight: 500,
          }}
        >
          {networks.map((network, index) => (
            <MenuItem
              value={network.toLowerCase().replace(/ /g, "")}
              key={index}
              sx={{
                textTransform: "capitalize",
              }}
            >
              {network}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

SelectNetwork.propTypes = {
  onSelect: PropTypes.func.isRequired,
  networks: PropTypes.array.isRequired,
  defaultNetwork: PropTypes.string.isRequired,
};
