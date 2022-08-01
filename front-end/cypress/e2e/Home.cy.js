import { faker } from "@faker-js/faker";

/// <reference types="cypress" />

beforeEach(() => {
  cy.resetDatabase()
});

describe("recommendations tests", () => {
    it("create recommendation succesfully", () => {
      cy.visit("http://localhost:3000/");
      cy.get('input[placeholder="Name"]').type(`${faker.random.word()}`);
      cy.get('input[placeholder="https://youtu.be/..."').type("https://www.youtube.com/watch?v=Yykfw9eNA5s");

      
      cy.intercept("POST", "/recommendations").as("sendRecommendation");
      cy.get("button").click();
      cy.wait("@sendRecommendation");

      cy.url().should("equal", "http://localhost:3000/");
    });

    it("create recommendation with invalid youtube link", () => {
      cy.visit("http://localhost:3000/");
      cy.get('input[placeholder="Name"]').type(`${faker.random.word()}`);
      cy.get('input[placeholder="https://youtu.be/..."').type("https://www.youtube");

      
      cy.intercept("POST", "/recommendations").as("sendRecommendation");
      cy.get("button").click();
      cy.wait("@sendRecommendation");

      cy.url().should("equal", "http://localhost:3000/");
      cy.get("div:last-child div").should("contain.text", "No recommendations yet! Create your own :)")
    });

    it("create recommendation with duplicated name", () => {
      const recommendation = {
             name: "music",
             youtubeLink: "https://www.youtube.com/watch?v=zDsE4BPuFRQ"
      }
      cy.visit("http://localhost:3000/");

      cy.createRecommendation(recommendation);

      cy.request({
        method: "POST",
        url: 'http://localhost:5000/recommendations', 
        failOnStatusCode: false,
        body: recommendation
      }).then((response) => {
        expect(response.status).to.eq(409);
        expect(response.body).to.eq("Recommendations names must be unique");
      });

      cy.on('window:alert',(t)=>{
        expect(t).to.contains('Error creating recommendation!');
     })
    });

    it("create recommendation with no data", () => {
      cy.visit("http://localhost:3000/");
      
      cy.get("button").click();

      cy.on("window:alert", (alert) => {
        expect(alert).to.contains("Error creating recommendation!");
      });

      cy.url().should("equal", "http://localhost:3000/");
      cy.get("div:last-child div").should("contain.text", "No recommendations yet! Create your own :)")
    });
});

describe("upvote and downvote tests", () => {
  it("upvote test", () => {
    const recommendation = {
      name: faker.random.word(),
      youtubeLink: "https://www.youtube.com/watch?v=zDsE4BPuFRQ"
    }

    cy.visit("http://localhost:3000/");
    cy.createRecommendation(recommendation);

    cy.get("div:last-child article:last-child svg:first-child",).click();
    cy.get("div:last-child article:last-child svg:first-child",).click();
    cy.get("div:last-child article:last-child svg:first-child",).click();
  });

  it("downvote test", () => {
    const recommendation = {
      name: faker.random.word(),
      youtubeLink: "https://www.youtube.com/watch?v=zDsE4BPuFRQ"
    }

    cy.visit("http://localhost:3000/");
    cy.createRecommendation(recommendation);

    cy.get("div:last-child article:last-child svg:last-child",).click();
    cy.get("div:last-child article:last-child svg:last-child",).click();
  });
});
