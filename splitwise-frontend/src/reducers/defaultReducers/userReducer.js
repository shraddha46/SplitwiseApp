import {
    GET_USER_DETAIL_LOADING,
    GET_USER_DETAIL_SUCCESS,
    GET_USER_DETAIL_ERROR
} from '../../action/type';

const USER_INITIAL_STATE = {
    userData: []
}
export const userReducer = (state = USER_INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_USER_DETAIL_LOADING: {
            return { ...state, loading: true }
        }
        case GET_USER_DETAIL_SUCCESS: {
            return { userData: action.data, loading: false, success: true }
        }
        case GET_USER_DETAIL_ERROR: {
            return { ...state, loading: false, success: false, error: action.data.error }
        }
        default:
            return state;
    }
};