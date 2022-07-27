import supertest from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/database.js"

const RIGHT_LINK = "https://www.youtube.com/watch?v=rdgMPa8C-dc"
const WRONG_LINK = "https://www.youtube"

beforeEach(async () => {
    await prisma.$executeRaw`DELETE FROM recommendations`;
});

describe("recommendations tests", () => {
    it("post a wrong recommendation, should fail", async () => {
        const response = await supertest(app).post("/recommendations").send({name: "wrong music", youtubeLink: WRONG_LINK});
        expect(response.statusCode).toBe(422);

        const recommendation = await prisma.recommendation.findFirst({where: {name: "wrong music"}});
        expect(recommendation).not.toBeNull;
    })
});

afterAll(async () => {
    await prisma.$disconnect();
});