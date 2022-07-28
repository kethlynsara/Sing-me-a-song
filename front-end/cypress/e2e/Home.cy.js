import { faker } from "@faker-js/faker";

/// <reference types="cypress" />

describe("recommendations tests", () => {
    it("create recommendation", () => {
      cy.visit("http://localhost:3000/");
      cy.get("input.sc-eCYdqJ:nth-child(1)").type(`${faker.random.word()}`);
      cy.get("input.sc-eCYdqJ:nth-child(2)").type("https://www.youtube.com/watch?v=Yykfw9eNA5s");
      
      cy.intercept("POST", "/recommendations").as("sendRecommendation");
      cy.get(".sc-jSMfEi.kVtkyd").click();
      cy.wait("@sendRecommendation");

      cy.url().should("equal", "http://localhost:3000/");
    });
})
