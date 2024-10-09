import {
    ADD_TEMP_USERS_LOADING,
    ADD_TEMP_USERS_SUCCESS,
    ADD_TEMP_USERS_ERROR,
    GET_FRIENDS_LOADING,
    GET_FRIENDS_SUCCESS,
    GET_FRIENDS_ERROR
} from './type';

import {addTempUsersAPI, getFriendsAPI} from '../service/services';

export const addTempUsersAction=(payload)=>{
    return(dispatch)=>{
        return new Promise((resolve,reject)=>{
            dispatch({type: ADD_TEMP_USERS_LOADING})
            addTempUsersAPI(payload)
            .then((response)=>{
                if(response.status===200)
                {
                    dispatch({
                        type: ADD_TEMP_USERS_SUCCESS,
                        data: response.data
                    })
                }
                return resolve(response.data);
            })
            .catch((error)=>{
                if(error){
                    dispatch({
                        type:ADD_TEMP_USERS_ERROR,
                        data:{error:error.response.data}
                    })
                }
                return reject(error.response.data)
            })
        })
    }
}

export const getFriendsAction = () => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({ type: GET_FRIENDS_LOADING })
            getFriendsAPI()
                .then((response) => {
                    if (response.status === 200) {
                        dispatch({
                            type: GET_FRIENDS_SUCCESS,
                            data: response.data
                        })
                    }
                    return resolve(response.data);
                })
                .catch((error) => {
                    if (error) {
                        dispatch({
                            type: GET_FRIENDS_ERROR,
                            data: { error: error.response.data }
                        })
                    }
                    return reject(error.response.data)
                })
        })
    }
}