const MongoClient = require('mongodb');
const express = require('express');
const { genBookstore } = require('./common/generateBookstoreData');

const app = express();

const url = 'mongodb://localhost:27017/';
const booksCol = 'books';
const genresCol = 'genres';
let dbo = null;
const MAX_NUM_RECORDS = 1000;

app.get('/api/genres', async (req, res) => {
    const genres = await dbo.collection(genresCol).find().toArray();

    res.send(genres.map((genre) => genre.genre));
});

app.get('/api/books', async (req, res) => {
    let offset = 0;
    const query = {};
    const sortCriteria = {};
    const aggregate = [];

    console.log('- get books request');
    console.log(req.query);

    if (req.query.orderByName) {
        sortCriteria['name'] = 1;
    }
    if (req.query.orderByAuthorName) {
        sortCriteria['author.name'] = 1;
    }
    if (Object.keys(sortCriteria).length !== 0) {
        aggregate.push({ $sort: sortCriteria });
    }

    if (req.query.genre) {
        query.genre = req.query.genre;
    }
    if (req.query.authorGender) {
        query['author.gender'] = req.query.authorGender;
    }
    if (Object.keys(query).length !== 0) {
        aggregate.push({ $match: query });
    }

    if (req.query.offset) {
        offset = Number.parseInt(req.query.offset);
    }
    if (offset) {
        aggregate.push({ $skip: offset });
    }

    aggregate.push({ $limit: MAX_NUM_RECORDS });

    const books = await dbo.collection(booksCol).aggregate(aggregate).toArray();

    res.send(books);
});

const server = app.listen(3003, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log(`listening on: [${host}]:${port}`);

    try {
        MongoClient.connect(
            url,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
            async function (err, db) {
                if (err) throw err;
                try {
                    dbo = db.db('bookstore');
                    console.log('Connected to mongodb instance at: ' + url);
                } catch (err) {
                    console.error(err);
                }

                // await dbo.collection(booksCol).drop();
                const collections = await dbo.collections();
                if (
                    !collections.map((c) => c.collectionName).includes(booksCol)
                ) {
                    const bookstore = genBookstore(1000000, 1000, true);

                    await dbo.createCollection(booksCol);
                    await dbo.collection(booksCol).createIndex({
                        name: 1,
                    });
                    await dbo.collection(booksCol).createIndex({
                        genre: 1,
                    });
                    await dbo.collection(booksCol).createIndex({
                        'author.name': 1,
                    });
                    await dbo.collection(booksCol).createIndex({
                        'author.gender': 1,
                    });
                    await dbo.collection(booksCol).createIndex({
                        name: 1,
                        genre: 1,
                    });
                    await dbo.collection(booksCol).createIndex({
                        name: 1,
                        genre: 1,
                        'author.gender': 1,
                    });
                    await dbo.collection(booksCol).createIndex({
                        'author.name': 1,
                        genre: 1,
                    });
                    await dbo.collection(booksCol).createIndex({
                        'author.name': 1,
                        genre: 1,
                        'author.gender': 1,
                    });
                    try {
                        await dbo.collection(booksCol).insertMany(
                            bookstore.books.map((book) => {
                                book._id = book.isbn;
                                return book;
                            })
                        );
                        console.log('Written books into collection');
                    } catch (err) {
                        console.error(err);
                    }

                    if (
                        collections
                            .map((c) => c.collectionName)
                            .includes(genresCol)
                    ) {
                        await dbo.collection(genresCol).drop();
                    }
                    await dbo.createCollection(genresCol);
                    try {
                        await dbo.collection(genresCol).insertMany(
                            bookstore.genres.map((genre) => ({ genre }))
                            // bookstore.genres
                        );
                        console.log('Written genres into collection');
                    } catch (err) {
                        console.error(err);
                    }
                } else {
                    console.log('Collection already present');
                }
            }
        );
    } catch (e) {
        console.error(e);
    }
});
