import { type Express } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import book_list from "./books_list";

export default function create_or_update_book(app: Express) {
    app.post("/books",
        // We are using zod and zod-express-middleware to validate that our query string is correct, and if not
        // it will reject the request.
        validateRequest({
            body: z.object({
                id: z.number().optional(),
                name: z.string(),
                price: z.number(),
                description: z.string(),
                author: z.string(),
                image: z.string(),
            })
        }), (req, res) => {
            let body = req.body;

            if (typeof body.id === "number" && body.id >= 0) {
                if (body.id > book_list.length) {
                    res.statusCode = 404;
                    res.json({ error: "no such book" });
                    return;
                }
                book_list[body.id] = body;
                res.json( { id: body.id});
            } else {
                book_list.push(body);
                let id = book_list.length;
                res.json({ id });
            }
        });
}