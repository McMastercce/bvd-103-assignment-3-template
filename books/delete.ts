import { type Express } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import book_list from "./books_list";

export default function delete_book(app: Express) {
    app.delete("/books/:id",
        // We are using zod and zod-express-middleware to validate that our query string is correct, and if not
        // it will reject the request.
        validateRequest({
            params: z.object({
                id: z.string()
            })
        }), (req, res) => {
            let id = Number.parseInt(req.params.id);

            if (!book_list[id]) {
                res.statusCode = 404;
                res.json({ error: "no such book" });
                return;
            }
            book_list.splice(id, 1);
            res.json({});
            return;
        });
}