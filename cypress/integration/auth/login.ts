describe("Log In", () => {
  const user = cy;
  it("should see login page", () => {
    user.visit("/").title().should("eq", "Login | Nuber Eats");
  });

  it("should see email / password validation errors", () => {
    user.visit("/");
    user.findByPlaceholderText(/email/i).type("test");
    user.findByRole("alert").should("have.text", "Please enter a valid email");

    user.findByPlaceholderText(/email/i).clear();
    user.findByRole("alert").should("have.text", "Email is required");

    user.findByPlaceholderText(/email/i).type("test@client.com");
    user
      .findByPlaceholderText(/password/i)
      .type("12345")
      .clear();
    user.findByRole("alert").should("have.text", "Password is required");
  });

  it("should fill out the form and login", () => {
    user.login("test@test.com", "test-password");
  });
});
