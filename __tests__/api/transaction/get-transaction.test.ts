import supertest from "supertest";
import mongoose from "mongoose";
import app from "app";
import { MongoMemoryServer } from "mongodb-memory-server";
import { userRepository } from "@routes/user";
import { authService } from "@routes/auth";
import { transactionService, transactionRepository } from "@routes/transaction";
import { buyTransactionInput, signUpInput, assetInput } from "../../data";
import { ApiPath, ErrorMessage } from "@enums";
import { HttpCode, HttpHeader, HttpMethod } from "@lib/services/http";
import { OBJECT_ID_LENGTH } from "@constants";
import { assetService } from "@routes/asset";
import { Asset } from "@types";
import { otherAssetInput } from "../../data/asset";

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

    describe(`${HttpMethod.GET} ${transactionPath}`, () => {
        let asset: Asset;
        let otherAsset: Asset;

        beforeAll(async () => {
            asset = await assetService.create(assetInput);
            otherAsset = await assetService.create(otherAssetInput);
        });
        afterEach(async () => {
            await transactionRepository.deleteAll();
        });

        it('should return transactions by assetId', async () => {
            const transaction = await transactionService.create({ ...buyTransactionInput, assetId: asset.id });
            const otherTransaction = await transactionService.create({ ...buyTransactionInput, assetId: otherAsset.id });
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
            await transactionService.create({ ...buyTransactionInput, assetId: asset.id });

            const response = await supertest(app.instance)
                .get(authTransactionPath);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.NOT_AUTHORIZED);
        });

        it('should return a message that a user ID mismatch', async () => {
            await transactionService.create({ ...buyTransactionInput, assetId: asset.id });

            const response = await supertest(app.instance)
                .get(transactionPath)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.USER_ID_MISMATCH);
        });
    });

    describe(`${HttpMethod.GET} ${transactionPath}${ApiPath.ID}`, () => {
        let asset: Asset;

        beforeAll(async () => {
            asset = await assetService.create(assetInput);
        });
        afterEach(async () => {
            await transactionRepository.deleteAll();
        });

        it('should return transaction', async () => {
            const { id: transactionId } = await transactionService.create({ ...buyTransactionInput, assetId: asset.id });
            const authTransactionIdPath = getAuthTransactionIdPath(transactionId, userId);

            const response = await supertest(app.instance)
                .get(authTransactionIdPath)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);
            
            const { id, type, pricePerCoin, quantity } = response.body;

            expect(response.status).toBe(HttpCode.OK);
            expect(id.length).toBe(OBJECT_ID_LENGTH);
            expect({ type, pricePerCoin, quantity }).toEqual(buyTransactionInput);
        });

        it('should return a message that a user not authorized', async () => {
            const { id: transactionId } = await transactionService.create({ ...buyTransactionInput, assetId: asset.id });
            const authTransactionIdPath = getAuthTransactionIdPath(transactionId, userId);

            const response = await supertest(app.instance)
                .get(authTransactionIdPath);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.NOT_AUTHORIZED);
        });

        it('should return a message that a user ID mismatch', async () => {
            const { id: transactionId } = await transactionService.create({ ...buyTransactionInput, assetId: asset.id });
            const transactionIdPath = `${transactionPath}/${transactionId}`;

            const response = await supertest(app.instance)
                .get(transactionIdPath)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.USER_ID_MISMATCH);
        });

        it('should return a message that a transaction not found', async () => {
            const { id: transactionId } = await transactionService.create({ ...buyTransactionInput, assetId: asset.id });
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
});