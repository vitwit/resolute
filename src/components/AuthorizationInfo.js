import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { Typography, Chip, DialogContent } from '@mui/material';
import { getTypeURLName } from '../utils/util';
import { parseSpendLimit } from '../utils/denom';

export function AuthorizationInfo(props) {
    const { onClose, authorization, open } = props;

    const handleClose = () => {
        onClose();
    };

    const renderAuthorization = (authz) => {
        switch (authz["@type"]) {
            case "/cosmos.bank.v1beta1.SendAuthorization":
                return (
                    <>
                        <ul>
                            <li style={{display: 'flex', justifyContent: 'space-between'}}>
                                <Typography>
                                    Type
                                </Typography>
                                <Typography>
                                    <Chip label={getTypeURLName(authz['@type'])} variant="filled" size="medium" />
                                </Typography>
                            </li>
                            <li>
                                <Typography>
                                    SpendLimit
                                </Typography>
                                <Typography>
                                    {parseSpendLimit(authz.spend_limit)}
                                </Typography>
                            </li>
                        </ul>
                    </>
                )

            case "/cosmos.authz.v1beta1.GenericAuthorization":
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


    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Authorization</DialogTitle>

            <DialogContent>
                {renderAuthorization(authorization)}
            </DialogContent>
        </Dialog>
    )
}


AuthorizationInfo.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    authorization: PropTypes.object.isRequired,
};