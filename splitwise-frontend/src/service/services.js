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
    return baseService.post('/user/addTempUsers', payload);
};

export function getAllExpenses() {
    return baseService.get('/expense/all');
};