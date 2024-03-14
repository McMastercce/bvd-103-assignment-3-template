import express from "express";
import book_list from "./mcmasteful-book-list.json";
import { z } from "zod"
import { validateRequest } from "zod-express-middleware";
import queryType from "query-types";
import cors from "cors";

const app = express();

// Setting up to use express JSON for the body
app.use(express.json());
// We use the queryType middleware to ensure our query strings are fully parsed.
app.use(queryType.middleware())
// And we add cors to ensure we can access our API from the mcmasterful-books website
app.use(cors())

app.get("/books",
// We are using zod and zod-express-middleware to validate that our query string is correct, and if not
// it will reject the request.
    validateRequest({
        query: z.object({ filters: z.object({
            from: z.number().optional(),
            to: z.number().optional()
        }).array().optional()
    })
}), (req, res) => {
    let filters = req.query['filters'];

    // If there are no filters we can return the list directly
    if (!filters || filters.length === 0) {
        res.json(book_list);
        return;
    }

    // We can use a record to prevent duplication - so if the same book is valid from multiple sources
    // it'll only exist once in the record.
    // We set the value to "true" because it makes checking it later when returning the result easy.
    let filtered : Record<number, true> = {};

    for (let {from, to} of filters) {
        for (let [index, { price }] of book_list.entries()) {
            let matches = true;
            if (from && price < from) {
                matches = false;
            }
            if (to && price > to) {
                matches = false;
            }
            if (matches) {
                filtered[index] = true;
            }
        }
    }

    res.json(book_list.filter((book, index) => filtered[index] === true));
});

app.listen(3000, () => {
    console.log("listening!")
});