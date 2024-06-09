import { Request, Response } from "express";
import AssignPostagePolicy from "../../../src/routes/listings/assignPostagePolicy";
import BodyValidator from "../../../src/helpers/Validation/BodyValidator";
import PostagePolicy from "../../../src/database/entities/PostagePolicy";
import { Listing } from "../../../src/database/entities/Listing";
import createHttpError from "http-errors";

describe("OnPostAsync", () => {
    test("GIVEN body is valid, EXPECT postage policy to be assigned to listing", async () => {
        // Arrange
        const req = {
            params: {
                Id: "listingId",
            },
            body: {
                policyId: "policyId",
            },
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const listing = {
            AddPostagePolicyToListing: jest.fn(),
            Save: jest.fn(),
        } as unknown as Listing;

        const policy = {
            Id: "policyId",
        } as unknown as PostagePolicy;

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        PostagePolicy.FetchOneById = jest.fn().mockResolvedValue(policy);

        Listing.FetchOneById = jest.fn().mockResolvedValue(listing);

        // Act
        const page = new AssignPostagePolicy();
        await page.OnPostAsync(req, res, next);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/listings/view/listingId");

        expect(next).not.toHaveBeenCalled();

        expect(BodyValidator.prototype.NotEmpty).toHaveBeenCalledTimes(1);

        expect(BodyValidator.prototype.Validate).toHaveBeenCalledTimes(1);
        expect(BodyValidator.prototype.Validate).toHaveBeenCalledWith(req.body);

        expect(PostagePolicy.FetchOneById).toHaveBeenCalledTimes(1);
        expect(PostagePolicy.FetchOneById).toHaveBeenCalledWith(PostagePolicy, "policyId");

        expect(Listing.FetchOneById).toHaveBeenCalledTimes(1);
        expect(Listing.FetchOneById).toHaveBeenCalledWith(Listing, "listingId", [ "PostagePolicy" ]);

        expect(listing.AddPostagePolicyToListing).toHaveBeenCalledTimes(1);
        expect(listing.AddPostagePolicyToListing).toHaveBeenCalledWith(policy);

        expect(listing.Save).toHaveBeenCalledTimes(1);
        expect(listing.Save).toHaveBeenCalledWith(Listing, listing);
    });

    test("GIVEN body is invalid, EXPECT redirect to listing page", async () => {
        // Arrange
        const req = {
            params: {
                Id: "listingId",
            },
            body: {
                policyId: "policyId",
            },
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const listing = {
            AddPostagePolicyToListing: jest.fn(),
            Save: jest.fn(),
        } as unknown as Listing;

        const policy = {
            Id: "policyId",
        } as unknown as PostagePolicy;

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(false);

        PostagePolicy.FetchOneById = jest.fn().mockResolvedValue(policy);

        Listing.FetchOneById = jest.fn().mockResolvedValue(listing);

        // Act
        const page = new AssignPostagePolicy();
        await page.OnPostAsync(req, res, next);

        // Assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith("/listings/view/listingId");

        expect(next).not.toHaveBeenCalled();

        expect(PostagePolicy.FetchOneById).not.toHaveBeenCalled();

        expect(Listing.FetchOneById).not.toHaveBeenCalled();
    });

    test("GIVEN policy can not be found, EXPECT 404 error", async () => {
        // Arrange
        const req = {
            params: {
                Id: "listingId",
            },
            body: {
                policyId: "policyId",
            },
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const listing = {
            AddPostagePolicyToListing: jest.fn(),
            Save: jest.fn(),
        } as unknown as Listing;

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        PostagePolicy.FetchOneById = jest.fn().mockResolvedValue(undefined);

        Listing.FetchOneById = jest.fn().mockResolvedValue(listing);

        // Act
        const page = new AssignPostagePolicy();
        await page.OnPostAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(404));

        expect(res.redirect).not.toHaveBeenCalled();

        expect(Listing.FetchOneById).not.toHaveBeenCalled();
    });

    test("GIVEN listing can not be found, EXPECT 404 error", async () => {
        // Arrange
        const req = {
            params: {
                Id: "listingId",
            },
            body: {
                policyId: "policyId",
            },
        } as unknown as Request;

        const res = {
            redirect: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        const policy = {
            Id: "policyId",
        } as unknown as PostagePolicy;

        BodyValidator.prototype.NotEmpty = jest.fn().mockReturnThis();
        BodyValidator.prototype.Validate = jest.fn().mockResolvedValue(true);

        PostagePolicy.FetchOneById = jest.fn().mockResolvedValue(policy);

        Listing.FetchOneById = jest.fn().mockResolvedValue(undefined);

        // Act
        const page = new AssignPostagePolicy();
        await page.OnPostAsync(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(createHttpError(404));

        expect(res.redirect).not.toHaveBeenCalled();
    });
});