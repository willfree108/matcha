var express = require('express')
var jwtChecker = require('express-jwt')
var jwt = require('jsonwebtoken')
var router = express.Router()
const User = require('../models/User.model.js')
var config  = require('../config')
var utils = require('../models/utils.js')
var _ = require('lodash')

var jwtCheck = jwtChecker({
  secret: config.secret
});

router

.use(jwtCheck)

.get('/', function(req, res) {
  token = req.headers.authorization.substr(7)
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) res.status(500).send()
    User.get(decoded.id_user, function(err, user){
      if (err || !user) res.status(500).send()
        else {
          user.nbNotification = 0
          User.update(user, function (err, data) {
            if (err) res.status(500).send()
            else res.status(200).send()
          })
        }
    })
  })
})

module.exports = router;
