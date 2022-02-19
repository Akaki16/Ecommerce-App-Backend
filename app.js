require('express-async-errors');
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./utils/logger');
const config = require('./utils/config');
const productsRouter = require('./controllers/products');
const cartRouter = require('./controllers/cart');

// connect to the MongoDB database
mongoose.connect(config.DB_URI)
.then(res => {
    logger.info('Successfuly connected to the MongoDB database');
})
.catch(err => {
    logger.error('MongoDB database cannot be connected', err);
});

// init express json middleware
app.use(express.json());

// init cors middleware
app.use(cors());

/* route middlewares */
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

// export app
module.exports = app;