import mongoose from "mongoose";

const signUpInput = {
    nickname: 'Joe21',
    email: 'joe21@gmail.com',
    password: 'joe12345'
};

const signInInput = {
    email: 'joe21@gmail.com',
    password: 'joe12345'
};

const otherUserInput = {
    nickname: 'Jason',
    email: 'jason12@gmail.com',
    password: 'jason12132'
};

const updateUserInput = {
    nickname: 'Jak8',
    email: 'jake12302@gmail.com',
    password: '129890281203012380'
};

const USER_OBJECT_ID = (new mongoose.Types.ObjectId()).toString();

export { 
    signUpInput, 
    signInInput, 
    otherUserInput,
    updateUserInput, 
    USER_OBJECT_ID 
};
