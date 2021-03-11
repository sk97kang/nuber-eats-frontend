describe("Create Account", () => {
  const user = cy;
  it("should see create account page", () => {
    user.visit("/");
    user
      .findByText(/create an account/i)
      .click()
      .title()
      .should("eq", "Create Account | Nuber Eats");
  });

  it("should see email / password validation errors", () => {
    user.visit("/create-account");

    user.findByPlaceholderText(/email/i).type("test@test");
    user.findByRole("alert").should("have.text", "Please enter a valid email");

    user.findByPlaceholderText(/email/i).clear();
    user.findByRole("alert").should("have.text", "Email is required");

    user.findByPlaceholderText(/email/i).type("test@test.com");
    user
      .findByPlaceholderText(/password/i)
      .type("test")
      .clear();
    user.findByRole("alert").should("have.text", "Password is required");
  });

  it("should be able to create account and login", () => {
    user.intercept("http://localhost:4000/graphql", req => {
      const { operationName } = req.body;
      if (operationName && operationName === "createAccountMutation") {
        req.reply(res => {
          res.send({ fixture: "auth/create-account.json" });
        });
      }
    });
    user.visit("/create-account");
    user.findByPlaceholderText(/email/i).type("test@test.com");
    user.findByPlaceholderText(/password/i).type("test-password");
    user.findByRole("button").click();
    user.login("test@test.com", "test-password");
  });
});
