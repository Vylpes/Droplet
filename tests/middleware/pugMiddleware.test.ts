import { Request, Response, NextFunction } from 'express';
import { PugMiddleware } from '../../src/middleware/pugMiddleware';
import e from 'connect-flash';

describe("GetBaseString", () => {
    test("should set viewData with correct values", () => {
        // Arrange
        const req: Request = {
            flash: jest.fn().mockReturnValueOnce("info").mockReturnValueOnce("error"),
            session: {
                User: "user"
            },
        } as unknown as Request;
        const res: Response = {
            locals: {},
        } as Response;
        const next: NextFunction = jest.fn();

        // Act
        PugMiddleware.GetBaseString(req, res, next);

        // Assert
        expect(res.locals.viewData).toEqual({
            title: 'Droplet',
            info: "info",
            error: "error",
            isAuthenticated: true,
            user: "user",
        });
        expect(next).toHaveBeenCalled();
        expect(req.flash).toHaveBeenCalledWith('info');
        expect(req.flash).toHaveBeenCalledWith('error');
    });
});