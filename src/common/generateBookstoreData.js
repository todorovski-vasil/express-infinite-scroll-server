const cliProgress = require('cli-progress');

const NUM_BOOKS = 1000000;
const NUM_AUTHORS = 10000;
const haloweenISODate = '-10-31';
const FICTION = 'fiction',
    DRAMA = 'drama',
    POETRY = 'poetry',
    FINANCE = 'finance',
    HOROR = 'horror';
const MALE = 'M',
    FEMALE = 'F';
const genres = [FICTION, DRAMA, POETRY, FINANCE, HOROR];
const books = [];
const authors = [];

let progressBarAuthors = null;
let progressBarBooks = null;

const genBookstore = (
    numBooks = NUM_BOOKS,
    numAuthors = NUM_AUTHORS,
    logProgress = false
) => {
    if (!authors.length) {
        if (logProgress) {
            console.log('Generating authors: ');
            progressBarAuthors = new cliProgress.SingleBar(
                {},
                cliProgress.Presets.shades_classic
            );
            progressBarAuthors.start(numAuthors, 0);
        }

        for (let i = numAuthors; i > 0; i--) {
            authors.push({
                name: 'Author ' + i + Math.floor(Math.random() * numAuthors),
                gender: Math.floor(Math.random() * 2) ? MALE : FEMALE,
            });

            progressBarAuthors.increment();
        }

        progressBarAuthors.stop();

        console.log('- authors generated');
    }

    if (!books.length) {
        if (logProgress) {
            console.log('Generating books: ');
            progressBarBooks = new cliProgress.SingleBar(
                {},
                cliProgress.Presets.shades_classic
            );
            progressBarBooks.start(numBooks, 0);
        }

        for (let i = numBooks; i > 0; i--) {
            const author = authors[Math.floor(Math.random() * authors.length)];
            const genre = genres[Math.floor(Math.random() * genres.length)];
            const publishedDate =
                i % 5 === 4 && genre === HOROR // generate some test data that more often fits the criteria for marked scary books
                    ? new Date(
                          Math.floor(Math.random() * 1020) +
                              1000 +
                              haloweenISODate
                      )
                    : new Date(
                          Math.floor(Math.random() * 1020) +
                              1000 +
                              '-' +
                              (Math.floor(Math.random() * 12) + 1) +
                              '-' +
                              (Math.floor(Math.random() * 28) + 1)
                      );
            books.push({
                isbn: i + '-' + Math.random() * 10000 * numBooks,
                name: 'Book about ' + Math.floor(Math.random() * numBooks),
                author,
                genre,
                publishedDate,
            });

            progressBarBooks.increment();
        }

        progressBarBooks.stop();

        console.log('- books generated');
    }

    return {
        books,
        authors,
        genres,
    };
};

exports.genBookstore = genBookstore;
