import {
    ADD_TEMP_USERS_LOADING,
    ADD_TEMP_USERS_SUCCESS,
    ADD_TEMP_USERS_ERROR
} from '../../action/type';

const TEMP_USERS_INITIAL_STATE = {
    tempUsersData: []
}

export const addTempUsersReducer = (state = TEMP_USERS_INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_TEMP_USERS_LOADING: {
            return { ...state, loading: true }
        }
        case ADD_TEMP_USERS_SUCCESS: {
            return { tempUsersData: action.data, loading: false, success: true }
        }
        case ADD_TEMP_USERS_ERROR: {
            return { ...state, loading: false, success: false, error: action.data.error }
        }
        default:
            return state;
    }
};