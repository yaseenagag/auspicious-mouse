const express = require('express')
const router = express.Router()
const db = require('../database')


// INDEX
router.get('/', (req, res) => {
  console.log('PAGE', req.query.page);

  let page = ( parseInt( req.query.page, 10 ) ) || 1

  console.log('PAge again', page);

  const sqlQuery = 'q' in req.query ?
    db.findBooks(req.query.q) : db.getAllBooks(page)

  sqlQuery.then(books => {
      res.render('books', {
        books: books,
        page: page,
        search: req.query.q
      })
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

})

router.get('/:id/delete', (req, res) => {
  db.deleteBook( req.params.id )
    .then( result => res.redirect ( '/' ))
    .catch( error => res.render( 'error', {error} ))
})


module.exports = router
