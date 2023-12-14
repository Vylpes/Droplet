import { NextFunction, Request, Response, Router } from "express";
import { NoteType } from "../../constants/NoteType";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import { Note } from "../../contracts/entities/Order/Note";
import { v4 } from "uuid";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import Order from "../../contracts/entities/Order/Order";

export default class AddNote extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("text")
                .NotEmpty();

        super.router.post('/:Id/add-note', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (req.session.error) {
                res.redirect(`/orders/view/${Id}`);
                return;
            }

            const text = req.body.text;

            const note: Note = {
                uuid: v4(),
                comment: text,
                whenCreated: new Date(),
                author: {
                    username: req.session.User.username,
                    r_userId: req.session.User.uuid,
                },
            };

            await ConnectionHelper.UpdateOne<Order>("order", { uuid: Id }, { $push: { notes: note }});

            res.redirect(`/orders/view/${Id}`);
        });
    }
}