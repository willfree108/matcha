var express = require('express')
var router = express.Router()
const User = require('../models/User.model.js')

router

.get('/:token/:link', function(req, res) {
  User.activate(req.params.token, function (err, data) {
    if (data === 'activated') res.redirect(`http://${req.params.link}`);
    else res.status(500).send()
  })
})


module.exports = router;
