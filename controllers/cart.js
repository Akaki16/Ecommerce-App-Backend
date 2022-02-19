const router = require('express').Router();
const CartItem = require('../models/cartItem');

// desc: GET all cart items
router.get('/', async (req, res) => {
    const cartItems = await CartItem.find();

    if (cartItems) {
        res.status(200).json(cartItems);
    } else {
        res.status(404).json({ error: 'Cannot get cart items' });
    }
});

// desc: GET single cart item
router.get('/:id', async (req, res) => {
    const cartItem = await CartItem.findById(req.params.id);

    if (cartItem) {
        res.status(200).json(cartItem);
    } else {
        res.status(404).json({ error: 'Cannot get cart item' });
    }
});

// desc: POST/CREATE new cart item
router.post('/', async (req, res) => {
    const body = req.body;

    // create cart item object
    const cartItem = new CartItem({
        img: body.img,
        name: body.name,
        price: body.price,
        quantity: body.quantity
    });

    // save new cart item
    const savedCartItem = await cartItem.save();

    if (savedCartItem) {
        res.status(201).json(savedCartItem);
    } else {
        res.status(400).json({ error: 'Cart Item cannot be created' });
    }
});

// desc: DELETE cart item
router.delete('/:id', async (req, res) => {
    const deletedCartItem = await CartItem.findByIdAndDelete(req.params.id);

    if (deletedCartItem) {
        res.status(204).end();
    } else {
        res.status(400).json({ error: 'Cart Item cannot be deleted' });
    }
});

// desc: UPDATE cart item
router.put('/:id', async (req, res) => {
    const body = req.body;

    const cartItem = {
        img: body.img,
        name: body.name,
        price: body.price,
        quantity: body.quantity
    }

    const updatedCartItem = await CartItem.findByIdAndUpdate(req.params.id, cartItem, { new: true });

    if (updatedCartItem) {
        res.status(201).json(updatedCartItem);
    } else {
        res.status(400).json({ error: 'Cart Item cannot be updated' });
    }
});

// export router
module.exports = router;