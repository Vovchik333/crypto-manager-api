import { jwtManager } from "@helpers";
import mongoose from "mongoose";

const signUpUserFakeData = {
    nickname: 'Joe21',
    email: 'joe21@gmail.com',
    password: 'joe12345'
};

const signInUserFakeData = {
    email: 'joe21@gmail.com',
    password: 'joe12345'
};

const userFakeData = {
    nickname: 'Jake1223',
    email: 'jake02@gmail.com',
    password: 'jake010132'
};

const otherUserFakeData = {
    nickname: 'Jason',
    email: 'jason12@gmail.com',
    password: 'jason12132'
};

const updateUserFakeData = {
    nickname: 'Jak8',
    email: 'jake12302@gmail.com',
    password: '129890281203012380'
};

const FAKE_USER_JWT_TOKEN = jwtManager.signJwt('testId');

export { 
    signUpUserFakeData, 
    signInUserFakeData, 
    userFakeData,
    otherUserFakeData,
    updateUserFakeData, 
    FAKE_USER_JWT_TOKEN 
};
