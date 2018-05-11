const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    iban: { type: String, unique: true, required: true },
    amount: { type: Number, default: 0, required: true },
    transaction: [{type: Schema.Types.ObjectId, ref: 'Transaction', required: true }]
});

module.exports = mongoose.model('Account', AccountSchema); 