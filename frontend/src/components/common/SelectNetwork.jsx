import React, { useState } from 'react'
import { MenuItem, Select, FormControl } from '@mui/material'
import { Box } from '@mui/system'
import PropTypes from "prop-types";

export default function SelectNetwork(props) {
    const { onSelect, networks, defaultNetwork } = props;

    const [selected, setSelected] = useState(defaultNetwork?.length > 0 ? defaultNetwork : "cosmoshub");
    const handleNetworkSelect = (e) => {
        setSelected(e.target.value);
        onSelect(e.target.value.toLowerCase().replace(/ /g, ""));
    }

    return (
        <Box sx={{ maxWidth: 150 }}>
            <FormControl fullWidth>
                <Select
                    labelId="network-select-label"
                    id="network-select"
                    value={selected}
                    onChange={handleNetworkSelect}
                    variant="outlined"
                    placeholder="chains"
                    size="small"
                    sx={{
                        textTransform: "capitalize",
                        boxShadow: 'none',
                        '.MuiOutlinedInput-notchedOutline': { border: 0 }
                    }}
                >
                    {
                        networks.map((network, index) => (
                            <MenuItem
                                value={network.toLowerCase().replace(/ /g, "")}
                                key={index}
                                sx={{
                                    textTransform: "capitalize"
                                }}
                            >
                                {network}
                            </MenuItem>
                        ))
                    }

                </Select>
            </FormControl>
        </Box>
    )
}

SelectNetwork.propTypes = {
    onSelect: PropTypes.func.isRequired,
    networks: PropTypes.array.isRequired,
    defaultNetwork: PropTypes.string.isRequired,
};
