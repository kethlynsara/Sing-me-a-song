import supertest from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/database.js"

const RIGHT_LINK = "https://www.youtube.com/watch?v=rdgMPa8C-dc"
const WRONG_LINK = "https://www.youtube"

beforeEach(async () => {
    await prisma.$executeRaw`DELETE FROM recommendations`;
});

describe("post recommendations tests", () => {
    it("post a wrong youtube link, should fail", async () => {
        const response = await supertest(app).post("/recommendations").send({name: "wrong music", youtubeLink: WRONG_LINK});
        expect(response.statusCode).toBe(422);

        const recommendation = await prisma.recommendation.findFirst({where: {name: "wrong music"}});
        expect(recommendation).not.toBeNull;
    })

    it("post a right recommendation", async () => {
        const response = await supertest(app).post("/recommendations").send({name: "right music", youtubeLink: RIGHT_LINK});
        expect(response.statusCode).toBe(201);

        const recommendation = await prisma.recommendation.findFirst({where: {name: "right music"}});
        expect(recommendation).not.toBeNull;
    })
});

afterAll(async () => {
    await prisma.$disconnect();
});