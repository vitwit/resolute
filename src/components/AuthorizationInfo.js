import React from 'react';
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { getTypeURLName, shortenAddress } from '../utils/util';
import { parseSpendLimit } from '../utils/denom';
import { getLocalTime } from '../utils/datetime';

const renderAuthorization = (authz, displayDenom) => {
    const { authorization, granter, grantee, expiration } = authz;
    switch (authorization["@type"]) {
        case "/cosmos.bank.v1beta1.SendAuthorization":
            return (
                <>
                    <ul>
                        <li className='inline-space-between'>
                            <Typography>
                                Type
                            </Typography>
                            <Chip label={getTypeURLName(authorization['@type'])} variant="filled" size="medium" />
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
                                {`${parseSpendLimit(authorization.spend_limit)}${displayDenom}`}
                            </Typography>
                        </li>
                        <li className='inline-space-between'>
                            <Typography>
                                Expiration
                            </Typography>
                            <Typography>
                                {expiration ? getLocalTime(expiration) : <span dangerouslySetInnerHTML={{ "__html": "&infin;" }} />}
                            </Typography>
                        </li>
                    </ul>
                </>
            )

        case "/cosmos.authz.v1beta1.GenericAuthorization":
            return (
                <>
                    <ul>
                        <li className='inline-space-between'>
                            <Typography>
                                Type
                            </Typography>
                            <Chip label={getTypeURLName(authorization['@type'])} variant="filled" size="medium" />
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
                            {expiration ? <Typography>{getLocalTime(expiration)}</Typography> : <span dangerouslySetInnerHTML={{ "__html": "&infin;" }} />}
                        </li>
                    </ul>
                </>
            )
        case "/cosmos.staking.v1beta1.StakeAuthorization":
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


export function AuthorizationInfo(props) {
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


AuthorizationInfo.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    authorization: PropTypes.object.isRequired,
    displayDenom: PropTypes.string.isRequired,
};