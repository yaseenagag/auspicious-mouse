const pgp = require('pg-promise')()
const db = pgp({database: 'mousey'})

const getAllBooks = () => {
  const sql = `
    SELECT
      *
    FROM
      books
  `
  return db.manyOrNone(sql).then(addAuthorsToBooks)
}

const getBookById = (id) => {
  const sql = `
    SELECT
      *
    FROM
      books
    WHERE
      id=$1
  `
  const variables = [id]
  return db.oneOrNone(sql, variables)
}

const getBookByIdWithAuthors = (id) => {
  return Promise.all([
    getBookById(id),
    getAuthorsByBookId(id)
  ]).then(details => {
    const book = details[0];
    book.authors = details[1];
    return book;
  })
}

const getAuthorsByBookId = (id) => {
  const sql = `
    SELECT
      *
    FROM
      authors
    JOIN
      book_authors
    ON
      book_authors.author_id=authors.id
    WHERE
      book_authors.book_id=$1
  `
  const variables = [id]
  return db.manyOrNone(sql, variables)
}

const findBooks = (query) => {
  const sql = `
    SELECT DISTINCT
      books.*
    FROM
      books
    JOIN
      book_authors
    ON
      book_authors.book_id = books.id
    JOIN
      authors
    ON
      book_authors.author_id = authors.id
    WHERE
      LOWER(title) LIKE $1
    OR
      LOWER(description) LIKE $1
    OR
      LOWER(authors.name) LIKE $1
  `
  const variables = [
    '%'+query.replace(/\s+/,'%').toLowerCase()+'%'
  ]
  return db.manyOrNone(sql, variables)
    .then(addAuthorsToBooks)
}

const addAuthorsToBooks = books => {
  return getAuthorsForBooks(books).then(authors => {
    books.forEach(book => {
      book.authors = authors.filter(author =>
        author.book_id === book.id
      )
    })
    return books;
  })
}

const getAuthorsForBooks = (books) => {
  const bookIds = books.map(book => book.id)
  const sql = `
    SELECT
      authors.*,
      book_authors.book_id
    FROM
      authors
    JOIN
      book_authors
    ON
      book_authors.author_id = authors.id
    WHERE
      authors.id IN ($1:csv)
  `
  return db.manyOrNone(sql, [bookIds])
}

module.exports = {
  getAllBooks,
  getBookById,
  getBookByIdWithAuthors,
  getAuthorsByBookId,
  findBooks
}
