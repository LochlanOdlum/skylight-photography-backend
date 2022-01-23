const express = require('express');

const validationRules = require('../middlewares/validators/rules');
const validators = require('../middlewares/validators/validators');
const productController = require('../controllers/shop');
const isAuth = require('../middlewares/is-auth');
const fetchUser = require('../middlewares/fetch-user');

const router = express.Router();

router.get('/products', productController.getProducts);

router.get('/products/:id', productController.getProduct);

router.get('/collections', productController.getCollections);

router.post('/startOrder', isAuth, fetchUser, productController.startOrder);

router.get('/myOrder/:id', isAuth, validationRules.getMyOrder(), validators.validate, productController.getMyOrder);

router.get('/myOrders', isAuth, fetchUser, productController.getMyOrders);

router.get('/order/success/:paymentIntentId', isAuth, productController.orderSuccess);

module.exports = router;
