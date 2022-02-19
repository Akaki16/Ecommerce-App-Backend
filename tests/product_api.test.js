const Product = require('../models/product');
const app = require('../app');
const mongoose = require('mongoose');
const supertest = require('supertest');
const request = supertest(app);

jest.setTimeout(100000);

const initialProducts = [
    {
        category: "Notebooks",
        name: "Acer TravelMate TMB118+150 GEL Voucher",
        img: "https://pcshop.ge/wp-content/uploads/I23036-1.jpg",
        description: "Acer TravelMate TMB118-M-C6JP Notebook (Black) – Intel Celeron N4120 1.1~2.6GHz (4-Cores, 4-Threads, 4MB Cache), 4GB DDR4 Soldered (No Slot), 64GB Flash Memory (eMMC), 11.6″ HD TN Anti-Glare 1366 x 768, Intel UHD 600 Graphics, Stereo Speakers, Dual Microphone, HD Camera, Spill-resistant Keyboard (US/RU), TPM, Gigabit Ethernet, Wi-Fi 5 (ac), Bluetooth; SD Card Reader, HDMI, RJ-45, 1 x USB 3.1 Gen1, 1 x USB 3.0, 1 x USB 2.0, Audio Combo Jack, 36Wh Li-ion (4-cell) Battery, 45W 100-240V (50-60Hz), European Power Cord, Weight: 1.53 kg, 1 Year Warranty [p/n NX.VHSER.00A] SKU:I23036",
        price: "1,049",
        id: "62111c40eb966be25a71b74b"
    },
    {
        category: "Notebooks",
        name: "DELL Vostro 3500",
        img: "https://pcshop.ge/wp-content/uploads/I22038.jpg",
        description: "DELL Vostro 3500 Notebook (Black) – Intel Core i3-1115G4 3.0~4.1GHz (2-Cores, 4-Threads, 6MB Cache), 8GB DDR4 3200 SODIMM (2 Slots, Up to 16GB), 256GB SSD NVMe (M.2 PCIe) + 2.5″ HDD/SSD Bay, 15.6″ Full HD IPS Anti-Glare 1920 x 1080 (220 nit), Intel UHD Graphics, 2 x 2W Stereo Speakers, Single Digital Microphone, HD Camera, Keyboard (US/RU), TPM, Gigabit Ethernet, Wi-Fi 5 (ac), Bluetooth 5.0; SD Card Reader, HDMI 1.4, RJ-45, 2 x USB 3.2 Gen1, 1 x USB 2.0, Audio Combo Jack, 42Wh Lithium Polymer (3-cell) Battery, 45W 100-240V (50/60Hz), European Power Cord, Weight: 1.78 kg, FreeDOS, 3 Years Warranty [p/n N3001VN3500EMEA01_2201_UBU] SKU:I22038",
        price: "1,899",
        id: "621120e53afcf21757de3451"
    }
];

// this functionalty ensures that everytime we run the tests database will be in the same state as before
beforeEach(async () => {
    await Product.deleteMany({});
    let productObject = new Product(initialProducts[0]);
    await productObject.save();
    productObject = new Product(initialProducts[1]);
    await productObject.save();
});

describe('getting products', () => {
    test('all articles are returned', async () => {
        const response = await request.get('/api/products');
        expect(response.body).toHaveLength(initialProducts.length);
    });

    test('products when given invalid endpoint are not returned', async () => {
        await request.get('/api/productss').expect(404);
    });

    test('single product is returned', async () => {
        const products = await request.get('/api/products');
        await request
            .get(`/api/products/${products.body[0].id}`)
            .expect(200)
    });

    test(`first product is named ${initialProducts[0].name}`, async () => {
        const response = await request.get('/api/products');
        expect(response.body[0].name).toBe(initialProducts[0].name);
    });

    test('product with malformatted id is not returned', async () => {
        const products = await request.get('/api/products');
        let productToGet = products.body[0];
        productToGet.id = 'dadasdsaewqe1q231';
        await request
            .get(`/api/products/${productToGet.id}`)
            .expect(500)
    });
});

describe('adding products', () => {
    test('product can be added', async () => {
        const product = {
            category: "Notebooks",
            name: "Acer TravelMate TMB118+150 GEL Voucher",
            img: "https://pcshop.ge/wp-content/uploads/I23036-1.jpg",
            description: "Acer TravelMate TMB118-M-C6JP Notebook (Black) – Intel Celeron N4120 1.1~2.6GHz (4-Cores, 4-Threads, 4MB Cache), 4GB DDR4 Soldered (No Slot), 64GB Flash Memory (eMMC), 11.6″ HD TN Anti-Glare 1366 x 768, Intel UHD 600 Graphics, Stereo Speakers, Dual Microphone, HD Camera, Spill-resistant Keyboard (US/RU), TPM, Gigabit Ethernet, Wi-Fi 5 (ac), Bluetooth; SD Card Reader, HDMI, RJ-45, 1 x USB 3.1 Gen1, 1 x USB 3.0, 1 x USB 2.0, Audio Combo Jack, 36Wh Li-ion (4-cell) Battery, 45W 100-240V (50-60Hz), European Power Cord, Weight: 1.53 kg, 1 Year Warranty [p/n NX.VHSER.00A] SKU:I23036",
            price: "1,049",
        };

        await request
            .post('/api/products')
            .send(product)
            .expect(201)
    });

    test('product without providing price cannot be added', async () => {
        const product = {
            category: "Notebooks",
            name: "Acer TravelMate TMB118+150 GEL Voucher",
            img: "https://pcshop.ge/wp-content/uploads/I23036-1.jpg",
            description: "Acer TravelMate TMB118-M-C6JP Notebook (Black) – Intel Celeron N4120 1.1~2.6GHz (4-Cores, 4-Threads, 4MB Cache), 4GB DDR4 Soldered (No Slot), 64GB Flash Memory (eMMC), 11.6″ HD TN Anti-Glare 1366 x 768, Intel UHD 600 Graphics, Stereo Speakers, Dual Microphone, HD Camera, Spill-resistant Keyboard (US/RU), TPM, Gigabit Ethernet, Wi-Fi 5 (ac), Bluetooth; SD Card Reader, HDMI, RJ-45, 1 x USB 3.1 Gen1, 1 x USB 3.0, 1 x USB 2.0, Audio Combo Jack, 36Wh Li-ion (4-cell) Battery, 45W 100-240V (50-60Hz), European Power Cord, Weight: 1.53 kg, 1 Year Warranty [p/n NX.VHSER.00A] SKU:I23036",
        };

        await request
            .post('/api/products')
            .send(product)
            .expect(500)
    });
});

describe('deleting products', () => {
    test('product can be deleted', async () => {
        const products = await request.get('/api/products');
        const productToDelete = products.body[0];

        await request
            .delete(`/api/products/${productToDelete.id}`)
            .expect(204)
    });

    test('product with malformatted id cannot be deleted', async () => {
        const products = await request.get('/api/products');
        let productToGet = products.body[0];
        productToGet.id = 'dadasdsaewqe1q231';
        await request
            .delete(`/api/products/${productToGet.id}`)
            .expect(500)
    });
});

describe('updating products', () => {
    test('product can be updated', async () => {
        const updatedProduct = {
            category: "Category Update",
            name: "Name Update",
            img: "img update",
            description: "description update",
            price: "price update"
        };

        const products = await request.get('/api/products');
        const productToUpdate = products.body[0];

        await request
            .put(`/api/products/${productToUpdate.id}`, updatedProduct)
            .expect(201)
    });

    test('product with malformatted id cannot be updated', async () => {
        const updatedProduct = {
            category: "Category Update",
            name: "Name Update",
            img: "img update",
            description: "description update",
            price: "price update"
        };

        const products = await request.get('/api/products');
        let productToUpdate = products.body[0];
        productToUpdate.id = 'daseswe21e12edsa8';

        await request
            .put(`/api/products/${productToUpdate.id}`, updatedProduct)
            .expect(500)
    });
});

// after everything is done close the connection
afterAll(() => {
    mongoose.connection.close();
});