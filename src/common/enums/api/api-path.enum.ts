const ApiPath = {
    API: '/api',
    ROOT: '/',
    ID: '/:id',
    USERS: '/users',
    AUTH: '/auth',
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
    TRANSACTIONS: '/transactions'
} as const;

export { ApiPath };
