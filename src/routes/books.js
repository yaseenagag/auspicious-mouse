const express = require('express')
const router = express.Router()
const db = require('../database')


router.get('/', function(req, res) {
  db.Books.all()
    .then(allbooks => {
      res.render('books', { allbooks } )
    })
    .catch(error => {
      res.render('error', {error})
    })
})

router.get('/details/:id', function(req, res) {
  db.Books.getBookById(req.params.id)
    .then(book => {
      res.render('details', { book: book } )
    })
    .catch(error => {
      res.render('error', {error})
    })
})


module.exports = router;
