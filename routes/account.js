var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var User = require('../models/account');
var auth = require('../middlewares/auth');
var secret = 'xxx';
var randomString = require('random-string');

router.get('/reallyMe', auth.verify, function (req, res, next) {
  res.json(req.user);
  console.log(req.user);
});

router.get('/allUser', function (req, res, next) {
  User.find(function (err, users) {
    if (err) return res.status(500).json({ error: err });
    res.json(users);
  });
})

router.get('/user/:id', function (req, res, next) {
  User.find(function (err, users) {
    if (err) return res.status(500).json({ error: err });
    res.json(users);
  });
})

router.get('/:id', function (req, res, next) {
  User.findOne({ _id: req.params.id }, function (err, user) {
    if (err) return res.status(500).json({ error: err });
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user);
  });
})

router.post('/signup', function (req, res) {
  var user = new User();
  user.name = req.body.name;
  user.surname = req.body.surname;
  user.password = bcrypt.hashSync(req.body.password, 10);
  user.email = req.body.email;
  user.iban = randomString();
  user.amount = req.body.amount;
  user.save(function (err, userCreated) {
    if (err) return res.status(400).json(err);
    res.status(201).json(userCreated);
  })
})

router.post('/login', function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    console.log("sono qui")
    console.log(user);
    if (user === null) {
      console.log(token);
      return res.status(404).json({ message: 'User not found' })
    } else if (bcrypt.compareSync(req.body.password, user.password)) {
      var token = jwt.encode(user._id, secret);
      console.log(token);
      return res.json({ token: token });
    } else {
      console.log(token);
      return res.status(401).json({ message: 'password not valid' });
    }
  })
})

router.delete('/:id', function (req, res, next) {
  User.findOne({ _id: req.params.id })
    .exec(function (err, user) {
      if (err) return res.status(500).json({ error: err });
      if (!user) return releaseEvents.status(404).json({ message: "User not found" })
      User.remove({ _id: req.params.id }, function (err) {
        if (err) return res.status(500).json({ error: err })
        res.json({ message: 'User successfully deleted' })
      })
    })
})

router.get('/showAmount', auth.verify, function (req, res){
  res.status(200).json(req.user);
})

module.exports = router
