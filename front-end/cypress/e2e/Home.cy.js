import { faker } from "@faker-js/faker";

/// <reference types="cypress" />

describe("recommendations tests", () => {
    beforeEach(() => {
      cy.resetDatabase()
    });

    it("create recommendation", () => {
      cy.visit("http://localhost:3000/");
      cy.get("input.sc-eCYdqJ:nth-child(1)").type(`${faker.random.word()}`);
      cy.get("input.sc-eCYdqJ:nth-child(2)").type("https://www.youtube.com/watch?v=Yykfw9eNA5s");
      
      cy.intercept("POST", "/recommendations").as("sendRecommendation");
      cy.get(".sc-jSMfEi.kVtkyd").click();
      cy.wait("@sendRecommendation");

      cy.url().should("equal", "http://localhost:3000/");
    });

    it("votes tests", () => {
      const recommendation = {
        name: faker.random.word(),
        youtubeLink: "https://www.youtube.com/watch?v=zDsE4BPuFRQ"
      }
  
      cy.visit("http://localhost:3000/");
      cy.createRecommendation(recommendation);

      cy.intercept("POST", "/recommendations/1/upvote").as("upvote");
      cy.get("div.sc-iBkjds:nth-child(3)  svg:nth-child(1)",).click();
      cy.wait("@upvote")
    })
});

// describe("", () => {
//   it("votes tests", () => {
//     const recommendation = {
//       name: faker.random.word(),
//       youtubeLink: "https://www.youtube.com/watch?v=zDsE4BPuFRQ"
//     }

//     cy.visit("http://localhost:3000/");
//     cy.createRecommendation(recommendation);
//     cy.get("div.sc-iBkjds:nth-child(3)  svg:nth-child(1)",).click();
//   })
// })
