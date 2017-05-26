var express = require('express')
var router = express.Router()
const User = require('../models/User.model.js')

router

.get('/:token/:host', function(req, res) {
  User.init(req.params.token, function(err, data) {
    res.redirect(`http://${req.params.host.split('_').join('/').replace('hash', '#')}${req.params.token}`)
  })
})

.post('/', function(req, res) {
  User.save(req.body.username, req.body.password, req.body.token, function(err, data) {
    if (data === true) res.status(200).send()
    else res.status(500).send()
  })
})

module.exports = router;
