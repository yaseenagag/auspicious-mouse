const pgp = require('pg-promise')()
const db = pgp({database: 'mousey'})

const Books = {
  all: () => db.any('SELECT * FROM books')
}

module.exports = {
  Books
}
