import supertest from "supertest";
import mongoose from "mongoose";
import app from "app";
import { MongoMemoryServer } from "mongodb-memory-server";
import { userRepository } from "@routes/user";
import { authService } from "@routes/auth";
import { transactionService, transactionRepository } from "@routes/transaction";
import { assetInput, buyTransactionInput, sellTransactionInput, signUpInput } from "../../data";
import { ApiPath, ErrorMessage, TransactionType } from "@enums";
import { HttpCode, HttpHeader, HttpMethod } from "@lib/services/http";
import { OBJECT_ID_LENGTH } from "@constants";
import { Asset } from "@types";
import { assetRepository, assetService } from "@routes/asset";

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

    describe(`${HttpMethod.DELETE} ${transactionPath}${ApiPath.ID}`, () => {
        let asset: Asset;

        beforeAll(async () => {
            asset = await assetService.create(assetInput);
        });
        afterAll(async () => {
            await assetRepository.deleteAll();
        });
        afterEach(async () => {
            await transactionRepository.deleteAll();
        });

        it(`should return deleted ${TransactionType.BUY}-transaction`, async () => {
            const asset = await assetService.create(assetInput);
            const { id: transactionId } = await transactionService.create({ ...buyTransactionInput, assetId: asset.id });
            const authTransactionIdPath = getAuthTransactionIdPath(transactionId, userId);

            const response = await supertest(app.instance)
                .delete(authTransactionIdPath)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const updatedAsset = await assetService.getById(asset.id);

            const { id, quantity, pricePerCoin, type } = response.body;

            expect(response.status).toBe(HttpCode.OK);
            expect(id.length).toBe(OBJECT_ID_LENGTH);
            expect({ quantity, pricePerCoin, type }).toEqual(buyTransactionInput);
            expect(updatedAsset.holdings).toBe(0);
            expect(updatedAsset.invested).toBe(0);
        });

        it(`should return deleted ${TransactionType.SELL}-transaction`, async () => {
            const asset = await assetService.create(assetInput);
            const { id: transactionId } = await transactionService.create({ ...sellTransactionInput, assetId: asset.id });
            const authTransactionIdPath = getAuthTransactionIdPath(transactionId, userId);

            const response = await supertest(app.instance)
                .delete(authTransactionIdPath)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const updatedAsset = await assetService.getById(asset.id);

            const { id, quantity, pricePerCoin, type } = response.body;

            expect(response.status).toBe(HttpCode.OK);
            expect(id.length).toBe(OBJECT_ID_LENGTH);
            expect({ quantity: -quantity, pricePerCoin, type }).toEqual(sellTransactionInput);
            expect(updatedAsset.holdings).toBe(0);
            expect(updatedAsset.invested).toBe(0);
        });

        it('should return a message that a user not authorized', async () => {
            const { id: transactionId } = await transactionService.create({ ...buyTransactionInput, assetId: asset.id });
            const authTransactionIdPath = getAuthTransactionIdPath(transactionId, userId);

            const response = await supertest(app.instance)
                .delete(authTransactionIdPath);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.NOT_AUTHORIZED);
        });

        it('should return a message that a user ID mismatch', async () => {
            const { id: transactionId } = await transactionService.create({ ...buyTransactionInput, assetId: asset.id });
            const transactionIdPath = `${transactionPath}/${transactionId}`;

            const response = await supertest(app.instance)
                .delete(transactionIdPath)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.USER_ID_MISMATCH);
        });

        it('should return a message that a transaction not found', async () => {
            const { id: transactionId } = await transactionService.create({ ...buyTransactionInput, assetId: asset.id });
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
