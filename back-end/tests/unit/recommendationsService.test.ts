import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { CreateRecommendationData, recommendationService } from "../../src/services/recommendationsService.js";

const recommendation: CreateRecommendationData = {
    name: faker.random.word(),
    youtubeLink: "https://www.youtube.com/watch?v=zDsE4BPuFRQ"
}

const recommendations = [
    {
        id: 1,
        name: faker.random.word(),
        youtubeLink: "https://www.youtube.com/watch?v=zDsE4BPuFRQ",
        score: 1
    },
    {
        id: 2,
        name: faker.random.word(),
        youtubeLink: "https://www.youtube.com/watch?v=zDsE4BPuFRQ",
        score: 1
    },
    {
        id: 3,
        name: faker.random.word(),
        youtubeLink: "https://www.youtube.com/watch?v=zDsE4BPuFRQ",
        score: 1
    },
    {
        id: 4,
        name: faker.random.word(),
        youtubeLink: "https://www.youtube.com/watch?v=zDsE4BPuFRQ",
        score: 1
    },
    {
        id: 5,
        name: faker.random.word(),
        youtubeLink: "https://www.youtube.com/watch?v=zDsE4BPuFRQ",
        score: 1
    },
    {
        id: 6,
        name: faker.random.word(),
        youtubeLink: "https://www.youtube.com/watch?v=zDsE4BPuFRQ",
        score: 1
    },
    {
        id: 7,
        name: faker.random.word(),
        youtubeLink: "https://www.youtube.com/watch?v=zDsE4BPuFRQ",
        score: 1
    },
    {
        id: 8,
        name: faker.random.word(),
        youtubeLink: "https://www.youtube.com/watch?v=zDsE4BPuFRQ",
        score: 1
    },
    {
        id: 9,
        name: faker.random.word(),
        youtubeLink: "https://www.youtube.com/watch?v=zDsE4BPuFRQ",
        score: 1
    },
    {
        id: 10,
        name: faker.random.word(),
        youtubeLink: "https://www.youtube.com/watch?v=zDsE4BPuFRQ",
        score: 1
    }
];

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

describe("recommendations test suit", () => {
    it("should create a recommendation", async () => {
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => {});
        jest.spyOn(recommendationRepository, "create").mockImplementationOnce((): any => {});

        await recommendationService.insert(recommendation);

        expect(recommendationRepository.findByName).toBeCalled
        expect(recommendationRepository.create).toBeCalled
    });

    it("should not create a duplicated recommendation", async () => {
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => { return {
            id: 1,
            name: "Beautiful - Hulvey",
            youtubeLink: "https://www.youtube.com/watch?v=zDsE4BPuFRQ",
            score: 0
        }});
        jest.spyOn(recommendationRepository, "create").mockImplementationOnce((): any => {});

        const promise = recommendationService.insert(recommendation);

        expect(promise).rejects.toEqual({ message: "Recommendations names must be unique", type: "conflict" });
    });
    
    it("should insert upvote", async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => { return {
            id: 1,
            name: "Beautiful - Hulvey",
            youtubeLink: "https://www.youtube.com/watch?v=zDsE4BPuFRQ",
            score: 0
        }});
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {});
        
        recommendationService.upvote(1);
        
        expect(recommendationRepository.find).toBeCalled;
        expect(recommendationRepository.updateScore).toBeCalled;
    });

    it("should not insert upvote", async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {});
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {});
        
        const promise = recommendationService.upvote(1);
    
        expect(promise).rejects.toEqual({message: "", type: "not_found"});
    });

    it("should insert downvote, score >= -5", async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => { return {
            id: 1,
            name: "Beautiful - Hulvey",
            youtubeLink: "https://www.youtube.com/watch?v=zDsE4BPuFRQ",
            score: 0
        }});
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {return {score: 10}});
        jest.spyOn(recommendationRepository, "remove").mockImplementationOnce((): any => {});

        await recommendationService.downvote(1);
        
        expect(recommendationRepository.updateScore).toHaveBeenCalled;
        expect(recommendationRepository.remove).not.toBeCalledTimes(1);
    });

    it("should insert downvote, score < -5", async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => { return {
            id: 1,
            name: "Beautiful - Hulvey",
            youtubeLink: "https://www.youtube.com/watch?v=zDsE4BPuFRQ",
            score: 0
        }});
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {return {score: -10}});
        jest.spyOn(recommendationRepository, "remove").mockImplementationOnce((): any => {});

        await recommendationService.downvote(1);
        
        expect(recommendationRepository.updateScore).toBeCalled;
        expect(recommendationRepository.remove).toBeCalledTimes(1);
    });

    it("should not insert downvote", async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {});
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {});
        jest.spyOn(recommendationRepository, "remove").mockImplementationOnce((): any => {});

        const promise = recommendationService.downvote(1);
        
        expect(recommendationRepository.updateScore).not.toBeCalledTimes(1);
        expect(recommendationRepository.remove).not.toBeCalledTimes(1);
        expect(promise).rejects.toEqual({message: "", type: "not_found"});
    });

    it("should get 10 recommendations", async () => {
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => { return recommendations});
        
        const promise = await recommendationService.get();
        expect(promise.length).toEqual(10);
    });

    it("should get none recommendations", async () => {
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {return []});
        
        const promise = await recommendationService.get();
        expect(promise.length).toEqual(0);
    });
});