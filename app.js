var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var app = express();
var cors = require('cors')

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/BankingAC');

var account = require('./routes/account');
var transaction = require('./routes/transaction');

var db = mongoose.connection;
db.on('error', function () {
    console.error('Connection error!')
});

db.once('open', function () {
    console.log('DB connection Ready');
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use('/account', account);
app.use('/trans', transaction);

module.exports = app;