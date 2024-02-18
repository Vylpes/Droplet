import { NextFunction, Request, Response } from "express";

export default interface Page {
    OnGet?(req: Request, res: Response, next: NextFunction): void;
    OnPost?(req: Request, res: Response, next: NextFunction): void;

    OnGetAsync?(req: Request, res: Response, next: NextFunction): Promise<void>;
    OnPostAsync?(req: Request, res: Response, next: NextFunction): Promise<void>;
}