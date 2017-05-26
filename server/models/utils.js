var merge = function (origin, user, cb) {
    var tmp = {}
    Object.keys(user).forEach(prop => {
      if (origin.hasOwnProperty(prop)) {
              tmp[prop] = user[prop]
      }
    })
    cb(tmp)
};

var valid = function (user, cb){
  var valid = true
  var re = /^[\w+]{4,30}$/
  var sexre = /^(Men|Women)$/
  var orientationre = /^(Men|Women|Bi)$/
  var biore = /^[\w+]{0,200}$/
  var agere = /\d{2,3}/
  var mailre = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (user.hasOwnProperty("age") && agere.test(user.age) === false) valid = false
  if (user.hasOwnProperty("password") && re.test(user.password) === false) valid = false
  if (user.hasOwnProperty("email") && mailre.test(user.email) === false) valid = false
  if (user.hasOwnProperty('firstName') && re.test(user.firstName) === false) valid = false
  if (user.hasOwnProperty('lastName') && re.test(user.lastName) === false) valid = false
  if (user.hasOwnProperty('username') && re.test(user.username) === false) valid = false
  if (user.hasOwnProperty('sexe') && user.sexe !== '' && sexre.test(user.sexe) === false) valid = false
  if (user.hasOwnProperty('orientation') && orientationre.test(user.orientation) === false) valid = false
  if (user.hasOwnProperty('bio') && biore.test(user.bio) === false) valid = false
  if (user.hasOwnProperty('tag') && Array.isArray(user.tag) === false) valid = false
  if (valid) cb(false, true)
  else cb(true, false)
}

module.exports = { merge, valid }
