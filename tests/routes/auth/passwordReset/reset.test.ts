describe("OnGet", () => {
    test.todo("EXPECT validator to be defined");

    test.todo("EXPECT router to be defined");

    test.todo("GIVEN user is logged in, EXPECT 403 error");

    test.todo("GIVEN user is not logged in, EXPECT view to be rendered");

    test.todo("GIVEN token is invalid, EXPECT 401 error");

    test.todo("GIVEN token is expired, EXPECT 401 error");

    test.todo("GIVEN token is not a password reset token, EXPECT 401 error");
});

describe("OnPost", () => {
    test.todo("EXPECT validator to be defined");

    test.todo("EXPECT router to be defined");

    test.todo("GIVEN session contains an error, EXPECT redirect to reset page");

    test.todo("GIVEN password is null, EXPECT validation error");

    test.todo("GIVEN password is too short, EXPECT validation error");

    test.todo("GIVEN password does not match passwordRepeat, EXPECT validation error");

    test.todo("GIVEN token is invalid, EXPECT 401 error");

    test.todo("GIVEN token is expired, EXPECT 401 error");

    test.todo("GIVEN token is not a password reset token, EXPECT 401 error");
});