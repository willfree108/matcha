var express = require('express');
var router = express.Router();
const User = require('../models/User.model.js');
var jwt = require('jsonwebtoken')
var config  = require('../config')
var _ = require('lodash')
var utils = require('../models/utils.js')


function createToken (user) {
  return jwt.sign(user, config.secret, { expiresIn: 60*60*5 })
}

router

.post('/', function (req, res, next) {
  req.body = _.pick(req.body, [...User.privatePaths, 'password'])
  utils.valid(req.body, function(err, data) {
    if (data === true) next()
    else res.status(500).send()
  })
})

.post('/', function(req, res) {
  User.signIn(req.body.username, req.body.password, function(err, data){
    if (err) res.status(500).send()
    else if (data === 'Please activate your account.') res.status(406).send()
    else if (data && data._id) res.status(200).send({
      id_token: createToken({username: req.body.username, id_user: data._id}),
      user: data
    })
    else res.status(403).send()
  })
})

module.exports = router;
