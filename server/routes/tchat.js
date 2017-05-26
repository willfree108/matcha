var express = require('express')
var jwtChecker = require('express-jwt')
var jwt = require('jsonwebtoken')
var router = express.Router()
const User = require('../models/User.model.js')
var config  = require('../config')
var utils = require('../models/utils.js')
var _ = require('lodash')
var connected = require('../models/store')

var jwtCheck = jwtChecker({
  secret: config.secret
});

router

.use(jwtCheck)

.get('/', function(req, res) {
  token = req.headers.authorization.substr(7)
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) res.status(500).send()
    User.getAll(function(err, users){
      if (err || !users) res.status(500).send()
      else {
        let connectedID = []
        connected.forEach(s => connectedID.push(s.idUser))
        users = users.filter(u => u.likedYou.indexOf(decoded.id_user) > -1 && u.liked.indexOf(decoded.id_user) > -1)
        users = users.filter(u => connectedID.indexOf(u._id.toString()) > -1)
        res.status(200).send(users)
      }
    })
  })
})

module.exports = router;
