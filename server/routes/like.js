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


.post('/:id', function(req, res) {
  token = req.headers.authorization.substr(7)
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err || !decoded) res.status(500).send()
    User.like(decoded.id_user, req.params.id, function (err, data) {
      if (data === "same id") res.status(401).send()
      else if (data === 'You need to upload at least 1 image to like someone') {
        res.status(500).send('image')
      } else {
        var user = connected.forEach(s => {
          if (s.idUser === req.params.id) {
            s.emit('notification', `${decoded.username} just ${data} you!`)
          }
        })
        User.notif(req.params.id, `${decoded.username}  just ${data} you!`, function (err, updated) {
          if (err) res.status(500).send()
          else res.status(200).send(data)
        })
      }
    })
  })

})


module.exports = router;
