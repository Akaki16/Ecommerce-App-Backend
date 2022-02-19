const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define product schema
const productSchema = new Schema({
    category: { type: String, required: true },
    name: { type: String, required: true },
    img: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
});

// transform product schema
productSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(),
        delete returnedObject._id,
        delete returnedObject.__v
    }
});

// create product model which extends product schema
const Product = mongoose.model('Product', productSchema);

// export product model
module.exports = Product;