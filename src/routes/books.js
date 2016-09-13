const express = require('express')
const router = express.Router()
const db = require('../database')


router.get('/', function(req, res) {
  db.getAllBooks()
    .then(books => {
      res.render('books', { books } )
    })
    .catch(error => {
      res.render('error', {error})
    })
})

router.get('/details/:id', function(req, res) {
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


module.exports = router;
