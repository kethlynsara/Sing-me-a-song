import { Recommendation } from "@prisma/client";
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

describe("get recommendations", () => {
    it("get 10 recommendations", async () => {
        const recommendationData1 = recommendationFactory.validRecommendationData();
        const response1 = await supertest(app).post("/recommendations").send(recommendationData1);
        const recommendationData2 = recommendationFactory.validRecommendationData();
        const response2 = await supertest(app).post("/recommendations").send(recommendationData2);
        const recommendationData3 = recommendationFactory.validRecommendationData();
        const response3 = await supertest(app).post("/recommendations").send(recommendationData3);
        const recommendationData4 = recommendationFactory.validRecommendationData();
        const response4 = await supertest(app).post("/recommendations").send(recommendationData4);
        const recommendationData5 = recommendationFactory.validRecommendationData();
        const response5 = await supertest(app).post("/recommendations").send(recommendationData5);
        const recommendationData6 = recommendationFactory.validRecommendationData();
        const response6 = await supertest(app).post("/recommendations").send(recommendationData6);
        const recommendationData7 = recommendationFactory.validRecommendationData();
        const respons7 = await supertest(app).post("/recommendations").send(recommendationData7);
        const recommendationData8 = recommendationFactory.validRecommendationData();
        const response8 = await supertest(app).post("/recommendations").send(recommendationData8);
        const recommendationData9 = recommendationFactory.validRecommendationData();
        const response9 = await supertest(app).post("/recommendations").send(recommendationData9);
        const recommendationData10 = recommendationFactory.validRecommendationData();
        const response10 = await supertest(app).post("/recommendations").send(recommendationData10);
        const recommendationData11 = recommendationFactory.validRecommendationData();
        const response11 = await supertest(app).post("/recommendations").send(recommendationData11);


        const recommendations = await supertest(app).get("/recommendations");
        expect(recommendations.body.length).toEqual(10);

        recommendations.body.forEach((recommendation: Recommendation) => {
            expect(recommendation).not.toBe(null);
            expect(recommendation.id).not.toBe(null);
            expect(recommendation.name).not.toBe(null);
            expect(recommendation.score).not.toBe(null);
            expect(recommendation.youtubeLink).not.toBe(null);
        });
    });

    it("get recommendation by id", async () => {
        const recommendationData = recommendationFactory.validRecommendationData();
        await supertest(app).post("/recommendations").send(recommendationData);
        const recommendation = await recommendationFactory.findRecommendation(recommendationData.name);

        const response = await supertest(app).get(`/recommendations/${recommendation.id}`);
        expect(response.body).not.toBe(null);
        expect(response.body.id).not.toBe(null);
        expect(response.body.name).not.toBe(null);
        expect(response.body.score).not.toBe(null);
        expect(response.body.youtubeLink).not.toBe(null);
    })

    it("get recommendation with an invalid id", async () => {
        const recommendationData = recommendationFactory.validRecommendationData();
        await supertest(app).post("/recommendations").send(recommendationData);

        const response = await supertest(app).get(`/recommendations/${758}`);
        expect(response.statusCode).toBe(404);
    });
});

describe("get top recommendations", () => {
    it("get reccomendations with right amount parameter", async () => {
        const amount = 6;
        const recommendations = await recommendationFactory.insertMany(amount);
        console.log(recommendations[0].name)
        await prisma.recommendation.update({where: {name: recommendations[0].name}, 
            data: {
                score: {
                    increment: 5
                }
            }});
        await prisma.recommendation.update({where: {name: recommendations[1].name}, 
            data: {
                score: {
                    increment: 2
                    }
            }});
        await prisma.recommendation.update({where: {name: recommendations[2].name}, 
            data: {
                score: {
                    increment: 7
                    }
            }});
        await prisma.recommendation.update({where: {name: recommendations[3].name}, 
            data: {
                score: {
                    increment: 4
                }
            }});
        await prisma.recommendation.update({where: {name: recommendations[4].name}, 
            data: {
                score: {
                    increment: 10
            }
        }});
        await prisma.recommendation.update({where: {name: recommendations[5].name}, 
            data: {
                score: {
                    increment: 3
                }
        }});

        const topRecommendations = await supertest(app).get(`/recommendations/top/${amount}`);
        expect(topRecommendations.body.length).toEqual(amount);
        console.log(topRecommendations.body)
    });

    it("send string as amount parameter", async () => {
        await recommendationFactory.insertMany(2);
        const recommendation = await supertest(app).get(`/recommendations/top/wistle`)
        console.log('body', recommendation.body)
        expect(recommendation.statusCode).toBe(500);
    });

    it("send invalid amount parameter", async () => {
        const recommendation = await supertest(app).get(`/recommendations/top/${1}`)
        console.log('body', recommendation.body)
        expect(recommendation.body.length).toBe(0);
    });

    it("send no amount parameter", async () => {
        const recommendation = await supertest(app).get(`/recommendations/top/`)
        console.log('body', recommendation.body)
        expect(recommendation.statusCode).toBe(500);
    });
});

describe("get random recommendation", () => {
    it("should get one recommendation",async () => {
        await recommendationFactory.insertMany(2);
        const recommendation = await supertest(app).get("/recommendations/random");
        expect(recommendation).not.toBe(null);
    })
})

afterAll(async () => {
    await prisma.$disconnect();
});