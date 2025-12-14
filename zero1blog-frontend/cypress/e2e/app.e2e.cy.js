// // npx cypress open

// describe("Full E2E Flow", () => {
//   const user = {
//     nickname: "Zack6",
//     firstName: "zakaria",
//     lastName: "bess",
//     email: "zakaria5_bess@gmail.com",
//     password: "Password123!",
//     confirmPassword: "Password123!",
//   };

//   it("Registers a new user", () => {
//     cy.visit("/signup");

//     cy.get("input[name=nickname]").type(user.nickname);
//     cy.get("input[name=firstName]").type(user.firstName);
//     cy.get("input[name=lastName]").type(user.lastName);
//     cy.get("input[name=email]").type(user.email);
//     cy.get("input[name=password]").type(user.password);
//     cy.get("input[name=confirmPassword]").type(user.confirmPassword);

//     cy.get("button[type=submit]").click();

//     cy.url().should("include", "/login");
//   });

//   let postId = null;

//   beforeEach("Logs in", () => {
//     cy.session("login", () => {
//       cy.visit("/login");

//       cy.get("input[name=email]").type(user.email);
//       cy.get("input[name=password]").type(user.password);

//       cy.get("button[type=submit]").click();

//       cy.url().should("include", "/");

//       cy.window().then((win) => {
//         const token = win.localStorage.getItem("jwtToken");
//         expect(token).to.exist;
//       });
//     });

//     it("Creates a post", () => {
//       cy.visit("/");

//       cy.get("textarea#title").type("This is a test post 🚀");
//       cy.get("button#createPost").click();

//       cy.get(".post").first().as("newPost");
//       cy.get("@newPost")
//         .find("p")
//         .should("contain.text", "This is a test post");
//     });
//     // cy.get("@newPost")
//     //   .invoke("attr", "data-id")
//     //   .then((id) => (postId = Number(id)));
//   });

//   // it("Likes the post", () => {
//   //   cy.get(`.post[data-id="${postId}"] .like-btn`).click();

//   //   cy.get(`.post[data-id="${postId}"]`).should("contain.text", "1 like");
//   // });

//   // it("Adds a comment", () => {
//   //   cy.get(`.post[data-id="${postId}"] .comments-btn`).click();

//   //   cy.get("textarea[name=comment]").type("Nice post!");
//   //   cy.get("button#sendComment").click();

//   //   cy.get(".comment").should("contain.text", "Nice post!");
//   // });

//   // it("Deletes the post", () => {
//   //   cy.get(`.post[data-id="${postId}"] .delete-btn`).click();
//   //   cy.get(".confirmDelete").click();

//   //   cy.get(`.post[data-id="${postId}"]`).should("not.exist");
//   // });
// });

describe("Full E2E Flow", () => {
  const user = {
    nickname: "Zack6",
    firstName: "zakaria",
    lastName: "bess",
    email: "zakaria5_bess@gmail.com",
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

  beforeEach("Logs in", () => {
    cy.session("login", () => {
      cy.visit("/login");

      cy.get("input[name=email]").type(user.email);
      cy.get("input[name=password]").type(user.password);

      cy.get("button[type=submit]").click();

      cy.url().should("include", "/");

      cy.window().then((win) => {
        expect(win.localStorage.getItem("jwtToken")).to.exist;
      });
    });
  });

  it("Creates a post", () => {
    cy.visit("/");

    cy.get("textarea#title").type("This is a test post 🚀");
    cy.get("button#createPost").click();

    cy.get(".post").first().as("newPost");
    cy.get("@newPost").find("p").should("contain.text", "This is a test post");
  });
});
