import React from 'react';
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';
import { Typography, Chip, DialogContent, Button, DialogActions } from '@mui/material';
import { getTypeURLName, shortenAddress } from '../utils/util';
import { parseSpendLimit } from '../utils/denom';
import { getLocalTime } from '../utils/datetime';

const renderAuthorization = (authz, displayDenom) => {
    const { allowance, granter, grantee } = authz;
    switch (allowance["@type"]) {
        case "/cosmos.feegrant.v1beta1.BasicAllowance":
            return (
                <>
                    <ul>
                        <li className='inline-space-between'>
                            <Typography>
                                Type
                            </Typography>
                            <Chip label={getTypeURLName(allowance['@type'])} variant="filled" size="medium" />
                        </li>
                        <li className='inline-space-between'>
                            <Typography>
                                Granter
                            </Typography>
                            <Chip label={shortenAddress(granter, 21)} variant="filled" size="medium" />
                        </li>
                        <li className='inline-space-between'>
                            <Typography>
                                Grantee
                            </Typography>
                            <Chip label={shortenAddress(grantee, 21)} variant="filled" size="medium" />
                        </li>
                        <li className='inline-space-between'>
                            <Typography>
                                SpendLimit
                            </Typography>
                            <Typography>
                                {allowance.spend_limit.length === 0 ? <span dangerouslySetInnerHTML={{ "__html": "&infin;" }} /> :`${parseSpendLimit(allowance.spend_limit)}${displayDenom}`}
                            </Typography>
                        </li>
                        <li className='inline-space-between'>
                            <Typography>
                                Expiration
                            </Typography>
                            <Typography>
                                {allowance.expiration ? getLocalTime(allowance.expiration) : <span dangerouslySetInnerHTML={{ "__html": "&infin;" }} />}
                            </Typography>
                        </li>
                    </ul>
                </>
            )

        case "/cosmos.feegrant.v1beta1.PeriodicAllowance":
            return (
                <>
                    <ul>
                        <li className='inline-space-between'>
                            <Typography>
                                Type
                            </Typography>
                            <Chip label={getTypeURLName(allowance['@type'])} variant="filled" size="medium" />
                        </li>
                        <li className='inline-space-between'>
                            <Typography>
                                Granter
                            </Typography>
                            <Chip label={shortenAddress(granter, 21)} variant="filled" size="medium" />
                        </li>
                        <li className='inline-space-between'>
                            <Typography>
                                Grantee
                            </Typography>
                            <Chip label={shortenAddress(grantee, 21)} variant="filled" size="medium" />
                        </li>
                        <li className='inline-space-between'>
                            <Typography>
                                Expiration
                            </Typography>
                            {allowance.expiration ? <Typography>getLocalTime(allowance.expiration)</Typography> : <span dangerouslySetInnerHTML={{ "__html": "&infin;" }} />}
                        </li>
                    </ul>
                </>
            )
        case "/cosmos.feegrant.v1beta1.FilteredAllowanceS":
            return (
                <>
                    <ul>
                        <li>
                            <Typography>
                                Type
                            </Typography>
                            <Typography>
                                <Chip label={getTypeURLName(authz['@type'])} variant="filled" size="medium" />
                            </Typography>
                        </li>
                    </ul>
                </>
            )
        default:
            return (
                <Typography>
                    Not Supported
                </Typography>
            )
    }
}


export function FeegrantInfo(props) {
    const { onClose, open, displayDenom } = props;

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open}
            maxWidth='sm'
            fullWidth={true}
        >
            <DialogContent style={{ margin: 24 }}>
                {renderAuthorization(props.authorization, displayDenom)}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}


FeegrantInfo.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    authorization: PropTypes.object.isRequired,
    displayDenom: PropTypes.string.isRequired,
};