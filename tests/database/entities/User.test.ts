describe("constructor", () => {
    test.todo("EXPECT properties to be set");
});

describe("UpdateBasicDetails", () => {
    test.todo("EXPECT properties to be updated");
});

describe("UpdatePassword", () => {
    test.todo("EXPECT password to be updated");
});

describe("AddTokenToUser", () => {
    test.todo("EXPECT entity to be pushed");
});

describe("Verify", () => {
    test.todo("EXPECT property to be set to true");
});

describe("ToggleActive", () => {
    test.todo("GIVEN user is active, EXPECT active to be set to false");

    test.todo("GIVEN user is not active, EXPECT active to be set to true");
});

describe("IsLoginCorrect", () => {
    test.todo("GIVEN email and password match, EXPECT true to be returned");

    test.todo("GIVEN user is not found, EXPECT false to be returned");

    test.todo("GIVEN passwords do not match, EXPECT false to be returned");
});

describe("FetchOneByUsername", () => {
    test.todo("EXPECT user to be returned");

    test.todo("GIVEN relations parameter is null, EXPECT flat entity to be returned");

    test.todo("GIVEN relations parameter is not set, EXPECT flat entity to be returned");

    test.todo("GIVEN user is not found, EXPECT undefined to be returned");
});

describe("FetchOneByEmail", () => {
    test.todo("EXPECT user to be returned");

    test.todo("GIVEN relations parameter is null, EXPECT flat entity to be returned");

    test.todo("GIVEN relations parameter is not set, EXPECT flat entity to be returned");

    test.todo("GIVEN user is not found, EXPECT undefined to be returned");
});