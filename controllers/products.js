const router = require('express').Router();
const Product = require('../models/product');

// desc: GET all products
router.get('/', async (req, res) => {
    const products = await Product.find();
    if (products) {
        res.status(200).json(products);
    } else {
        res.status(404).json({ error: 'Cannot get products' });
    }
});

// desc: GET single product
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json({ error: 'Cannot get product' });
    }
});

// desc: POST/CREATE new product
router.post('/', async (req, res) => {
    const body = req.body;

    // create product object
    const product = new Product({
        category: body.category,
        name: body.name,
        img: body.img,
        description: body.description,
        price: body.price
    });

    // save new product
    const savedProduct = await product.save();

    if (savedProduct) {
        res.status(201).json(savedProduct);
    } else {
        res.status(400).json({ error: 'Product cannot be created' });
    }
});

// desc: DELETE product
router.delete('/:id', async (req, res) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (deletedProduct) {
        res.status(204).end();
    } else {
        res.status(400).json({ error: 'Product cannot be deleted' });
    }
});

// desc: UPDATE product
router.put('/:id', async (req, res) => {
    const body = req.body;

    const product = {
        category: body.category,
        name: body.name,
        img: body.img,
        description: body.description,
        price: body.price
    };

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, product, { new: true });

    if (updatedProduct) {
        res.status(201).json(updatedProduct);
    } else {
        res.status(400).json({ error: 'Product cannot be updated' });
    }
});

// export router
module.exports = router;