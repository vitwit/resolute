import * as React from 'react';
import { Dialog, DialogContent, Typography } from '@mui/material';

export interface GroupInfoProps {
    group: any;
    handleClose: () => void;
    open: boolean;
}

export default function GroupInfoDialog(props: GroupInfoProps) {
    const { group, handleClose, open } = props;

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogContent>
                <div>
                    <Typography>
                        Admin: {group?.admin}
                    </Typography>
                </div>
                <div>
                    <Typography>
                        Version: {group?.version}
                    </Typography>
                </div>
                <div>
                    <Typography>
                        Created At: {group?.created_at}
                    </Typography>
                </div>
                <div>
                    <Typography>
                        Total weight: {group?.total_weight}
                    </Typography>
                </div>
            </DialogContent>
        </Dialog>
    );
}
