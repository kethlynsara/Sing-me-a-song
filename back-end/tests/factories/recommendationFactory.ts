import { faker } from "@faker-js/faker";
import { Recommendation } from "@prisma/client";
import { prisma } from "../../src/database.js";

export type RecommendationData = Omit<Recommendation, "id" | "score">;

function validRecommendationData() {
    return {
        name: faker.random.word(),
        youtubeLink: `https://www.youtube.com/${faker.random.word()}`
    }
}


function invalidRecommendationData() {
    return {
        name: faker.random.word(),
        youtubeLink: faker.internet.url()
    }
}

async function findRecommendation(name: string) {
    return await prisma.recommendation.findFirst({where: {name}});
}

async function insertMany(qtd: number) {
    const data = [];
    for (let i = 0; i < qtd; i++) {
        data.push(validRecommendationData())
    }

    await prisma.recommendation.createMany({data});
    return data;
}

export const recommendationFactory = {
    validRecommendationData,
    invalidRecommendationData,
    findRecommendation,
    insertMany
}