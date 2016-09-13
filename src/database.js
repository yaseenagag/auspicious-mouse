const pgp = require('pg-promise')()
const db = pgp({database: 'mousey'})

const getAllBooks = () => {
  const sql = `
    SELECT
      *
    FROM
      books
  `
  return db.manyOrNone(sql)
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

module.exports = {
  getAllBooks,
  getBookById,
  getBookByIdWithAuthors,
  getAuthorsByBookId,
}
