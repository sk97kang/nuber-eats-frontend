describe("Edit Profile", () => {
  const user = cy;

  beforeEach(() => {
    user.login("test@test.com", "test-password");
  });

  it("should go to /edit-profile useing the header", () => {
    user.get('a[href="/edit-profile/"]').click();
    user.assertTitle("Edit Profile | Nuber Eats");
  });

  it("should change email", () => {
    user.intercept("POST", "http://localhost:4000/graphql", req => {
      if (req.body?.operationName === "editProfile") {
        // @ts-ignore
        req.body?.variables?.input?.email = "test@test.com";
      }
    });

    user.visit("/edit-profile");
    user.assertTitle("Edit Profile | Nuber Eats");
    user.findByPlaceholderText(/email/i).clear().type("test@test.com");
    user.findByRole("button").click();
  });
});
