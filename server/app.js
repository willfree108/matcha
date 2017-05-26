var express = require('express');
var path = require('path');
var logger = require('morgan');
var errorhandler = require('errorhandler')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var restc = require('restc');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var connected = require('./models/store')
const User = require('./models/User.model.js')
var moment = require('moment');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
})

app.use(logger('dev'));
app.use(errorhandler());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(restc.express());


app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/image', require('./routes/image'));
app.use('/api/like', require('./routes/like'));
app.use('/api/block', require('./routes/block'));
app.use('/api/look', require('./routes/look'));
app.use('/api/notif', require('./routes/notif'));
app.use('/api/tchat', require('./routes/tchat'));
app.use('/api/activate', require('./routes/activate'));
app.use('/api/recover', require('./routes/recover'))
app.use('/api/init', require('./routes/init'))

io.on('connection', function (socket) {

  socket.on('login', function (data) {
    socket.idUser = data.idUser
    connected.forEach(s => {
      if (data.liked.indexOf(s.idUser) > -1)
        s.emit('notification', `${data.name} just connected!`)
    })
    User.update({_id: data.idUser, date: 'Online'}, function(){})
    connected.push(socket)
  });

  socket.on('logout', function(data) {
    console.log(data)
    connected.forEach(s => {
      if (data.liked.indexOf(s.idUser) > -1)
        s.emit('notification', `${data.name} just disconnected!`)
    })
    User.update({_id: data.id, date: 'Last connection: ' + moment().format('LLLL')}, function(){})
      var i = connected.indexOf(socket);
      connected.splice(i, 1);
  });

  socket.on('message', function({from, to, message}){
    connected.forEach(s => {
      if (s.idUser === from || s.idUser === to) {
        s.emit('message', {from, to, message})
      }
    })
  })
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).send()
});

server.listen(3000);
