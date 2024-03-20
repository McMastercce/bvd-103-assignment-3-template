import { MongoClient } from "mongodb";
import { Book } from "./adapter/assignment-2";

const uri = "mongodb://mongo";

export const client = new MongoClient(uri);
export const database = client.db("mcmasterful-books");
export const book_collection = database.collection<Book>("books");