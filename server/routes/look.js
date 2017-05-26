var express = require('express')
var jwtChecker = require('express-jwt')
var jwt = require('jsonwebtoken')
var router = express.Router()
const User = require('../models/User.model.js')
var config  = require('../config')
var utils = require('../models/utils.js')
var _ = require('lodash')
var connected = require('../models/store.js')
var jwtCheck = jwtChecker({
  secret: config.secret
});

router

.use(jwtCheck)


.post('/:id', function(req, res) {
  token = req.headers.authorization.substr(7)
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err || !decoded) res.status(500).send()
    User.look(decoded.id_user, req.params.id, function (err, data) {
      if (err) res.status(500).send()
      else if (data === "same id") res.status(401).send()
      else {
        var user = connected.forEach(s => {
          if (s.idUser === req.params.id) {
            s.emit('notification', `${decoded.username} just looked you!`)
          }
        })
        User.notif(req.params.id, `${decoded.username}  just looked you!`, function (err, data) {
          if (err) res.status(500).send()
          else res.status(200).send(data)
        })
      }
    })
  })

})


module.exports = router;
