const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    accountBenefactor: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    accountBeneficiary: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
});

module.exports = mongoose.model('Transaction', TransactionSchema);