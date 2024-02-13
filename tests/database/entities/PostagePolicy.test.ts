import PostagePolicy from '../../../src/database/entities/PostagePolicy';

describe("constructor", () => {
    test("EXPECT properties to be set", () => {
        // Arrange
        const name = "Test Policy";
        const costToBuyer = 10;
        const actualCost = 8;

        // Act
        const postagePolicy = new PostagePolicy(name, costToBuyer, actualCost);

        // Assert
        expect(postagePolicy.Name).toBe(name);
        expect(postagePolicy.CostToBuyer).toBe(costToBuyer);
        expect(postagePolicy.ActualCost).toBe(actualCost);
        expect(postagePolicy.Archived).toBe(false);
    });
});

describe("UpdateBasicDetails", () => {
    test("EXPECT properties to be updated", () => {
        // Arrange
        const name = "Updated Policy";
        const costToBuyer = 15;
        const actualCost = 12;
        const postagePolicy = new PostagePolicy("Test Policy", 10, 8);

        // Act
        postagePolicy.UpdateBasicDetails(name, costToBuyer, actualCost);

        // Assert
        expect(postagePolicy.Name).toBe(name);
        expect(postagePolicy.CostToBuyer).toBe(costToBuyer);
        expect(postagePolicy.ActualCost).toBe(actualCost);
    });
});

describe("ArchivePolicy", () => {
    test("EXPECT archived to be set to true", () => {
        // Arrange
        const postagePolicy = new PostagePolicy("Test Policy", 10, 8);

        // Act
        postagePolicy.ArchivePolicy();

        // Assert
        expect(postagePolicy.Archived).toBe(true);
    });
});