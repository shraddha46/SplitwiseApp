import {
    SIGNUP_LOADING,
    SIGNUP_SUCCESS,
    SIGNUP_ERROR,
    LOGIN_LOADING,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    LOGOUT_SUCCESS,
} from './type';

import {signupAPI, loginAPI} from '../service/services';

export const signupAction=(payload)=>{
    return(dispatch)=>{
        return new Promise((resolve,reject)=>{
            dispatch({type: SIGNUP_LOADING})
            signupAPI(payload)
            .then((response)=>{
                if(response.status===200)
                {
                    dispatch({
                        type: SIGNUP_SUCCESS,
                        data: response.data
                    })
                }
                return resolve(response.data);
            })
            .catch((error)=>{
                if(error){
                    dispatch({
                        type:SIGNUP_ERROR,
                        data:{error:error.response.data}
                    })
                }
                return reject(error.response.data)
            })
        })
    }
}

export const loginAction=(payload)=>{
    return(dispatch)=>{
        return new Promise((resolve,reject)=>{
            dispatch({type: LOGIN_LOADING})
            loginAPI(payload)
            .then((response)=>{
                if(response.status===200)
                {
                    localStorage.setItem("splitwiseToken",response.data.token)
                    dispatch({
                        type: LOGIN_SUCCESS,
                        data: response.data
                    })
                }
                return resolve(response.data);
            })
            .catch((error)=>{
                if(error){
                    dispatch({
                        type:LOGIN_ERROR,
                        data:{error:error.response.data}
                    })
                }
                return reject(error.response.data)
            })
        })
    }
}

export const logoutAction=()=>{
    return(dispatch)=>{
        dispatch({
            type:LOGOUT_SUCCESS
        });
        localStorage.removeItem("splitwisetoken");
    }
}