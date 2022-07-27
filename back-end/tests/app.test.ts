import supertest from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/database.js"
import { recommendationFactory } from "./factories/recommendationFactory.js";

beforeEach(async () => {
    await prisma.$transaction([
        prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`
    ])
});

describe("post recommendations tests", () => {
    it("post invalid youtube link, should fail", async () => {
        const recommendationData = recommendationFactory.invalidRecommendationData();
        const response = await supertest(app).post("/recommendations").send(recommendationData);
        expect(response.statusCode).toBe(422);

        const recommendation = await recommendationFactory.findRecommendation(recommendationData.name);
        expect(recommendation).toBe(null);
    });

    it("post a valid recommendation", async () => {
        const recommendationData = recommendationFactory.validRecommendationData();
        const response = await supertest(app).post("/recommendations").send(recommendationData);
        expect(response.statusCode).toBe(201);

        const recommendation = await recommendationFactory.findRecommendation(recommendationData.name);
        expect(recommendation).not.toBe(null);
    });

    it("post name already registered, should fail", async () => {
        const recommendationData = recommendationFactory.validRecommendationData();
        const response = await supertest(app).post("/recommendations").send(recommendationData);
        expect(response.statusCode).toBe(201);

        const response2 = await supertest(app).post("/recommendations").send(recommendationData);
        expect(response2.statusCode).toBe(409);
    });
});

describe("update score tests", () => {
    it("send a valid id, should increment", async () => {
        const recommendationData = recommendationFactory.validRecommendationData();
        await supertest(app).post("/recommendations").send(recommendationData);
        const recommendation = await recommendationFactory.findRecommendation(recommendationData.name);

        const response = await supertest(app).post(`/recommendations/${recommendation.id}/upvote`);
        expect(response.statusCode).toBe(200);
        
        const updatedRecommendation = await recommendationFactory.findRecommendation(recommendationData.name);
        expect(updatedRecommendation.score).toBeGreaterThan(recommendation.score); 
    });

    it("send a valid id, should decrement", async () => {
        const recommendationData = recommendationFactory.validRecommendationData();
        await supertest(app).post("/recommendations").send(recommendationData);
        const recommendation = await recommendationFactory.findRecommendation(recommendationData.name);

        const response = await supertest(app).post(`/recommendations/${recommendation.id}/downvote`);
        expect(response.statusCode).toBe(200);
        
        const updatedRecommendation = await recommendationFactory.findRecommendation(recommendationData.name);
        expect(updatedRecommendation.score).toBeLessThan(recommendation.score); 
        expect(updatedRecommendation.score).toBeGreaterThan(-4);
    });

    it("send 6 downvotes, should fail", async () => {
        const recommendationData = recommendationFactory.validRecommendationData();
        await supertest(app).post("/recommendations").send(recommendationData);
        const recommendation = await recommendationFactory.findRecommendation(recommendationData.name);

        await supertest(app).post(`/recommendations/${recommendation.id}/downvote`);
        await supertest(app).post(`/recommendations/${recommendation.id}/downvote`);
        await supertest(app).post(`/recommendations/${recommendation.id}/downvote`);
        await supertest(app).post(`/recommendations/${recommendation.id}/downvote`);
        await supertest(app).post(`/recommendations/${recommendation.id}/downvote`);
        await supertest(app).post(`/recommendations/${recommendation.id}/downvote`);

        const recommendation2 = await recommendationFactory.findRecommendation(recommendationData.name);
        expect(recommendation2).toBe(null);    
    });

    it("send a invalid id, should fail", async () => {
        const response = await supertest(app).post(`/recommendations/${10}/upvote`);
        expect(response.statusCode).toBe(404);
    });

    it("send a invalid id, should fail", async () => {
        const response = await supertest(app).post(`/recommendations/${10}/downvote`);
        expect(response.statusCode).toBe(404);
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});