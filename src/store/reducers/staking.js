import {VALIDATORS_FAILED, VALIDATORS_LOADING, VALIDATORS_SUCCESS} from './../types'


const validators = (state = {
    loading: false,
    validators: [],
    errMessage: "",
}, action) => {
    switch (action.type) {
    case VALIDATORS_LOADING:
        return {
            ...state,
            loading: true,
            errMessage: "",
        };
    case VALIDATORS_SUCCESS:
        return {
            ...state,
            validators: action.validators,
            loading: false,
            errMessage: "",
        };
    case VALIDATORS_FAILED:
        return {
            ...state,
            loading: false,
            errMessage: action.errMessage
        };
    default:
        return state;
    }
};