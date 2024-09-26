import {
    GET_USER_DETAIL_LOADING,
    GET_USER_DETAIL_SUCCESS,
    GET_USER_DETAIL_ERROR
} from './type';

import { getUserDetailAPI } from '../service/services';

export const userDetailAction=(payload)=>{
    return(dispatch)=>{
        return new Promise((resolve,reject)=>{
            dispatch({type: GET_USER_DETAIL_LOADING})
            getUserDetailAPI(payload)
            .then((response)=>{
                if(response.status===200)
                {
                    dispatch({
                        type: GET_USER_DETAIL_SUCCESS,
                        data: response.data
                    })
                }
                return resolve(response.data);
            })
            .catch((error)=>{
                if(error){
                    dispatch({
                        type:GET_USER_DETAIL_ERROR,
                        data:{error:error.response.data}
                    })
                }
                return reject(error.response.data)
            })
        })
    }
}