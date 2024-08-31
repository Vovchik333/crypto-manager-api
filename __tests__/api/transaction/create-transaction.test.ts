import supertest from "supertest";
import mongoose from "mongoose";
import app from "app";
import { MongoMemoryServer } from "mongodb-memory-server";
import { userRepository } from "@routes/user";
import { authService } from "@routes/auth";
import { transactionRepository } from "@routes/transaction";
import { buyTransactionInput, signUpInput, assetInput, sellTransactionInput } from "../../data";
import { ApiPath, ErrorMessage, TransactionType } from "@enums";
import { HttpCode, HttpHeader, HttpMethod } from "@lib/services/http";
import { OBJECT_ID_LENGTH } from "@constants";
import { assetRepository, assetService } from "@routes/asset";
import { Asset } from "@types";

const transactionPath = `${ApiPath.API}${ApiPath.TRANSACTIONS}`;

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

        it(`should return created ${TransactionType.BUY}-transaction`, async () => {
            const asset = await assetService.create(assetInput);

            const response = await supertest(app.instance)
                .post(authTransactionPath)
                .send({ ...buyTransactionInput, assetId: asset.id })
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);
            
            const updatedAsset = await assetService.getById(asset.id);

            const { id, quantity, pricePerCoin, type } = response.body;

            expect(response.status).toBe(HttpCode.CREATED);
            expect(id.length).toBe(OBJECT_ID_LENGTH);
            expect({ quantity, pricePerCoin, type }).toEqual(buyTransactionInput);
            expect(updatedAsset.holdings).toBe(quantity);
            expect(updatedAsset.invested).toBe(quantity * pricePerCoin);
        });

        it(`should return created ${TransactionType.SELL}-transaction`, async () => {
            const asset = await assetService.create(assetInput);

            const response = await supertest(app.instance)
                .post(authTransactionPath)
                .send({ ...sellTransactionInput, assetId: asset.id })
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);
            
            const updatedAsset = await assetService.getById(asset.id);

            const { id, quantity, pricePerCoin, type } = response.body;

            expect(response.status).toBe(HttpCode.CREATED);
            expect(id.length).toBe(OBJECT_ID_LENGTH);
            expect({ quantity: -quantity, pricePerCoin, type }).toEqual(sellTransactionInput);
            expect(updatedAsset.holdings).toBe(quantity);
            expect(updatedAsset.invested).toBe(quantity * pricePerCoin);
        });

        it('should return a message that a user not authorized', async () => {
            const response = await supertest(app.instance)
                .post(authTransactionPath)
                .send({ ...buyTransactionInput, assetId: asset.id });

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.NOT_AUTHORIZED);
        });

        it('should return a message that a user ID mismatch', async () => {
            const response = await supertest(app.instance)
                .post(transactionPath)
                .send({ ...buyTransactionInput, assetId: asset.id })
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.USER_ID_MISMATCH);
        });
    });
});
