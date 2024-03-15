type BookID = string;

interface Book {
    id?: BookID,
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
};

async function listBooks(filters?: Array<{from?: number, to?: number}>) : Promise<Book[]>{
    // We want to generate the query string to match the format expected by qs: https://www.npmjs.com/package/qs
    let query = filters?.map(({from, to}, index) => {
        let result = "";
        if (from) {
            result += `&filters[${index}][from]=${from}`;
        }
        if (to) {
            result += `&filters[${index}][to]=${to}`
        }
        return result;
    }).join("&") ?? "";

    // We then make the request
    let result = await fetch(`http://localhost:3000/books?${query}`);

    if (result.ok) {
        // And if it is valid, we parse the JSON result and return it.
        return await result.json();
    } else {
        throw new Error("Failed to fetch books");
    }
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
    let result = await fetch(`http://localhost:3000/books`, { method: "POST", body: JSON.stringify(book), headers: {
        "Content-Type": "application/json"
    } });

    if (result.ok) {
        let res = await result.json();
        return res.id;
    } else {
        throw new Error("Failed to create or update book");
    }
}

async function removeBook(book: BookID): Promise<void> {
    let result = await fetch(`http://localhost:3000/books/${book}`, { method: "DELETE"});

    if (!result.ok) {
        throw new Error("Failed to create or update book");
    }
}

const assignment = "assignment-2";

export default {
    assignment,
    createOrUpdateBook,
    removeBook,
    listBooks
};