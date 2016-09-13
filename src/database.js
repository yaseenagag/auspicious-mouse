const pgp = require('pg-promise')()
const db = pgp({database: 'mousey'})

const Books = {
  all: () => {
    const sql = `
      SELECT
        *
      FROM
        books
    `
    return db.any(sql)
  },
  getById: (id) => {
    const sql = `
      SELECT
        *
      FROM
        books
      WHERE
        id=$1
    `
    const variables = [id]
    return db.one(sql, variables)
  },
  getWithDetails: (id) => {
    Promise.all([
      db.Books.getById(id),
      db.Books.getAuthorsByBookId(id)
    ]).then(details => {
      const book = details[0];
      book.authors = details[1];
      return book;
    })
  },
  getAuthorsByBookId: (id) => {
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
      const varabiles = [id]
      return db.one(sql, variables)
  }
}

module.exports = {
  Books
}
