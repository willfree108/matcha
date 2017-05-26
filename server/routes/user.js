var express = require('express')
var jwtChecker = require('express-jwt')
var jwt = require('jsonwebtoken')
var router = express.Router()
const User = require('../models/User.model.js')
var config  = require('../config')
var utils = require('../models/utils.js')
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt-nodejs');
var _ = require('lodash')

var jwtCheck = jwtChecker({
  secret: config.secret
});

router

.get('/', jwtCheck)

.get('/', function(req, res) {
  User.getAll(function(err, data){
    if (err) res.status(500).send()
    else res.json(data.map(o => _.pick(o, User.publicPaths)))
  })
})

.get('/:id', jwtCheck)

.get('/:id', function(req, res) {
  User.get(req.params.id, function(err, data){
    if (req.headers.authorization){
      token = req.headers.authorization.substr(7)
      jwt.verify(token, config.secret, function(err, decoded) {
        if (err || !data) res.status(500).send()
        else if (JSON.stringify(decoded.id_user) === JSON.stringify(data._id))
          res.json(_.pick(data, User.privatePaths))
        else
          utils.merge(User.public, data, function(data) {
            res.json(data)
          })
      });
    } else {
      res.status(401).send()
    }
  })
})

.post('/', function (req,res, next) {
  req.body = _.pick(req.body, [...User.privatePaths, 'password'])
  utils.valid(req.body, function(err, data) {
    if (data === true) next()
    else res.status(500).send()
  })
})

.post('/', function(req, res) {
  bcrypt.hash(req.body.password, null, null, function(err, hash) {
    if (err) res.status(500).send()
    else {
      req.body.password = hash
      User.signUp(req.body, function(err, data){
        if (err) res.status(500).send()
        else if (data === 'exist') res.status(403).send()
        else {
          res.status(201).send()
        }
      })
    }
  })
})

.put('/', jwtCheck)

.put('/', function (req,res, next) {
  req.body = _.pick(req.body, User.privatePaths)
  utils.valid(req.body, function(err, data) {
    if (data === true) next()
    else res.status(500).send()
  })
})

.put('/', function(req, res){
  if (req.headers.authorization){
    token = req.headers.authorization.substr(7)
    jwt.verify(token, config.secret, function(err, decoded) {
      if (decoded.id_user === req.body._id){
        User.update(req.body, function(err, data){
          if (err) res.status(500).send()
          else res.status(200).send()
        })
      } else {
        res.status(401).send()
      }
    });
  }
})

module.exports = router;
