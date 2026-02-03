const uniqueId = Date.now();
describe("Full E2E Flow", () => {
  const user = {
    nickname: `Zack_${uniqueId}`,
    firstName: "zakaria",
    lastName: "bess",
    email: `zakaria_${uniqueId}@gmail.com`,
    password: "Password123!",
    confirmPassword: "Password123!",
  };

  it("Registers a new user", () => {
    cy.visit("/signup");

    cy.get("input[name=nickname]").type(user.nickname);
    cy.get("input[name=firstName]").type(user.firstName);
    cy.get("input[name=lastName]").type(user.lastName);
    cy.get("input[name=email]").type(user.email);
    cy.get("input[name=password]").type(user.password);
    cy.get("input[name=confirmPassword]").type(user.confirmPassword);

    cy.get("button[type=submit]").click();

    cy.url().should("include", "/login");
  });

  describe("User Actions after Login", () => {
    beforeEach("Logs in", () => {
      cy.session(user.nickname, () => {
        cy.visit("/login");

        cy.get("input[name=email]").type(user.email);
        cy.get("input[name=password]").type(user.password);
        cy.get("button[type=submit]").click();

        cy.url().should("eq", Cypress.config().baseUrl + "/");

        cy.window().should((win) => {
          const token = win.localStorage.getItem("jwtToken");
          expect(token).to.be.a("string").and.not.be.empty;
        });
      });
    });

    it("Creates a post and verifies it appears on the feed", () => {
      cy.visit("/addPost");

      cy.get("textarea#content")
        .should("be.visible")
        .type("This is a test post 🚀");
      cy.get("button#createPost").click();

      cy.get(".card-body")
        .first()
        .within(() => {
          cy.get("p").should("contain.text", "This is a test post");
        });
    });
    it("comment on a post", () => {
      cy.visit("/");
    });
  });
});
