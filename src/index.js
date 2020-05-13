import { genBookstore } from './util/generateBookstoreData';

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/';
const booksCol = 'books';

MongoClient.connect(url, async function (err, db) {
    if (err) throw err;
    const dbo = db.db('bookstore');

    const collections = await dbo.collections();
    if (!collections.map((c) => c.s.name).includes(booksCol)) {
        await dbo.createCollection(booksCol);

        const bookstore = genBookstore(1000000, 1000);
        dbo.collection(booksCol).insertMany(bookstore.books);
    }
});
