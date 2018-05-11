var Trans = require('../models/transaction')
var User = require('../models/account');
var auth = require('../middlewares/auth');

var isIbanExisting = function (req, res, next) {
    User.findOne({ iban: req.body.iban }, function (err, user) {
        console.log(user)
        if (user === null) {
            return res.status(404).json({ message: 'Iban not exist' })
        } else {
            req.beneficiary = user;
            next();
        }
    })
}

var haveCredit = function (req, res, next) {
    if (req.user.amount < req.body.amount) {
        return res.status(409).json({ message: 'Insufficient money' })
    } else {
        next();
    }
}

module.exports.haveCredit = haveCredit;
module.exports.isIbanExisting = isIbanExisting