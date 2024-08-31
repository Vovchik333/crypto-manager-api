import { ApiPath, ErrorMessage } from "@enums";
import { HttpCode, HttpHeader, HttpMethod } from "@lib/services/http";
import { assetRepository, assetService } from "@routes/asset";
import { authService } from "@routes/auth";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import supertest from "supertest";
import { assetInput, signUpInput } from "../../data";
import { userRepository } from "@routes/user";
import app from "app";
import { OBJECT_ID_LENGTH } from "@constants";
import { otherAssetInput } from "../../data/asset";

const assetPath = `${ApiPath.API}${ApiPath.ASSETS}`;
const getAuthAssetIdPath = (assetId: string, userId: string) => `${assetPath}/${assetId}?userId=${userId}`;

describe(`${assetPath} routes`, () => {
    let mongoMemoryServer: MongoMemoryServer;
    let accessToken: string;
    let userId: string;
    let authAssetPath: string;

    beforeAll(async () => {
        mongoMemoryServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoMemoryServer.getUri());

        const userWithToken = await authService.signUp(signUpInput);
        accessToken = userWithToken.accessToken;
        userId = userWithToken.user.id;
        authAssetPath = `${assetPath}?userId=${userId}`;
    });
    afterAll(async () => {
        await userRepository.deleteAll();
        await mongoose.connection.close();
        mongoMemoryServer.stop()    
    });

    describe(`${HttpMethod.POST} ${assetPath}`, () => {
        afterEach(async () => {
            await assetRepository.deleteAll();
        });

        it('should return created asset', async () => {
            const response = await supertest(app.instance)
                .post(authAssetPath)
                .send(assetInput)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const { id, createdAt, ...otherProps} = response.body;

            expect(response.status).toBe(HttpCode.CREATED);
            expect(id.length).toBe(OBJECT_ID_LENGTH);
            expect(otherProps).toEqual({...assetInput, holdings: 0, invested: 0 });
        });

        it('should return a message that a user not authorized', async () => {
            const response = await supertest(app.instance)
                .post(authAssetPath)
                .send(assetInput);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.NOT_AUTHORIZED);
        });

        it('should return a message that a user ID mismatch', async () => {
            const response = await supertest(app.instance)
                .post(assetPath)
                .send(assetInput)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.USER_ID_MISMATCH);
        });
    });

    describe(`${HttpMethod.GET} ${assetPath}`, () => {
        afterEach(async () => {
            await assetRepository.deleteAll();
        });

        it('should return assets by portfolioId', async () => {
            const asset = await assetService.create({ ...assetInput });
            const otherAsset = await assetService.create({ ...otherAssetInput });
            const query = `&portfolioId=${otherAsset.portfolioId}`;

            const response = await supertest(app.instance)
                .get(`${authAssetPath}${query}`)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const assets = response.body;

            expect(response.status).toBe(HttpCode.OK);
            expect(assets.length).toBe(1);
            expect(otherAsset.portfolioId).toBe(assets[0].portfolioId);
            expect(asset.portfolioId).not.toBe(assets[0].portfolioId);
        });

        it('should return a message that a user not authorized', async () => {
            await assetService.create({ ...assetInput });

            const response = await supertest(app.instance)
                .get(authAssetPath);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.NOT_AUTHORIZED);
        });

        it('should return a message that a user ID mismatch', async () => {
            await assetService.create({ ...assetInput });

            const response = await supertest(app.instance)
                .get(assetPath)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.USER_ID_MISMATCH);
        });
    });

    describe(`${HttpMethod.GET} ${assetPath}${ApiPath.ID}`, () => {
        afterEach(async () => {
            await assetRepository.deleteAll();
        });

        it('should return asset', async () => {
            const { id: assetId } = await assetService.create({ ...assetInput });
            const authAssetIdPath = getAuthAssetIdPath(assetId, userId);

            const response = await supertest(app.instance)
                .get(authAssetIdPath)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);
            
            const { id, createdAt, ...otherProps} = response.body;

            expect(response.status).toBe(HttpCode.OK);
            expect(id.length).toBe(OBJECT_ID_LENGTH);
            expect(otherProps).toEqual({ ...assetInput, holdings: 0, invested: 0});
        });

        it('should return a message that a user not authorized', async () => {
            const { id: assetId } = await assetService.create({ ...assetInput });
            const authAssetIdPath = getAuthAssetIdPath(assetId, userId);

            const response = await supertest(app.instance)
                .get(authAssetIdPath);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.NOT_AUTHORIZED);
        });

        it('should return a message that a user ID mismatch', async () => {
            const { id: assetId } = await assetService.create({ ...assetInput });
            const assetIdPath = `${assetPath}/${assetId}`;

            const response = await supertest(app.instance)
                .get(assetIdPath)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.USER_ID_MISMATCH);
        });

        it('should return a message that a asset not found', async () => {
            const { id: assetId } = await assetService.create({ ...assetInput });
            await assetRepository.deleteById(assetId);
            const authassetIdPath = getAuthAssetIdPath(assetId, userId);

            const response = await supertest(app.instance)
                .get(authassetIdPath)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.NOT_FOUND);
            expect(error).toBe(ErrorMessage.NOT_FOUND);
        });
    });

    describe(`${HttpMethod.DELETE} ${assetPath}${ApiPath.ID}`, () => {
        afterEach(async () => {
            await assetRepository.deleteAll();
        });

        it('should return deleted asset', async () => {
            const { id: assetId } = await assetService.create({ ...assetInput });
            const authAssetIdPath = getAuthAssetIdPath(assetId, userId);

            const response = await supertest(app.instance)
                .delete(authAssetIdPath)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);
            
            const { id, createdAt, ...otherProps} = response.body;

            expect(response.status).toBe(HttpCode.OK);
            expect(id.length).toBe(OBJECT_ID_LENGTH);
            expect(otherProps).toEqual({ ...assetInput, holdings: 0, invested: 0});
        });

        it('should return a message that a user not authorized', async () => {
            const { id: assetId } = await assetService.create({ ...assetInput });
            const authAssetIdPath = getAuthAssetIdPath(assetId, userId);

            const response = await supertest(app.instance)
                .delete(authAssetIdPath);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.NOT_AUTHORIZED);
        });

        it('should return a message that a user ID mismatch', async () => {
            const { id: assetId } = await assetService.create({ ...assetInput });
            const assetIdPath = `${assetPath}/${assetId}`;

            const response = await supertest(app.instance)
                .delete(assetIdPath)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.UNAUTHORIZED);
            expect(error).toBe(ErrorMessage.USER_ID_MISMATCH);
        });

        it('should return a message that a asset not found', async () => {
            const { id: assetId } = await assetService.create({ ...assetInput });
            const authassetIdPath = getAuthAssetIdPath(assetId, userId);
            await assetRepository.deleteById(assetId);

            const response = await supertest(app.instance)
                .delete(authassetIdPath)
                .set(HttpHeader.AUTHORIZATION, `Bearer ${accessToken}`);

            const { error } = response.body;
            
            expect(response.status).toBe(HttpCode.NOT_FOUND);
            expect(error).toBe(ErrorMessage.NOT_FOUND);
        });
    });
});