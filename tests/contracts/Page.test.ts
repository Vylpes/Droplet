import { Router } from 'express';
import { Page } from '../../src/contracts/Page';

describe('Page', () => {
    let page: Page;
    let router: Router;

    beforeEach(() => {
        router = {} as Router;
        page = new Page(router);
    });

    describe('constructor', () => {
        test('EXPECT properties to be set', () => {
            expect(page.router).toBeDefined();
        });
    });

    describe('Route', () => {
        test('EXPECT OnGet and OnPost methods to be called', () => {
            jest.spyOn(page, 'OnGet');
            jest.spyOn(page, 'OnPost');

            page.Route();

            expect(page.OnGet).toHaveBeenCalled();
            expect(page.OnPost).toHaveBeenCalled();
        });
    });
});