var express = require('express');
var router = express.Router();
const User = require('../models/User.model.js');
var multer  = require('multer')
var upload = multer({ dest: '/tmp', limits: { fileSize: 5000000 }})
var config  = require('../config')
var jwtChecker = require('express-jwt')
var jwt = require('jsonwebtoken')
const fs = require('fs');

var jwtCheck = jwtChecker({
  secret: config.secret
});

router

.use(jwtCheck)

.patch('/:index', function (req, res) {
  var token = req.headers.authorization.substr(7)
  jwt.verify(token, config.secret, function(err, decoded) {
    User.get(decoded.id_user, function (err, user) {
      if (err || !user) res.send('An error occured.')
      else if (JSON.stringify(user._id) === JSON.stringify(decoded.id_user)) {
        if (req.params.index < 0) {
          res.send('Error. Wrong index.')
        } else {
          user.avatar = req.params.index
          User.update(user, function (err, data) {
            if (err) res.send('An error occured.')
            else res.send("Index successfully saved!")
          })
        }
      }
    })
  })
})

.post('/:id', upload.single('image'), function(req, res, next) {
  var token = req.headers.authorization.substr(7)

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err || !decoded) res.status(500).send()
    else if (JSON.stringify(req.params.id) === JSON.stringify(decoded.id_user)) {
      User.imgUp(req.file, req.params.id, function(err, data){
        if (err) res.send('An error occured.')
    		else if (data === true) res.send("The picture has been added.")
    		else if (data === "size") res.send("The size of the file must be between 100Kb and 5Mb.")
    		else if (data === "mimetype") res.send("The type of the file is incorrect.")
    		else if (data === false) res.send('An error occurred.')
        else if (data === 'toomanyimage') res.send('You can\'t have more than 5 images.')
        else res.send('Your image was successfully uploaded!')
      })
    }

  })
})

.delete('/:link', function (req, res) {
  var token = req.headers.authorization.substr(7)
  var link = './public/image/' + req.params.link

  jwt.verify(token, config.secret, function(err, decoded) {
    User.get(decoded.id_user, function (err, user) {
      if (err || !user) res.send('An error occured.')
      else if (JSON.stringify(user._id) === JSON.stringify(decoded.id_user)) {
        var index = user.image.indexOf('http://localhost:3000/image/' + req.params.link)
        if (index === -1) {
          res.send('Error. You don\'t have this image.')
        } else {
          user.image.splice(index, 1)
          user.avatar = 0
          fs.unlink(link, (err) => {
            if (err) res.send('An error occured.')
            User.update(user, function (err, data) {
              if (err) res.send('An error occured.')
              else res.send("Your image was successfully deleted.")
            })
          })
        }
      }
    })
  })
})

module.exports = router;
