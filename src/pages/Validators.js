import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    getValidators, resetState, getDelegations, sortValidatorsByVotingPower
} from '../features/staking/stakeSlice';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Paper from '@mui/material/Paper';
import { ActiveValidators } from '../components/ActiveValidators';
import { InActiveValidators } from '../components/InActiveValidators';
import { MyDelegations } from '../components/Delegations';

export function Validators() {
    const [type, setType] = useState('delegations');

    const validators = useSelector((state) => state.staking.validators);
    const delegations = useSelector((state) => state.staking.delegations);
    const wallet = useSelector((state) => state.wallet);
    const { chainInfo, address, connected } = wallet;
    const dispatch = useDispatch();

    const [selected, setSelected] = React.useState('active')

    useEffect(() => {
        dispatch(resetState())
        if (connected) {
            dispatch(getValidators({
                baseURL: chainInfo.lcd,
                status: null,
            }))
        }
    }, [chainInfo]);

    useEffect(() => {
        if (connected && validators.pagination?.next_key === null) {
            dispatch(getDelegations({
                baseURL: chainInfo.lcd,
                address: address,
            }))
        }
    }, [validators]);

    useEffect(() => {
        if (connected) {
            if (validators.pagination?.next_key !== null) {
                dispatch(getValidators({
                    baseURL: chainInfo.lcd,
                    status: null,
                    pagination: {
                        key: validators.pagination.next_key,
                        limit: null
                    }
                }))
            } else {
                if (Object.keys(validators?.active).length > 0 && validators.pagination?.next_key === null)
                    dispatch(sortValidatorsByVotingPower())
            }
        }
    }, [validators.pagination])

    return (
        <>
            <ButtonGroup variant="outlined" aria-label="outlined button staking">
                <Button
                    variant={type === 'delegations' ? 'contained' : 'outlined'}
                    onClick={() => setType('delegations')}
                >
                    My Delegations
                </Button>
                <Button
                    variant={type === 'validators' ? 'contained' : 'outlined'}
                    onClick={() => setType('validators')}
                >
                    Validators
                </Button>
            </ButtonGroup>
            {
                type === 'delegations' ?
                    <MyDelegations validators={validators} delegations={delegations} />
                    :
                    (
                        <Paper elevation={0} style={{ padding: 12 }}>
                            <ButtonGroup
                                variant="outlined"
                                aria-label="validators"
                                style={{ display: 'flex', marginBottom: 12 }}
                            >
                                <Button
                                    variant={selected === 'active' ? 'contained' : 'outlined'}
                                    onClick={() => setSelected('active')}
                                >
                                    Active
                                </Button>
                                <Button
                                    variant={selected === 'inactive' ? 'contained' : 'outlined'}
                                    onClick={() => setSelected('inactive')}
                                >
                                    Inactive
                                </Button>
                            </ButtonGroup>
                            {
                                selected === 'active' ?
                                    <ActiveValidators validators={validators} />
                                    :
                                    <InActiveValidators validators={validators} />
                            }
                        </Paper>
                    )
            }
        </>
    );
}
