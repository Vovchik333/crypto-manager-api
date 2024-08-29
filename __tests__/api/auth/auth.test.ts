import supertest from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { 
    signUpInput, 
    signInInput 
} from "../../data/user";
import app from 'app';
import { ApiPath, ErrorMessage } from "@enums";
import { HttpCode, HttpMethod } from "@lib/services/http";
import { hashService } from "@lib/services/hash";
import { OBJECT_ID_LENGTH } from "@constants";
import { authService } from "@routes/auth";
import { userRepository } from "@routes/user";

const authPath = `${ApiPath.API}${ApiPath.AUTH}`;
const signUpPath = `${authPath}${ApiPath.SIGN_UP}`;
const signInPath = `${authPath}${ApiPath.SIGN_IN}`;

describe(`${authPath} routes`, () => {
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

    describe(`${HttpMethod.POST} ${signUpPath}`, () => {
        afterEach(async () => {
            await userRepository.deleteAll();
        });

        it('should return registered user', async () => {
            const response = await supertest(app.instance)
                .post('/api/auth/sign-up')
                .send(signUpInput);

            const { user, accessToken } = response.body;
            const { id, nickname, email, password } = user;
            
            expect(response.status).toBe(HttpCode.CREATED);
            expect(id.length).toBe(OBJECT_ID_LENGTH);
            expect({ nickname, email }).toEqual({ nickname: signUpInput.nickname, email: signUpInput.email });
            expect(hashService.compare(signUpInput.password, password)).toBe(true);
            expect(accessToken).toBeDefined();
        });

        it('should return a message that a user with the same mail already exists', async () => {
            await authService.signUp({ ...signUpInput });
            
            const response = await supertest(app.instance)
                .post('/api/auth/sign-up')
                .send(signUpInput);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.BAD_REQUEST);
            expect(error).toBe(ErrorMessage.USER_WITH_EXISTING_EMAIL);
        });
    });

    describe(`${HttpMethod.POST} ${signInPath}`, () => {
        beforeEach(async () => {
            await authService.signUp({ ...signUpInput });
        });
        afterEach(async () => {
            await userRepository.deleteAll();
        });

        it('should return the logged in user', async () => {
            const response = await supertest(app.instance)
                .post('/api/auth/sign-in')
                .send(signInInput);

            const { user, accessToken } = response.body;
            const { id, nickname, email, password } = user;
            
            expect(response.status).toBe(HttpCode.OK);
            expect(id.length).toBe(OBJECT_ID_LENGTH);
            expect({ nickname, email }).toEqual({ nickname: signUpInput.nickname, email: signUpInput.email });
            expect(hashService.compare(signUpInput.password, password)).toBe(true);
            expect(accessToken).toBeDefined();
        });

        it('should return a message that a user not found', async () => {
            const response = await supertest(app.instance)
                .post('/api/auth/sign-in')
                .send({ ...signInInput, email: 'example@gmail.com' });

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.NOT_FOUND);
            expect(error).toBe(ErrorMessage.NOT_FOUND);
        });

        it('should return a message that a user has incorrect password', async () => {
            const response = await supertest(app.instance)
                .post('/api/auth/sign-in')
                .send({ ...signInInput, password: 'incorrect123' });

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.BAD_REQUEST);
            expect(error).toBe(ErrorMessage.INCORRECT_PASSWORD);
        });
    });
});
