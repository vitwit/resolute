import * as React from "react";
import { Box, CircularProgress, Grid } from "@mui/material";
import AlertMsg from "./AlertMsg";
import GroupCard from "./GroupCard";
import PaginationElement from "./PaginationElement";

export interface GroupsByAdminProps {
    groups: any;
    status: string;
    total: number;
    handlePagination: (key: number) => void;
    onAction: (group: any) => void;
    paginationKey: string;
}

export default function GroupList(props: GroupsByAdminProps) {
    const { groups, onAction,
        paginationKey,
        handlePagination, total, status } = props;

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2 }}
                >
                    {
                        status === 'pending'?
                        <CircularProgress sx={{textAlign: 'center'}} />: null
                    }

                    {
                        status !== 'pending' && !groups.length ?
                            <AlertMsg text={'Sorry, No groups found'} type='error' />
                            : null
                    }

                    {status !== 'pending' && groups?.map((group: any, index: any,) => (
                        <Grid item xs={2} sm={2} lg={4} md={4} key={index}>
                            <GroupCard group={group} />
                        </Grid>
                    ))}

                    {
                        total > 9 && <Grid marginBottom={0} marginLeft={'auto'} bottom={0}>
                            <PaginationElement
                                handlePagination={handlePagination}
                                paginationKey={paginationKey}
                                total={total} />
                        </Grid>
                    }

                </Grid>
            </Box >
        </>
    )
}
