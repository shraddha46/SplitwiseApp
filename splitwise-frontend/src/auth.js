export const getToken = () => localStorage.getItem('splitwiseToken');

export const isLoggedIn = () => !!getToken();