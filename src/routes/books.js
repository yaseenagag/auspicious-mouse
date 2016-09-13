const express = require('express')
const router = express.Router()
const db = require('../database')

/* GET users listing. */
router.get('/', function(req, res) {
  db.Books.all()
    .then(allbooks => {
      res.render('books', { allbooks } )
    })
    .catch(error => {
      res.render('error', {error})
    })
});



module.exports = router;
