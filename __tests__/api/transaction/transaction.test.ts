import supertest from "supertest";
import mongoose from "mongoose";
import app from "app";
import { MongoMemoryServer } from "mongodb-memory-server";
import { transactionRepository, userRepository } from "@repositories";
import { authService, transactionService } from "@services";
import { transactionInput, signUpInput, otherTransactionInput, transactionUpdateInput } from "../../data";
import { ApiPath, ErrorMessage, HttpCode, HttpHeader, HttpMethod } from "@enums";
import { OBJECT_ID_LENGTH } from "@constants";

const transactionPath = `${ApiPath.API}${ApiPath.TRANSACTIONS}`;
const getAuthTransactionIdPath = (transactionId: string, userId: string) => `${transactionPath}/${transactionId}?userId=${userId}`;

describe(`${transactionPath} routes`, () => {
    let mongoMemoryServer: MongoMemoryServer;
    let accessToken: string;
    let userId: string;
    let authTransactionPath: string;

    beforeAll(async () => {
        mongoMemoryServer = await MongoMemoryServer.create();

        mongoose.connect(mongoMemoryServer.getUri());

        const userWithToken = await authService.signUp(signUpInput);
        accessToken = userWithToken.accessToken;
        userId = userWithToken.user.id;
        authTransactionPath = `${transactionPath}?userId=${userId}`;
    });

    afterAll(async () => {
        await userRepository.deleteAll();
        await mongoose.connection.close();
        await mongoMemoryServer.stop();
    });

    describe(`${HttpMethod.POST} ${transactionPath}`, () => {
        afterEach(async () => {
            await transactionRepository.deleteAll();
        });

        it('should return created transaction', async () => {
            const response = await supertest(app.instance)
                .post(authTransactionPath)
                .send(transactionInput)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const { id, createdAt, ...otherProps} = response.body;

            expect(response.status).toBe(HttpCode.CREATED);
            expect(id.length).toBe(OBJECT_ID_LENGTH);
            expect(otherProps).toEqual(transactionInput);
        });

        it('should return a message that a user not authorized', async () => {
            const response = await supertest(app.instance)
                .post(authTransactionPath)
                .send(transactionInput);;

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.NOT_AUTHORIZED);
        });

        it('should return a message that a user ID mismatch', async () => {
            const response = await supertest(app.instance)
                .post(transactionPath)
                .send(transactionInput)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.USER_ID_MISMATCH);
        });
    });

    describe(`${HttpMethod.GET} ${transactionPath}`, () => {
        afterEach(async () => {
            await transactionRepository.deleteAll();
        });

        it('should return transactions by assetId', async () => {
            const transaction = await transactionService.create({ ...transactionInput });
            const otherTransaction = await transactionService.create({ ...otherTransactionInput });
            const query = `&assetId=${otherTransaction.assetId}`;

            const response = await supertest(app.instance)
                .get(`${authTransactionPath}${query}`)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const transactions = response.body;

            expect(response.status).toBe(HttpCode.OK);
            expect(transactions.length).toBe(1);
            expect(otherTransaction.assetId).toBe(transactions[0].assetId);
            expect(transaction.assetId).not.toBe(transactions[0].assetId);
        });

        it('should return a message that a user not authorized', async () => {
            await transactionService.create({ ...transactionInput });

            const response = await supertest(app.instance)
                .get(authTransactionPath);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.NOT_AUTHORIZED);
        });

        it('should return a message that a user ID mismatch', async () => {
            await transactionService.create({ ...transactionInput });

            const response = await supertest(app.instance)
                .get(transactionPath)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.USER_ID_MISMATCH);
        });
    });

    describe(`${HttpMethod.GET} ${transactionPath}${ApiPath.ID}`, () => {
        afterEach(async () => {
            await transactionRepository.deleteAll();
        });

        it('should return transaction', async () => {
            const { id: transactionId } = await transactionService.create({ ...transactionInput });
            const authTransactionIdPath = getAuthTransactionIdPath(transactionId, userId);

            const response = await supertest(app.instance)
                .get(authTransactionIdPath)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);
            
            const { id, createdAt, ...otherProps} = response.body;

            expect(response.status).toBe(HttpCode.OK);
            expect(id.length).toBe(OBJECT_ID_LENGTH);
            expect(otherProps).toEqual(transactionInput);
        });

        it('should return a message that a user not authorized', async () => {
            const { id: transactionId } = await transactionService.create({ ...transactionInput });
            const authTransactionIdPath = getAuthTransactionIdPath(transactionId, userId);

            const response = await supertest(app.instance)
                .get(authTransactionIdPath);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.NOT_AUTHORIZED);
        });

        it('should return a message that a user ID mismatch', async () => {
            const { id: transactionId } = await transactionService.create({ ...transactionInput });
            const transactionIdPath = `${transactionPath}/${transactionId}`;

            const response = await supertest(app.instance)
                .get(transactionIdPath)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.USER_ID_MISMATCH);
        });

        it('should return a message that a transaction not found', async () => {
            const { id: transactionId } = await transactionService.create({ ...transactionInput });
            await transactionRepository.deleteById(transactionId);
            const authTransactionIdPath = getAuthTransactionIdPath(transactionId, userId);

            const response = await supertest(app.instance)
                .get(authTransactionIdPath)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.NOT_FOUND);
            expect(error).toBe(ErrorMessage.NOT_FOUND);
        });
    });

    describe(`${HttpMethod.PUT} ${transactionPath}${ApiPath.ID}`, () => {
        afterEach(async () => {
            await transactionRepository.deleteAll();
        });

        it('should return updated transaction', async () => {
            const { id: transactionId } = await transactionService.create({ ...transactionInput });
            const authTransactionIdPath = getAuthTransactionIdPath(transactionId, userId);

            const response = await supertest(app.instance)
                .put(authTransactionIdPath)
                .send(transactionUpdateInput)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);
            
            const { pricePerCoin, quantity} = response.body;

            expect(response.status).toBe(HttpCode.OK);
            expect(pricePerCoin).toBe(transactionUpdateInput.pricePerCoin);
            expect(quantity).toBe(transactionUpdateInput.quantity);
        });

        it('should return a message that a user not authorized', async () => {
            const { id: transactionId } = await transactionService.create({ ...transactionInput });
            const authTransactionIdPath = getAuthTransactionIdPath(transactionId, userId);

            const response = await supertest(app.instance)
                .put(authTransactionIdPath)
                .send(transactionUpdateInput);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.NOT_AUTHORIZED);
        });

        it('should return a message that a user ID mismatch', async () => {
            const { id: transactionId } = await transactionService.create({ ...transactionInput });
            const transactionIdPath = `${transactionPath}/${transactionId}`;

            const response = await supertest(app.instance)
                .put(transactionIdPath)
                .send(transactionUpdateInput)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.USER_ID_MISMATCH);
        });

        it('should return a message that a transaction not found', async () => {
            const { id: transactionId } = await transactionService.create({ ...transactionInput });
            const authTransactionIdPath = getAuthTransactionIdPath(transactionId, userId);
            await transactionRepository.deleteById(transactionId);

            const response = await supertest(app.instance)
                .put(authTransactionIdPath)
                .send(transactionUpdateInput)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.NOT_FOUND);
            expect(error).toBe(ErrorMessage.NOT_FOUND);
        });
    });

    describe(`${HttpMethod.DELETE} ${transactionPath}${ApiPath.ID}`, () => {
        afterEach(async () => {
            await transactionRepository.deleteAll();
        });

        it('should return deleted transaction', async () => {
            const { id: transactionId } = await transactionService.create({ ...transactionInput });
            const authTransactionIdPath = getAuthTransactionIdPath(transactionId, userId);

            const response = await supertest(app.instance)
                .delete(authTransactionIdPath)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);
            
            const { id, createdAt, ...otherProps} = response.body;

            expect(response.status).toBe(HttpCode.OK);
            expect(id.length).toBe(OBJECT_ID_LENGTH);
            expect(otherProps).toEqual(transactionInput);
        });

        it('should return a message that a user not authorized', async () => {
            const { id: transactionId } = await transactionService.create({ ...transactionInput });
            const authTransactionIdPath = getAuthTransactionIdPath(transactionId, userId);

            const response = await supertest(app.instance)
                .delete(authTransactionIdPath);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.NOT_AUTHORIZED);
        });

        it('should return a message that a user ID mismatch', async () => {
            const { id: transactionId } = await transactionService.create({ ...transactionInput });
            const transactionIdPath = `${transactionPath}/${transactionId}`;

            const response = await supertest(app.instance)
                .delete(transactionIdPath)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.USER_ID_MISMATCH);
        });

        it('should return a message that a transaction not found', async () => {
            const { id: transactionId } = await transactionService.create({ ...transactionInput });
            const authTransactionIdPath = getAuthTransactionIdPath(transactionId, userId);
            await transactionRepository.deleteById(transactionId);

            const response = await supertest(app.instance)
                .delete(authTransactionIdPath)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.NOT_FOUND);
            expect(error).toBe(ErrorMessage.NOT_FOUND);
        });
    });
});
