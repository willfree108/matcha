var express = require('express')
var router = express.Router()
const User = require('../models/User.model.js')

router

.post('/', function(req, res) {
  User.recover(req.body.email, req.body.host, function(err, data) {
    if (data === true) res.status(200).send()
    else res.status(500).send()
  })
})

module.exports = router;
