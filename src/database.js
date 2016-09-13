const pgp = require('pg-promise')()
const db = pgp({database: 'mousey'})

const Books = {
  all: () => db.any('SELECT * FROM books'),
  getBookById: id => db.one('SELECT * FROM books WHERE id=$1', [id])
}

module.exports = {
  Books
}
