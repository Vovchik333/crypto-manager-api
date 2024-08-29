import supertest from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { 
    USER_OBJECT_ID, 
    updateUserInput,
    otherUserInput,
    signUpInput
} from "../../data/user";
import app from 'app';
import { ApiPath } from "@enums";
import { HttpCode, HttpHeader, HttpMethod } from "@lib/services/http";
import { hashService } from "@lib/services/hash";
import { OBJECT_ID_LENGTH } from "@constants";
import { ErrorMessage } from "@enums";
import { authService } from "@routes/auth";
import { userService, userRepository } from "@routes/user";

const usersPath = `${ApiPath.API}${ApiPath.USERS}`;

describe(`${usersPath} routes`, () => {
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

    describe(`${HttpMethod.GET} ${usersPath}${ApiPath.ID}`, () => {
        afterEach(async () => {
            await userRepository.deleteAll();
        });

        it('should return user', async () => {
            const { user: { id }, accessToken: tokenForRequest } = await authService.signUp({ ...signUpInput });

            const response = await supertest(app.instance)
                .get(`${usersPath}/${id}`)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${tokenForRequest}`);

            const user = response.body;
            
            expect(response.status).toBe(HttpCode.OK);

            expect(user.id.length).toBe(OBJECT_ID_LENGTH);
            expect(user.nickname).toBe(signUpInput.nickname);
            expect(user.email).toBe(signUpInput.email);
            expect(hashService.compare(signUpInput.password, user.password)).toBe(true);
        });

        it('should return a message that a user not authorized', async () => {
            const { user: { id } } = await authService.signUp({ ...signUpInput });

            const response = await supertest(app.instance)
                .get(`${usersPath}/${id}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.NOT_AUTHORIZED);
        });

        it('should return a message that a user ID mismatch', async () => {
            const {  accessToken } = await authService.signUp({ ...signUpInput });

            const response = await supertest(app.instance)
                .get(`${usersPath}/${USER_OBJECT_ID}`)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.USER_ID_MISMATCH);
        });

        it('should return a message that a user not found', async () => {
            const { user: { id }, accessToken: tokenForRequest } = await authService.signUp({ ...signUpInput });
            await userService.deleteById(id);

            const response = await supertest(app.instance)
                .get(`${usersPath}/${id}`)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${tokenForRequest}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.NOT_FOUND);
            expect(error).toBe(ErrorMessage.NOT_FOUND);
        });
    });

    describe(`${HttpMethod.PUT} ${usersPath}${ApiPath.ID}`, () => {
        afterEach(async () => {
            await userRepository.deleteAll();
        });

        it('should return updated user', async () => {
            const { user: { id }, accessToken: tokenForRequest } = await authService.signUp({ ...signUpInput });

            const response = await supertest(app.instance)
                .put(`${usersPath}/${id}`)
                .send({ ...updateUserInput })
                .set(HttpHeader.AUTHORIZATION, `Bearer ${tokenForRequest}`);

            const user = response.body;
            
            expect(response.status).toBe(HttpCode.OK);

            expect(user.id.length).toBe(OBJECT_ID_LENGTH);
            expect(user.nickname).toBe(updateUserInput.nickname);
            expect(user.email).toBe(updateUserInput.email);
            expect(hashService.compare(updateUserInput.password, user.password)).toBe(true);
        });

        it('should return a message that a user with the same mail already exists', async () => {
            await authService.signUp({ ...signUpInput });
            const { user: { id }, accessToken: tokenForRequest } = await authService.signUp({ ...otherUserInput });

            const response = await supertest(app.instance)
                .put(`${usersPath}/${id}`)
                .send({ ...updateUserInput, email: otherUserInput.email })
                .set(HttpHeader.AUTHORIZATION, `Bearer ${tokenForRequest}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.BAD_REQUEST);
            expect(error).toBe(ErrorMessage.USER_WITH_EXISTING_EMAIL);
        });

        it('should return a message that a user not authorized', async () => {
            const { user: { id } } = await authService.signUp({ ...signUpInput });

            const response = await supertest(app.instance)
                .put(`${usersPath}/${id}`)
                .send({ ...updateUserInput });

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.NOT_AUTHORIZED);
        });

        it('should return a message that a user ID mismatch', async () => {
            const { user: { id }, accessToken } = await authService.signUp({ ...signUpInput });

            const response = await supertest(app.instance)
                .put(`${usersPath}/${USER_OBJECT_ID}`)
                .send({ ...updateUserInput })
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.USER_ID_MISMATCH);
        });

        it('should return a message that a user not found', async () => {
            const { user: { id }, accessToken: tokenForRequest } = await authService.signUp({ ...signUpInput });
            await userService.deleteById(id);

            const response = await supertest(app.instance)
                .put(`${usersPath}/${id}`)
                .send({ ...updateUserInput })
                .set(HttpHeader.AUTHORIZATION, `Bearer ${tokenForRequest}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.NOT_FOUND);
            expect(error).toBe(ErrorMessage.NOT_FOUND);
        });
    });

    describe(`${HttpMethod.DELETE} ${usersPath}${ApiPath.ID}`, () => {
        afterEach(async () => {
            await userRepository.deleteAll();
        });

        it('should return deleted user', async () => {
            const { user: { id }, accessToken: tokenForRequest } = await authService.signUp({ ...signUpInput });

            const response = await supertest(app.instance)
                .delete(`${usersPath}/${id}`)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${tokenForRequest}`);

            const user = response.body;

            expect(response.status).toBe(HttpCode.OK);

            expect(user.id.length).toBe(OBJECT_ID_LENGTH);
        });

        it('should return a message that a user not authorized', async () => {
            const { user: { id } } = await authService.signUp({ ...signUpInput });

            const response = await supertest(app.instance)
                .delete(`${usersPath}/${id}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.NOT_AUTHORIZED);
        });

        it('should return a message that a user ID mismatch', async () => {
            const { accessToken: tokenForRequest } = await authService.signUp({ ...signUpInput });

            const response = await supertest(app.instance)
                .delete(`${usersPath}/${USER_OBJECT_ID}`)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${tokenForRequest}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.USER_ID_MISMATCH);
        });

        it('should return a message that a user not found', async () => {
            const { user: { id }, accessToken: tokenForRequest } = await authService.signUp({ ...signUpInput });
            await userService.deleteById(id);

            const response = await supertest(app.instance)
                .delete(`${usersPath}/${id}`)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${tokenForRequest}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.NOT_FOUND);
            expect(error).toBe(ErrorMessage.NOT_FOUND);
        });
    });
});
