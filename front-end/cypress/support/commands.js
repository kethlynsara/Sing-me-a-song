Cypress.Commands.add("createRecommendation", (recommendation) => {
    cy.request("POST", "http://localhost:5000/recommendations", recommendation);
});

Cypress.Commands.add("resetDatabase", () => {
    cy.request("POST", "http://localhost:5000/recommendations/reset");
})