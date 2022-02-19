const CartItem = require('../models/cartItem');
const app = require('../app');
const mongoose = require('mongoose');
const supertest = require('supertest');
const request = supertest(app);

jest.setTimeout(100000);

const initialCartItems = [
    {
        name: "Acer TravelMate TMB118+150 GEL Voucher",
        img: "https://pcshop.ge/wp-content/uploads/I23036-1.jpg",
        price: "1,049",
        quantity: 1,
        id: "62111c40eb966be25a71b74b"
    },
    {
        name: "DELL Vostro 3500",
        img: "https://pcshop.ge/wp-content/uploads/I22038.jpg",
        price: "1,899",
        quantity: 1,
        id: "621120e53afcf21757de3451"
    }
];

// this functionalty ensures that everytime we run the tests database will be in the same state as before
beforeEach(async () => {
    await CartItem.deleteMany({});
    let cartItemObject = new CartItem(initialCartItems[0]);
    await cartItemObject.save();
    cartItemObject = new CartItem(initialCartItems[1]);
    await cartItemObject.save();
});

describe('getting cart items', () => {
    test('all cart items are returned', async () => {
        const response = await request.get('/api/cart');
        expect(response.body).toHaveLength(initialCartItems.length);
    });

    test('when given invalid endpoint cart items are not returned', async () => {
        await request.get('/api/cartt').expect(404);
    });

    test('single cart item is returned', async () => {
        const cartItems = await request.get('/api/cart');
        const cartItemToGet = cartItems.body[0];

        await request
            .get(`/api/cart/${cartItemToGet.id}`)
            .expect(200)
    });

    test('cart item with malformatted is not returned', async () => {
        const cartItems = await request.get('/api/cart');
        let cartItemToGet = cartItems.body[0];
        cartItemToGet.id = 'dasdasewease1232131';

        await request
            .get(`/api/cart/${cartItemToGet.id}`)
            .expect(500)
    });
});

describe('adding cart items', () => {
    test('cart item can be added', async () => {
        const cartItem = {
            img: "https://pcshop.ge/wp-content/uploads/I22038.jpg",
            name: "DELL Vostro 3500",
            price: "1,899",
            quantity: 1
        };
    
        await request
            .post('/api/cart')
            .send(cartItem)
            .expect(201)
    });

    test('cart item without providing price cannot be added', async () => {
        const cartItem = {
            img: "https://pcshop.ge/wp-content/uploads/I22038.jpg",
            name: "DELL Vostro 3500",
            quantity: 1
        };

        await request
            .post('/api/cart')
            .send(cartItem)
            .expect(500)
    });
});

describe('deleting cart items', () => {
    test('cart item can be deleted', async () => {
        const cartItems = await request.get('/api/cart');
        const cartItemToDelete = cartItems.body[0];

        await request
            .delete(`/api/cart/${cartItemToDelete.id}`)
            .expect(204)
    });

    test('cart item with malformatted id cannot be deleted', async () => {
        const cartItems = await request.get('/api/cart');
        let cartItemToDelete = cartItems.body[0];
        cartItemToDelete.id = 'dsadase313187dashj3189';

        await request
            .delete(`/api/cart/${cartItemToDelete.id}`)
            .expect(500)
    });
});

describe('updating cart items', () => {
    test('cart item can be updated', async () => {
        const updatedCartItem = {
            img: "https://pcshop.ge/wp-content/uploads/I22038.jpg",
            name: "DELL Vostro 3500",
            price: "1,899",
            quantity: 2
        };

        const cartItems = await request.get('/api/cart');
        const cartItemToUpdate = cartItems.body[0];

        await request
            .put(`/api/cart/${cartItemToUpdate.id}`, updatedCartItem)
            .expect(201)
    });

    test('cart item with malformatted id cannot be updated', async () => {
        const updatedCartItem = {
            img: "https://pcshop.ge/wp-content/uploads/I22038.jpg",
            name: "DELL Vostro 3500",
            price: "1,899",
            quantity: 2
        };

        const cartItems = await request.get('/api/cart');
        let cartItemToUpdate = cartItems.body[0];
        cartItemToUpdate.id = 'dasdae13919dasd78da78341';

        await request
            .put(`/api/cart/${cartItemToUpdate.id}`, updatedCartItem)
            .expect(500)
    });
});

// after everything is done close the connection
afterAll(() => {
    mongoose.connection.close();
});