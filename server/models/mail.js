var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'matcha424242@gmail.com',
        pass: 'matcha242424'
    }
});

const activate = function (token, email, firstName, lastName, redirect = 'localhost:8000') {
  var message = {
    from: 'A Random Matcha <sender@example.com>',
    to:  `"${firstName} ${lastName}" <${email}>`,
    subject: 'A Random Matcha Welcome You ✔',
    text: `"${firstName} ${lastName}"`,
    html:`<p>Weltome to a random Matcha ! Please activate your account by clicking on the following link: <a href='http://localhost:3000/api/activate/${token}/${redirect}'>This Link!</a><br/></p>`
  };
  
  transporter.sendMail(message, function(error){
    console.log('Message sent successfully!');
  })
}

const recover = function ({recover, email, firstName, lastName}, host, cb) {
  var message = {
    from: 'A Random Matcha <sender@example.com>',
    to:  `"${firstName} ${lastName}" <${email}>`,
    subject: 'A Random Matcha Password Recovery ✔',
    text: `"${firstName} ${lastName}"`,
    html:`<p>Seem like you forget your password. Click on the following link to recover it! <a href='http://localhost:3000/api/init/${recover}/${host}'>This link!</a></p>`
  };

  transporter.sendMail(message, function(err){
    console.log('Message sent successfully!');
    if (err) cb(err, null)
    else cb(null, true)
  })
}

module.exports = {
  activate,
  recover
}
