import supertest from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/database.js"
import { recommendationFactory } from "./factories/recommendationFactory.js";

beforeEach(async () => {
    await prisma.$transaction([
        prisma.$executeRaw`TRUNCATE TABLE recommendations`
    ])
});

describe("post recommendations tests", () => {
    it("post invalid youtube link, should fail", async () => {
        const recommendationData = recommendationFactory.invalidRecommendationData();
        const response = await supertest(app).post("/recommendations").send(recommendationData);
        expect(response.statusCode).toBe(422);

        const recommendation = await recommendationFactory.findRecommendation(recommendationData.name);
        expect(recommendation).toBeNull;
    });

    it("post a valid recommendation", async () => {
        const recommendationData = recommendationFactory.validRecommendationData();
        const response = await supertest(app).post("/recommendations").send(recommendationData);
        expect(response.statusCode).toBe(201);

        const recommendation = await prisma.recommendation.findFirst({where: {name: recommendationData.name}});
        expect(recommendation).not.toBeNull;
    });

    it("post name already registered, should fail", async () => {
        const recommendationData = recommendationFactory.validRecommendationData();
        const response = await supertest(app).post("/recommendations").send(recommendationData);
        expect(response.statusCode).toBe(201);

        const response2 = await supertest(app).post("/recommendations").send(recommendationData);
        expect(response2.statusCode).toBe(409);
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});