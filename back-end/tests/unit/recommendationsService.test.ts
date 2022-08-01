import { jest } from "@jest/globals";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { recommendation, recommendations, recommendations30, recommendations70 } from "./factories/recommendationFactoryUnit.js";

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

    it("should get one recommendation", async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {return recommendations[3]});
        
        const promise = await recommendationService.getById(4);
        expect(recommendationRepository.find).toHaveBeenCalledTimes(1);
        expect(promise.name).not.toBe(null);
        expect(promise.youtubeLink).not.toBe(null);
        expect(promise.score).not.toBe(null);
    });

    it("should not get recommendation", async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {});
        
        const promise = recommendationService.getById(4);

        expect(promise).rejects.toEqual({message: "", type: "not_found"});
    });

    it("get random recommendation,", async () => {
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {return recommendations});

        const promise = await recommendationService.getRandom();     

        expect(promise).not.toBe(null);
        expect(promise.id).not.toBe(undefined);
        expect(promise.name).not.toBe(undefined);
        expect(promise.youtubeLink).not.toBe(undefined);
        expect(promise.score).not.toBe(undefined);
    });


    it("should get random recommendation, 30%", async () => {
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
            return recommendations30;
        });
        jest.spyOn(recommendationService, "getScoreFilter").mockImplementationOnce((): any => {return "lte"});
        
        const promise = await recommendationService.getRandom();     
        expect(promise).not.toBe(null);
        expect(promise.id).not.toBe(undefined);
        expect(promise.name).not.toBe(undefined);
        expect(promise.youtubeLink).not.toBe(undefined);
        expect(promise.score).toBeLessThanOrEqual(10);
        expect(promise.score).toBeGreaterThanOrEqual(-5);
    });

    it("should get random recommendation, 70%", async () => {
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
            return recommendations70;
        });
        jest.spyOn(recommendationService, "getScoreFilter").mockImplementationOnce((): any => {return "gt"});
        
        const promise = await recommendationService.getRandom();     
        expect(promise).not.toBe(null);
        expect(promise.id).not.toBe(undefined);
        expect(promise.name).not.toBe(undefined);
        expect(promise.youtubeLink).not.toBe(undefined);
        expect(promise.score).toBeGreaterThan(10);
    });
    
    it("get random recommendation, should fail", async () => {
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {return [{}]});
        
        const promise = await recommendationService.getRandom();       
        
        expect(promise.id).toBe(undefined);
        expect(promise.name).toBe(undefined);
        expect(promise.youtubeLink).toBe(undefined);
        expect(promise.score).toBe(undefined);
    });
    
    it("get top recommendations", async () => {
        const amount = 3;
        jest.spyOn(recommendationRepository, "getAmountByScore").mockImplementationOnce((): any => {
            return [
                recommendations[0],
                recommendations[1],
                recommendations[2]
            ]
        });

        const promise = await recommendationService.getTop(amount);       
        expect(promise).not.toBe(null);
        expect(promise.length).toEqual(amount);
    });    
});