import supertest from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { 
    signUpUserFakeData, 
    signInUserFakeData 
} from "../../data/user";
import app from '../../../src/app';
import { userRepository } from "@repositories";
import { HttpCode } from "@enums";
import { hashManager } from "@helpers";
import { OBJECT_ID_LENGTH } from "@constants";
import { ErrorMessage } from "@enums";
import { authService } from "@services";

describe('api/auth', () => {
    let mongoMemoryServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoMemoryServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoMemoryServer.getUri());
        await userRepository.deleteAll();
    });
    afterAll(async () => {
        await mongoose.connection.close();
        mongoMemoryServer.stop()    
    });

    describe('POST api/auth/sign-up', () => {
        afterEach(async () => {
            await userRepository.deleteAll();
        });

        it('should return registered user', async () => {
            const response = await supertest(app.instance)
                .post('/api/auth/sign-up')
                .send(signUpUserFakeData);

            const { user, accessToken } = response.body;
            
            expect(response.status).toBe(HttpCode.CREATED);

            expect(user.id.length).toBe(OBJECT_ID_LENGTH);
            expect(user.nickname).toBe(signUpUserFakeData.nickname);
            expect(user.email).toBe(signUpUserFakeData.email);
            expect(hashManager.compare(signUpUserFakeData.password, user.password)).toBe(true);
            expect(accessToken).toBeDefined();
        });

        it('should return a message that a user with the same mail already exists', async () => {
            await authService.signUp({ ...signUpUserFakeData });
            
            const response = await supertest(app.instance)
                .post('/api/auth/sign-up')
                .send(signUpUserFakeData);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.BAD_REQUEST);
            expect(error).toBe(ErrorMessage.USER_WITH_EXISTING_EMAIL);
        });
    });

    describe('POST api/auth/sign-in', () => {
        beforeEach(async () => {
            await authService.signUp({ ...signUpUserFakeData });
        });
        afterEach(async () => {
            await userRepository.deleteAll();
        });

        it('should return the logged in user', async () => {
            const response = await supertest(app.instance)
                .post('/api/auth/sign-in')
                .send(signInUserFakeData);

            const { user, accessToken } = response.body;
            
            expect(response.status).toBe(HttpCode.OK);

            expect(user.id.length).toBe(OBJECT_ID_LENGTH);
            expect(user.nickname).toBe(signUpUserFakeData.nickname);
            expect(user.email).toBe(signUpUserFakeData.email);
            expect(hashManager.compare(signUpUserFakeData.password, user.password)).toBe(true);
            expect(accessToken).toBeDefined();
        });

        it('should return a message that a user not found', async () => {
            const response = await supertest(app.instance)
                .post('/api/auth/sign-in')
                .send({ ...signInUserFakeData, email: 'example@gmail.com' });

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.NOT_FOUND);
            expect(error).toBe(ErrorMessage.NOT_FOUND);
        });

        it('should return a message that a user has incorrect password', async () => {
            const response = await supertest(app.instance)
                .post('/api/auth/sign-in')
                .send({ ...signInUserFakeData, password: 'incorrect123' });

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.BAD_REQUEST);
            expect(error).toBe(ErrorMessage.INCORRECT_PASSWORD);
        });
    });
});
