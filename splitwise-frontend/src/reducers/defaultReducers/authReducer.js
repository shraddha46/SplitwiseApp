import {
    SIGNUP_LOADING,
    SIGNUP_SUCCESS,
    SIGNUP_ERROR,
    LOGIN_LOADING,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    LOGOUT_SUCCESS
} from '../../action/type';

const SIGNUP_INITIAL_STATE={
    signupData:[]
}
const LOGIN_INITIAL_STATE={
    loginData:[]
}

export const signupReducer = (state=SIGNUP_INITIAL_STATE,action) =>{
    switch(action.type)
    {
        case SIGNUP_LOADING: {
            return {...state, loading: true}
        }
        case SIGNUP_SUCCESS: {
            return {signupData: action.data, loading: false, success: true}
        }
        case SIGNUP_ERROR: {
            return {...state, loading: false, success: false, error: action.data.error}
        }
        default:
            return state;
    }
};

export const loginReducer = (state=LOGIN_INITIAL_STATE,action) =>{
    switch(action.type)
    {
        case LOGIN_LOADING: {
            return {...state, loading: true}
        }
        case LOGIN_SUCCESS: {
            return {data: action.data, loading: false, success: true}
        }
        case LOGIN_ERROR: {
            return {...state, loading: false, success: false, error: action.data.error}
        }
        case LOGOUT_SUCCESS: {
            return {...state, loading: false, success: true, data: []};
        }
        default:
            return state;
    }
};