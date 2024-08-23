import supertest from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { 
    userFakeData, 
    FAKE_USER_JWT_TOKEN, 
    updateUserFakeData,
    otherUserFakeData
} from "../../data/user";
import app from '../../../src/app';
import { userRepository } from "@repositories";
import { HttpCode, HttpHeader } from "@enums";
import { hashManager } from "@helpers";
import { OBJECT_ID_LENGTH } from "@constants";
import { ErrorMessage } from "@enums";
import { authService, userService } from "@services";

describe('api/users', () => {
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

    describe('GET api/users/:id', () => {
        afterEach(async () => {
            await userRepository.deleteAll();
        });

        it('should return user', async () => {
            const { user: { id }, accessToken: tokenForRequest } = await authService.signUp({ ...userFakeData });

            const response = await supertest(app.instance)
                .get(`/api/users/${id}`)
                .set('Accept', 'application/json')
                .set(HttpHeader.AUTHORIZATION, `Bearer ${tokenForRequest}`);

            const user = response.body;
            
            expect(response.status).toBe(HttpCode.OK);

            expect(user.id.length).toBe(OBJECT_ID_LENGTH);
            expect(user.nickname).toBe(userFakeData.nickname);
            expect(user.email).toBe(userFakeData.email);
            expect(hashManager.compare(userFakeData.password, user.password)).toBe(true);
        });

        it('should return a message that a user not authorized', async () => {
            const { user: { id } } = await authService.signUp({ ...userFakeData });

            const response = await supertest(app.instance)
                .get(`/api/users/${id}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.NOT_AUTHORIZED);
        });

        it('should return a message that a user ID in JWT mismatch', async () => {
            const { user: { id } } = await authService.signUp({ ...userFakeData });

            const response = await supertest(app.instance)
                .get(`/api/users/${id}`)
                .set('Accept', 'application/json')
                .set(HttpHeader.AUTHORIZATION, `Bearer ${FAKE_USER_JWT_TOKEN}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.USER_ID_MISMATCH);
        });

        it('should return a message that a user not found', async () => {
            const { user: { id }, accessToken: tokenForRequest } = await authService.signUp({ ...userFakeData });
            await userService.deleteById(id);

            const response = await supertest(app.instance)
                .get(`/api/users/${id}`)
                .set('Accept', 'application/json')
                .set(HttpHeader.AUTHORIZATION, `Bearer ${tokenForRequest}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.NOT_FOUND);
            expect(error).toBe(ErrorMessage.NOT_FOUND);
        });
    });

    describe('PUT api/users/:id', () => {
        afterEach(async () => {
            await userRepository.deleteAll();
        });

        it('should return updated user', async () => {
            const { user: { id }, accessToken: tokenForRequest } = await authService.signUp({ ...userFakeData });

            const response = await supertest(app.instance)
                .put(`/api/users/${id}`)
                .send({ ...updateUserFakeData })
                .set('Accept', 'application/json')
                .set(HttpHeader.AUTHORIZATION, `Bearer ${tokenForRequest}`);

            const user = response.body;
            
            expect(response.status).toBe(HttpCode.OK);

            expect(user.id.length).toBe(OBJECT_ID_LENGTH);
            expect(user.nickname).toBe(updateUserFakeData.nickname);
            expect(user.email).toBe(updateUserFakeData.email);
            expect(hashManager.compare(updateUserFakeData.password, user.password)).toBe(true);
        });

        it('should return a message that a user with the same mail already exists', async () => {
            await authService.signUp({ ...userFakeData });
            const { user: { id }, accessToken: tokenForRequest } = await authService.signUp({ ...otherUserFakeData });

            const response = await supertest(app.instance)
                .put(`/api/users/${id}`)
                .send({ ...updateUserFakeData, email: otherUserFakeData.email })
                .set('Accept', 'application/json')
                .set(HttpHeader.AUTHORIZATION, `Bearer ${tokenForRequest}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.BAD_REQUEST);
            expect(error).toBe(ErrorMessage.USER_WITH_EXISTING_EMAIL);
        });

        it('should return a message that a user not authorized', async () => {
            const { user: { id } } = await authService.signUp({ ...userFakeData });

            const response = await supertest(app.instance)
                .put(`/api/users/${id}`)
                .send({ ...updateUserFakeData });

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.NOT_AUTHORIZED);
        });

        it('should return a message that a user ID in JWT mismatch', async () => {
            const { user: { id } } = await authService.signUp({ ...userFakeData });

            const response = await supertest(app.instance)
                .put(`/api/users/${id}`)
                .send({ ...updateUserFakeData })
                .set('Accept', 'application/json')
                .set(HttpHeader.AUTHORIZATION, `Bearer ${FAKE_USER_JWT_TOKEN}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.USER_ID_MISMATCH);
        });

        it('should return a message that a user not found', async () => {
            const { user: { id }, accessToken: tokenForRequest } = await authService.signUp({ ...userFakeData });
            await userService.deleteById(id);

            const response = await supertest(app.instance)
                .put(`/api/users/${id}`)
                .send({ ...updateUserFakeData })
                .set('Accept', 'application/json')
                .set(HttpHeader.AUTHORIZATION, `Bearer ${tokenForRequest}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.NOT_FOUND);
            expect(error).toBe(ErrorMessage.NOT_FOUND);
        });
    });

    describe('DELETE api/users/:id', () => {
        afterEach(async () => {
            await userRepository.deleteAll();
        });

        it('should return deleted user', async () => {
            const { user: { id }, accessToken: tokenForRequest } = await authService.signUp({ ...userFakeData });

            const response = await supertest(app.instance)
                .delete(`/api/users/${id}`)
                .set('Accept', 'application/json')
                .set(HttpHeader.AUTHORIZATION, `Bearer ${tokenForRequest}`);

            const user = response.body;

            expect(response.status).toBe(HttpCode.OK);

            expect(user.id.length).toBe(OBJECT_ID_LENGTH);
        });

        it('should return a message that a user not authorized', async () => {
            const { user: { id } } = await authService.signUp({ ...userFakeData });

            const response = await supertest(app.instance)
                .delete(`/api/users/${id}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.NOT_AUTHORIZED);
        });

        it('should return a message that a user ID in JWT mismatch', async () => {
            const { user: { id } } = await authService.signUp({ ...userFakeData });

            const response = await supertest(app.instance)
                .delete(`/api/users/${id}`)
                .set('Accept', 'application/json')
                .set(HttpHeader.AUTHORIZATION, `Bearer ${FAKE_USER_JWT_TOKEN}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.USER_ID_MISMATCH);
        });

        it('should return a message that a user not found', async () => {
            const { user: { id }, accessToken: tokenForRequest } = await authService.signUp({ ...userFakeData });
            await userService.deleteById(id);

            const response = await supertest(app.instance)
                .delete(`/api/users/${id}`)
                .set('Accept', 'application/json')
                .set(HttpHeader.AUTHORIZATION, `Bearer ${tokenForRequest}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.NOT_FOUND);
            expect(error).toBe(ErrorMessage.NOT_FOUND);
        });
    });
});
