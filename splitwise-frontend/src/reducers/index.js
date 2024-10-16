import { combineReducers } from 'redux';
import { signupReducer, loginReducer } from './defaultReducers/authReducer';
import { userReducer, userBalanceReducer } from './defaultReducers/userReducer';
import { addExpenseReducer, allExpensesReducer, allDebtsReducer } from './defaultReducers/expenseReducer';
import { addTempUsersReducer, getFriendsReducer } from './defaultReducers/tempUserReducer';

const allReducer = {
    signupState: signupReducer,
    loginState: loginReducer,
    userState: userReducer,
    expenseState: addExpenseReducer,
    allExpensesState: allExpensesReducer,
    tempUserState: addTempUsersReducer,
    friendsState: getFriendsReducer,
    balanceState: userBalanceReducer,
    debtsState: allDebtsReducer
}

export default combineReducers(allReducer);