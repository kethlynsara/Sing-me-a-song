/// <reference types="cypress" />

describe("sign up tests", () => {
    it("sign up successfully", () => {
      cy.visit("http://localhost:3000/");
      cy.get("input.sc-eCYdqJ:nth-child(1)").type("Captured");
      cy.get("input.sc-eCYdqJ:nth-child(2)").type("https://www.youtube.com/watch?v=Yykfw9eNA5s");
      cy.get(".sc-jSMfEi.kVtkyd").click();
      // <div class="sc-hKMtZM btKrnz"><input type="text" placeholder="Name" class="sc-eCYdqJ DDugM" value=""><input type="text" placeholder="https://youtu.be/..." class="sc-eCYdqJ DDugM" value=""><button class="sc-jSMfEi kVtkyd"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" color="#fff" style="color: rgb(255, 255, 255);" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M400 160l64 64-64 64"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M448 224H154c-58.76 0-106 49.33-106 108v20"></path></svg></button></div>
    })
})
