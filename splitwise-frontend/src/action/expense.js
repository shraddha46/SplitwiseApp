import {
    ADD_EXPENSE_LOADING,
    ADD_EXPENSE_SUCCESS,
    ADD_EXPENSE_ERROR,
    GET_ALL_EXPENSES_LOADING,
    GET_ALL_EXPENSES_SUCCESS,
    GET_ALL_EXPENSES_ERROR,
    GET_ALL_DEBTS_LOADING,
    GET_ALL_DEBTS_SUCCESS,
    GET_ALL_DEBTS_ERROR
} from './type';

import { addExpenseAPI, getAllExpenses, getAllDebtsAPI } from '../service/services';

export const addExpenseAction = (payload) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({ type: ADD_EXPENSE_LOADING })
            addExpenseAPI(payload)
                .then((response) => {
                    if (response.status === 200) {
                        dispatch({
                            type: ADD_EXPENSE_SUCCESS,
                            data: response.data
                        })
                    }
                    return resolve(response.data);
                })
                .catch((error) => {
                    if (error) {
                        dispatch({
                            type: ADD_EXPENSE_ERROR,
                            data: { error: error.response.data }
                        })
                    }
                    return reject(error.response.data)
                })
        })
    }
}

export const getAllExpensesAction = (payload) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({ type: GET_ALL_EXPENSES_LOADING })
            getAllExpenses(payload)
                .then((response) => {
                    if (response.status === 200) {
                        dispatch({
                            type: GET_ALL_EXPENSES_SUCCESS,
                            data: response.data
                        })
                    }
                    return resolve(response.data);
                })
                .catch((error) => {
                    if (error) {
                        dispatch({
                            type: GET_ALL_EXPENSES_ERROR,
                            data: { error: error.response.data }
                        })
                    }
                    return reject(error.response.data)
                })
        })
    }
}

export const getAllDebtsAction = () => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({ type: GET_ALL_DEBTS_LOADING })
            getAllDebtsAPI()
                .then((response) => {
                    if (response.status === 200) {
                        dispatch({
                            type: GET_ALL_DEBTS_SUCCESS,
                            data: response.data
                        })
                    }
                    return resolve(response.data);
                })
                .catch((error) => {
                    if (error) {
                        dispatch({
                            type: GET_ALL_DEBTS_ERROR,
                            data: { error: error.response.data }
                        })
                    }
                    return reject(error.response.data)
                })
        })
    }
}