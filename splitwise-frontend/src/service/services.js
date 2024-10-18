import baseService from './baseService';

export function signupAPI(payload) {
    return baseService.post('/auth/signup', payload);
}

export function loginAPI(payload) {
    return baseService.post('/auth/login', payload);
};

export function getUserDetailAPI() {
    return baseService.get('/user/detail');
};

export function addExpenseAPI(payload) {
    return baseService.post('/expense/addExpense', payload);
};

export function addTempUsersAPI(payload) {
    return baseService.post('/friends/addFriends', payload);
};

export function getAllExpenses() {
    return baseService.get('/expense/all');
};

export function getFriendsAPI() {
    return baseService.get('/friends/getFriends');
};

export function getOwnBalanceAPI() {
    return baseService.get('/user/getOwnBalance');
};

export function getAllDebtsAPI() {
    return baseService.get('/expense/getAllDebts');
};