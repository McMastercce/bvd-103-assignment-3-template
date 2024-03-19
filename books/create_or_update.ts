import { type Express } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import book_list from "./books_list";
import { v4 as uuidv4} from "uuid";

export default function create_or_update_book(app: Express) {
    app.post("/books",
        // We are using zod and zod-express-middleware to validate that our query string is correct, and if not
        // it will reject the request.
        validateRequest({
            body: z.object({
                id: z.string().optional(),
                name: z.string(),
                price: z.number(),
                description: z.string(),
                author: z.string(),
                image: z.string(),
            })
        }), (req, res) => {
            let body = req.body;
            console.error("CREATING OR UPDATING", body);

            if (typeof body.id === "string") {
                let id = body.id;
                if (!book_list[id]) {
                    res.statusCode = 404;
                    res.json({ error: "no such book" });
                    return;
                }
                book_list[id] = { ...body, id};
                res.json( { id: body.id});
            } else {
                let id = uuidv4();
                book_list[id] = { ...body, id };
                res.json({ id });
            }
        });
}