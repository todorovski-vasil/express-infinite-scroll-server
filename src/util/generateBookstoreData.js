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

const genBookstore = (numBooks = NUM_BOOKS, numAuthors = NUM_AUTHORS) => {
    if (!authors.length) {
        for (let i = numAuthors; i > 0; i--) {
            authors.push({
                name: 'Author ' + i + Math.floor(Math.random() * numAuthors),
                gender: Math.floor(Math.random() * 2) ? MALE : FEMALE,
            });
        }
    }

    if (!books.length) {
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
        }
    }

    return {
        books,
        authors,
        genres,
    };
};

export { genBookstore };
