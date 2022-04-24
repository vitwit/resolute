import Axios from 'axios';
import {VALIDATORS_FAILED, VALIDATORS_LOADING, VALIDATORS_SUCCESS} from './../types'

const validatorsURI = 'cosmos/v1beta1/staking/validators';


const validatorsLoading = () => {
    return {
        type: VALIDATORS_LOADING,
    };
};

const validatorsSuccess = (validators) => {
    return {
        type: VALIDATORS_SUCCESS,
        validators,
    };
};

const validatorsFailure = (errMsg) => {
    return {
        type: VALIDATORS_FAILED,
        errMsg,
    };
};

export const validators = (baseURL, key, limit) => (dispatch) => {
    dispatch(validatorsLoading());
    Axios.get(`${baseURL}${validatorsURI}?pagination.key=${key}&pagination.limit=${limit}`, {
        headers: {
            Accept: 'application/json, text/plain, */*',
            Connection: 'keep-alive',
        },
    })
        .then((res) => {
            dispatch(validatorsSuccess(res.data && res.data.result));
        })
        .catch((error) => {
            dispatch(validatorsFailure(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Failed!',
            ));
        });
};