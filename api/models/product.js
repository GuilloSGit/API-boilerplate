const mongoose = require('mongoose');

const productSchema = mongoose.Schema( {
    _id: mongoose.Schema.Types.ObjectId,
    productName: String,
    price: Number
});

module.exports = mongoose.model('Product', productSchema);