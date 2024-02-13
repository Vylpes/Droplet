import { Route } from '../../src/contracts/Route';

describe("constructor", () => {
    test("EXPECT properties to be set", () => {
        const route = new Route();

        expect(route.router).toBeDefined();
    });
});

describe("Route", () => {
    test("EXPECT Route to be returned", () => {
        const route = new Route();

        expect(route.Route()).toBe(route.router);
    });
});