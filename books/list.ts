import { type Express } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import book_list from "./books_list";

export default function books_list(app: Express) {
    app.get("/books",
        // We are using zod and zod-express-middleware to validate that our query string is correct, and if not
        // it will reject the request.
        validateRequest({
            query: z.object({
                filters: z.object({
                    from: z.number().optional(),
                    to: z.number().optional()
                }).array().optional()
            })
        }), (req, res) => {
            let filters = req.query['filters'];

            let books = Object.keys(book_list).map((id) => book_list[id]);

            // If there are no filters we can return the list directly
            if (!filters || filters.length === 0) {
                res.json(books);
                return;
            }

            // We can use a record to prevent duplication - so if the same book is valid from multiple sources
            // it'll only exist once in the record.
            // We set the value to "true" because it makes checking it later when returning the result easy.
            let filtered: Record<string, true> = {};

            for (let { from, to } of filters) {
                for (let { id, price } of books) {
                    let matches = true;
                    if (from && price < from) {
                        matches = false;
                    }
                    if (to && price > to) {
                        matches = false;
                    }
                    if (matches) {
                        filtered[id] = true;
                    }
                }
            }

            res.json(Object.keys(filtered).map((id) => book_list[id]));
        });
}