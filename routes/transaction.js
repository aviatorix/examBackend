var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var User = require('../models/account');
var Trans = require('../models/transaction')
var auth = require('../middlewares/auth');
var secret = 'xxx';
var verifyTrans = require('../middlewares/verifyTransaction')

var presentUser = function (req, res, next) {
    if (req.params.id === undefined) return res.status(404).json({ message: 'user not available no alternative found' });
    if (req.params.id) {
        User.findById(req.params.id, function (err, userTried) {
            if (err) return res.status(500).json({ message: err });
            req.userTried = userTried; //volo trovato
            console.log(req.userTried)
            next();
        })
    }
}
/* post in cui  manca il push

router.post('/doTrans/:id', auth.verify, presentUser, verifyTrans.isIbanExisting, verifyTrans.haveCredit, function (req, res) {
    var trans = new Trans();
    trans.accountBenefactor = req.user._id;
    trans.accountBeneficiary = req.beneficiary._id;
    trans.amount = req.body.amount;

    req.user.amount = parseInt(req.user.amount) - parseInt(req.body.amount);
    req.beneficiary.amount = parseInt(req.beneficiary.amount) + parseInt(req.body.amount);
    
    req.user.save();
    req.beneficiary.save();

    trans.save(function (err, transDone) {
        if (err) return res.status(500).json(err);
        res.status(201).json(transDone);
    })
})
**/

router.post('/doTrans/:id', auth.verify, presentUser, verifyTrans.isIbanExisting, verifyTrans.haveCredit, function (req, res) {
    var trans = new Trans();
    console.log('dove sono')
    console.log(req.user)
    trans.accountBenefactor = req.user._id;
    trans.accountBeneficiary = req.beneficiary._id;
    trans.amount = req.body.amount;
    trans.save(function (err, transCreated) {
        if (err) return res.status(500).json({ message: err });
        if (err) return res.status(400).json(err);
        console.log('transCreated._id ' + transCreated._id)
        req.userTried.transaction.push(transCreated._id);
        req.userTried.save(function (err, bookSaved) {
            if (err) return res.status(500).json({ message: err });
            User.findById(req.user._id, function (err, user) {
                if (err) return res.status(500).json({ error: err });
                user.transaction.push(transCreated._id);
                user.save(function (err, TransSavedInUser) {
                    res.status(201).json({
                        "Transaction-Created": transCreated
                    });
                })
            })
        })
    })
})

router.get('/showAccount', function (req, res) {
    if (req.query === undefined) return res.status(404).json({ message: 'no search field entered' });
    if (req.query.id != undefined) {
        User.findById(req.query.id).select('transaction').populate('transactions', '_id')
            .exec(function (err, transaction) {
                if (err) return res.status(500).json({ error: err });
                console.log(transaction)
                res.json(transaction)
            })
    }
    else return res.status(404).json({ message: 'no search field entered' });
})


module.exports = router