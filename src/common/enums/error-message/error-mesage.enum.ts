const ErrorMessage = {
    NOT_AUTHORIZED: 'Not Authorized.', 
    NOT_FOUND: 'Not found.',
    INTERNAL_SERVER_ERROR: 'Internal Server Error.',
    USER_WITH_EXISTING_EMAIL: 'A user with this email already exists.',
    USER_ID_MISMATCH: 'User id mismatch.',
    INCORRECT_PASSWORD: 'Password is not correct.'
} as const;

export { ErrorMessage };
