const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define cart item schema
const cartItemSchema = new Schema({
    img: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: String,  required: true},
    quantity: { type: Number, required: true }
});

// transform cart item schema
cartItemSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(),
        delete returnedObject._id,
        delete returnedObject.__v
    }
});

// create cart item model which extends cart item schema
const CartItem = mongoose.model('CartItem', cartItemSchema);

// export cart item model
module.exports = CartItem;