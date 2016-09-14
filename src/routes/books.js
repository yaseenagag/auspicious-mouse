const express = require('express')
const router = express.Router()
const db = require('../database')


// INDEX
router.get('/', (req, res) => {

  const sqlQuery = 'q' in req.query ?
    db.findBooks(req.query.q) : db.getAllBooks()
  sqlQuery
    .then(books => {
      res.render('books', { books, search: req.query.q } )
    })
    .catch(error => {
      res.render('error', {error})
    })
})

// NEW
router.get('/new', (req, res) => {
  res.render('books/new', {
    book: {}
  })
})

// CREATE
router.post('/', (req, res) => {
  const { book } = req.body
  db.createBook(book)
    .then(book => {
      res.redirect( '/books/'+ book.id)
    })
    .catch(error => {
      res.render('error', {error})
    })
})

// SHOW
router.get('/:id', (req, res) => {
  const { id } = req.params

  db.getBookByIdWithAuthors(id)
    .then(book => {
      res.render('details', {
        book: book
      })
    })
    .catch(error => {
      res.render('error', {error})
    })
})

router.get('/:id/edit', (req, res) => {

});

router.get('/:id/delete', (req, res) => {

});


module.exports = router
