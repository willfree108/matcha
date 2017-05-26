var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:3030';
var mv = require('mv')
var _ = require('lodash')
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto')
var Mail = require('./mail');
var randomstring = require("randomstring");

var OriginUser = {
  date: 'Never',
  init: false,
  recover: '',
  activated: false,
  token: '',

  username: "rooty",
  password: "root",
  email: "tale-s1@hotmail.fr",

  description: "",
  firstName: "",
  lastName: "",
  age: 18,

  sexe: "",
  orientation: "Bi",

  image: [],
  avatar: 0,
  score: 0,
  bio: "",
  tag: [],
  localisation: "",

  nbNotification: 0,
  notification: [],
  likedYou: [],
  lookedYou: [],

  liked: [],
  blocked: [],
};

var Private = {
  date: '',
  username: "rooty",
  email: "tale-s1@hotmail.fr",
  description: "",
  firstName: "",
  lastName: "",
  age: 18,

  sexe: "",
  orientation: "Bi",

  image: [],
  avatar: 0,
  score: 0,
  bio: "",
  tag: [],
  localisation: "",

  nbNotification: 0,
  notification: [],
  likedYou: [],
  lookedYou: [],

  liked: [],
  blocked: [],
  _id: ''
}

var Public = {
  date: '',
  username: "rooty",
  description: "",
  firstName: "",
  lastName: "",
  age: 0,
  sexe: "",
  orientation: "3",
  image: [],
  avatar: 0,
  score: 0,
  bio: "",
  tag: "",
  localisation: "",
  likedYou: [],
  lookedYou: [],
  liked: [],
  blocked: [],
  _id: ''
}

var signIn = function(username, password, cb) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      cb(err, null);
      db.close();
    } else {
      var collection = db.collection('user');
      collection.findOne({username}, function(err, user) {
        if (err) cb(err, null);
        else if (user && user.activated === false) cb(null, 'Please activate your account.');
        else if (!user || !user.password) cb(null, 'Wrong.');
        else {
          bcrypt.compare(password, user.password, function(err, res) {
            if (res !== true) cb(err, null);
            else cb(null, _.omit(user, ['password']));
          });
        }
        db.close();
      })
    }
  });
};

var signUp = function(newUser, cb) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      cb(err, null);
      db.close();
    } else {
      var collection = db.collection('user');
      //collection.findOne({username: newUser.username}, function(err, user) {
      collection.findOne({$or: [ { username: newUser.username}, {  email: newUser.email } ] }, function(err, user) {
        if (err) {
          db.close();
          cb(err, null);
        } else if (user === null) {
          newUser.token = crypto.createHmac('sha256', newUser.password + 'baka').digest('hex');
          newUser.recover = crypto.createHmac('whirlpool', randomstring.generate(12)).digest('hex');
          newUser = Object.assign({}, OriginUser, newUser);
          collection.insertOne(newUser, function(err, result) {
            if (err) cb(err, null);
            else     {
              cb(err, result ? true : false);
              Mail.activate(newUser.token, newUser.email, newUser.firstName, newUser.lastName)
            }
            db.close();
          });
        } else {
          db.close();
          cb(err, "exist");
        }
      });
    }
  });
};

var update = function(updatedUser, cb) {
    MongoClient.connect(url, function(err, db) {
      if (err) {
        cb(err, null);
        db.close();
      } else {
        var collection = db.collection('user');
        collection.findOne(ObjectId(updatedUser._id), function(err, user) {
          if (err || user === null)  cb(err, null);
          updatedUser = Object.assign({}, OriginUser, user, updatedUser);
          delete updatedUser._id;
          if (user) {
            collection.updateOne({ username: user.username}, {$set: updatedUser}, function(err, data) {
              if (err) cb(err, null);
              else     cb(null, data.result.ok ? true : false)
              db.close();
            });
          }
        })
      }
    });
}

var get = function(value, cb) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      cb(err, null);
      db.close();
    } else {
      var collection = db.collection('user');
      try {
        collection.findOne(ObjectId(value), function(err, user) {
          if (err) cb(err, null);
          else     cb(null, user);
          db.close();
        });
      }
      catch (e) {
          cb(e, null);
      }
    }
  });
}

var getAll = function(cb) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      cb(err, null);
      db.close();
    } else {
      var collection = db.collection('user');
      collection.find({}).toArray(function(err, users) {
        if (err) cb(err, null);
        else     cb(null, users);
        db.close();
      });
    }
  });
}

var _l = function(field){
  return function(from, to, cb){
      if (from === to) { cb(null, "same id"); return false; }
      get(from, (err, fromUser) => {
        if (fromUser && fromUser.image.length === 0) {
          cb(err, 'You need to upload at least 1 image to like someone'); return false;
        } else if (err) { cb(err, null); return false; }
        get(to, (err, toUser) => {
          if (err) { cb(err, null); return false; }
          if (fromUser === null || toUser === null){ cb(err, "not found"); return false; }

          if (field === "like") {
            var back = false
            var index1 = toUser.likedYou.indexOf(fromUser._id.toString())
            var index2 = fromUser.liked.indexOf(toUser._id.toString())
            var index3 = toUser.liked.indexOf(fromUser._id.toString())
            var index4 = fromUser.likedYou.indexOf(toUser._id.toString())
            if (index3 !== -1 && index4 !== -1) back = true
            if (index1 === -1 && index2 === -1) {
              toUser.likedYou.push(fromUser._id.toString())
              fromUser.liked.push(toUser._id.toString())
            } else if (index1 >= 0 && index2 >= 0){
               toUser.likedYou.splice(index1, 1);
               fromUser.liked.splice(index2, 1);
            }
          } else if (field === "look") {
            if (toUser.lookedYou.indexOf(fromUser._id.toString()) === -1)
              toUser.lookedYou.push(fromUser._id.toString())
          } else if (field === "block") {
              if (fromUser.blocked.indexOf(toUser._id.toString()) === -1) {
                fromUser.blocked.push(toUser._id.toString())
                toUser.blocked.push(fromUser._id.toString())
                var i = toUser.likedYou.indexOf(fromUser._id.toString())
                var j = fromUser.likedYou.indexOf(toUser._id.toString())
                if (i !== -1) toUser.likedYou.splice(i, 1)
                if (i !== -1) fromUser.likedYou.splice(j, 1);
                i = toUser.liked.indexOf(fromUser._id.toString())
                j = fromUser.liked.indexOf(toUser._id.toString())
                if (i !== -1) toUser.liked.splice(i, 1)
                if (i !== -1) fromUser.liked.splice(j, 1);
              }
          }
          update(fromUser, (err, data) => {
              if (err)  { cb(err, null); return false; }
              update(toUser, (err, data) => {
                  if (err)  { cb(err, null); return false; }
                  else {
                    if (index1 === -1 && index2 === -1) {
                      if (back) {
                        cb(null, 'liked back')
                      } else {
                        cb(null, 'liked')
                      }
                    } else {
                      cb(null, 'disliked')
                    }
                  }
              })
          })
        })
      })
  }
}

var like = _l("like")
var look = _l("look")
var block = _l("block")

var notif = function (id, msg, cb) {
  get(id, function (err, user){
    if (err) {
      cb(err, null)
      return false
    }
    user.notification.push(msg)
    user.nbNotification++
    update(user, function (err, data) {
      if (err) {
        cb(err, null)
        return false
      }
      cb(null, data)
    })
  })
}

var imgUp = function(img, id, cb) {
  if (!img) {
    cb(true, null)
    return false
  }
	var sImage = img.size
	var mImage = img.mimetype
  get(id, function (err, data){
    if (err) {
      cb(err, null)
      return false
    }
    userSess = data
  	if (mImage !== 'image/jpeg' && mImage !== 'image/png' && mImage !== 'image/pjpeg' && mImage !== 'image/x-png') { cb(null, "mimetype"); return false; }
  	if (userSess.image.length === 5) { cb(err, "toomanyimage"); return false; }
  	userSess.image.push('http://localhost:3000/image/'+img.filename+'.jpg')
  	update(userSess, (err, data) => {
  		if (err)  { cb(err, null); return false; }
  		mv(img.path, './public/image/'+img.filename+'.jpg', function(err) {
  			if (err) {
  				var index = -1;
  				for(var i = 0; i < userSess.image.length; i++) {
  					if (userSess.image[i] == './public/image/'+img.filename+'.jpg'){
  						index = i;
  						break;
  					}
  				}
  				userSess.image.splice(index, 1)
  				cb(err, null)
  				return false
  			}
  		cb(null, true)
  		})
  	})
  })
}

var activate = function(token, cb) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      cb(err, null);
      db.close();
    } else {
      var collection = db.collection('user');
      collection.findOne({token}, function(err, user) {
        if (err || !user) {
          cb(err, null);
          db.close();
        } else {
          user.activated = true
          update(user, function (err, data) {
            if (err || !user) {
              cb(err, null);
              db.close();
            } else {
              cb(null, 'activated')
            }
          })
        }
      })
    }
  })
}

var recover = function (email, host,  cb) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      cb(err, null);
      db.close();
    } else {
      var collection = db.collection('user');
      collection.findOne({email}, function(err, user) {
        if (err || !user) cb(err, null)
        else {
          Mail.recover(user, host, function(err, data) {
            if (err) cb(err, null)
            else {
              update(user, function (err, data){
                if (err) cb(err, null)
                else cb(null, true)
              })
            }
          })
        }
      })
    }
  })
}

var init = function (recover, cb) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      cb(err, null);
      db.close();
    } else {
      var collection = db.collection('user');
      collection.findOne({recover}, function(err, user) {
        if (err || !user) {
          cb(err, null);
          db.close();
        } else {
          user.init = true
          update(user, function (err, data) {
            if (err) {
              cb(err, null);
              db.close();
            } else {
              cb(null, true)
            }
          })
        }
      })
    }
  })
}

var save = function (username, password, recover, cb) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      cb(err, null);
      db.close();
    } else {
      var collection = db.collection('user');
      collection.findOne({recover}, function(err, user) {
        if (err) {
          cb(err, null);
          db.close();
        } else if (user && user.init === true && user.recover === recover) {
          user.init = false
          user.recover = crypto.createHmac('whirlpool', randomstring.generate(12)).digest('hex')
          bcrypt.hash(password, null, null, function(err, hash) {
            user.password = hash
            update(user, function(err, data){
              if (err) {
                cb(err, null);
                db.close();
              } else {
                cb(null, true)
              }
            })
          })
        } else {
          cb(null, null);
        }
      })
    }
  })
}

module.exports = {
  signIn,
  signUp,
  update,
  get,
  getAll,
  notif,
  like,
  look,
  block,
  imgUp,
  activate,
  recover,
  init,
  save,
  originUser: Object.assign({}, OriginUser),
  public: Object.assign({}, Public),
  publicPaths: Object.keys(Public),
  privatePaths: Object.keys(Private)
};
