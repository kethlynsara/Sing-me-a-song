import { faker } from "@faker-js/faker";

/// <reference types="cypress" />

beforeEach(() => {
  cy.resetDatabase()
});

describe("top recommendations tests", () => {
    it("upvote test", () => {
      const recommendation = {
        name: faker.random.word(),
        youtubeLink: "https://www.youtube.com/watch?v=zDsE4BPuFRQ"
      }
  
      cy.visit("http://localhost:3000/");
      cy.createRecommendation(recommendation);
      cy.createRecommendation({
        name: faker.random.word(),
        youtubeLink: "https://www.youtube.com/watch?v=zDsE4BPuFRQ"
      });

      cy.get("article:last-child svg:first-child").click();
      cy.get("article:last-child svg:first-child").click();  
      cy.get("div:last-child article:last-child svg:first-child").click();
      cy.get("div:last-child article:last-child svg:first-child").click();

      cy.get("div").contains("Top").click();      

      cy.url().should("equal", "http://localhost:3000/top");
    });
  });
  