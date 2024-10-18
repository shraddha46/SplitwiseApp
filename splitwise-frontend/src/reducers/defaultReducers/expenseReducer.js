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
} from '../../action/type';

const EXPENSE_INITIAL_STATE = {
    expenseData: []
}

const ALL_EXPENSES_INITIAL_STATE = {
    allExpenses: []
}

const ALL_DEBTS_INITIAL_STATE = {
    allDebts: []
}

export const addExpenseReducer = (state = EXPENSE_INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_EXPENSE_LOADING: {
            return { ...state, loading: true }
        }
        case ADD_EXPENSE_SUCCESS: {
            return { expenseData: action.data, loading: false, success: true }
        }
        case ADD_EXPENSE_ERROR: {
            return { ...state, loading: false, success: false, error: action.data.error }
        }
        default:
            return state;
    }
};

export const allExpensesReducer = (state = ALL_EXPENSES_INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_ALL_EXPENSES_LOADING: {
            return { ...state, loading: true }
        }
        case GET_ALL_EXPENSES_SUCCESS: {
            return { allExpenses: action.data, loading: false, success: true }
        }
        case GET_ALL_EXPENSES_ERROR: {
            return { ...state, loading: false, success: false, error: action.data.error }
        }
        default:
            return state;
    }
};

export const allDebtsReducer = (state = ALL_DEBTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_ALL_DEBTS_LOADING: {
            return { ...state, loading: true }
        }
        case GET_ALL_DEBTS_SUCCESS: {
            return { allDebts: action.data, loading: false, success: true }
        }
        case GET_ALL_DEBTS_ERROR: {
            return { ...state, loading: false, success: false, error: action.data.error }
        }
        default:
            return state;
    }
};