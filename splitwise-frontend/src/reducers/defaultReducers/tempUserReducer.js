import {
    ADD_TEMP_USERS_LOADING,
    ADD_TEMP_USERS_SUCCESS,
    ADD_TEMP_USERS_ERROR,
    GET_FRIENDS_LOADING,
    GET_FRIENDS_SUCCESS,
    GET_FRIENDS_ERROR
} from '../../action/type';

const TEMP_USERS_INITIAL_STATE = {
    tempUsersData: []
}

const FRIENDS_INITIAL_STATE = {
    friends: []
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

export const getFriendsReducer = (state = FRIENDS_INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_FRIENDS_LOADING: {
            return { ...state, loading: true }
        }
        case GET_FRIENDS_SUCCESS: {
            return { friends: action.data, loading: false, success: true }
        }
        case GET_FRIENDS_ERROR: {
            return { ...state, loading: false, success: false, error: action.data.error }
        }
        default:
            return state;
    }
};