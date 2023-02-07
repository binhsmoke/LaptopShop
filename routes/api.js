var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const session = require('express-session');
const employeeController = require('../components/employee/controller');
const customerController = require('../components/customers/controller');
const productController = require('../components/products/controller');
const orderController = require('../components/OrderController');
const UserController = require("../components/UserController");
const otpController = require('../components/otp/controller')

/* API EMPLOYEE. */
router.post("/login", async function (req, res, next) {
    const { username, password } = req.body;
    const employee = await employeeController.login(username, password);
    if (employee) {
        const token = jwt.sign({ id: employee._id, username: employee.username }, 'mykey');
        req, session.token = token;
        res.redirect('/home');
    } else {
        res.redirect('/login');
    }
});

router.post("/register", async function (req, res, next) {
    const { username, password, confirmPassword } = req.body;
    const employee = await employeeController.register(username, password, confirmPassword);
    if (employee) {
        res.json({ status: true })
    } else {
        res.json({ status: false })
    }
});

/* API CUSTOMER. */
router.post("/customer/login", async function (req, res, next) {
    const { username, password } = req.body;
    const result = await customerController.login(username, password);
    if (result == 1) {
        res.json({ status: false, message: "Username chưa được đăng ký" });
    } else if (result == 2) {
        res.json({ status: false, message: "Sai mật khẩu" });
    }
    else {
        const token = jwt.sign({ id: result._id, username: result.username }, 'mykey');
        console.log(result)
        res.json({ status: true, message: "Đăng nhập thành công", token, _id: result.id });
    }
});

router.post("/customer/register", async function (req, res, next) {
    const { username, password, confirmPassword, name, email, phone, address } = req.body;
    const result = await customerController.register(username, password, confirmPassword, name, email, phone, address);
    if (result == 1) {
        res.json({ status: false, message: "User name đã được đăng ký trước đó" });
    }
    else {
        res.json({ status: true, message: "Đăng ký tài khoản thành công" });
    }
});

/* API PRODUCT. */
router.get("/products", async function (req, res, next) {
    const { sort } = req.query;
    console.log('sortttt', sort);
    const products = await productController.getProducts(sort);
    res.json(products);
});

router.get("/products/:id/detail", async function (req, res, next) {
    const { id } = req.params;
    const product = await productController.getProductById(id);
    res.json(product);
});
router.get("/customers", async function (req, res, next) {
    const { id } = req.params;
    const customer = await customerController.getCustomers();
    res.json(customer);
});
router.get("/customers/:id/detail", async function (req, res, next) {
    const { id } = req.params;
    const customer = await customerController.getCustomerById(id);
    res.json(customer);
});

router.post('/sendMailForgotPassword', async (req, res, next) => {
    const { email } = req.body
    const result = await otpController.sendEmail(email)
    res.status(result.status).json(result)
})

router.post('/verifyOtp', async (req, res, next) => {
    const { email, codeOtp, newPassword } = req.body
    const result = await otpController.verify(email, codeOtp, newPassword)
    res.status(result.status).json(result)
})

router.post('/customers/:id/cart/checkout', orderController.create);
router.get('/customers/:id/orders', orderController.index);
router.get('/customers/:id/orders/pending/get', orderController.pendingList);
router.get('/customers/:id/orders/shipping/get', orderController.shippingList);
router.get('/customers/:id/orders/cancel/get', orderController.cancelList);
router.get('/customers/:id/orders/taken/get', orderController.takenList);
router.post('/customers/:id/orders/:ido/cancel', orderController.cancelByUser);
router.post('/customers/:id/orders/:ido/receive', orderController.receive);
router.get('/customers/:id/orders/:ido', orderController.one);
//
// router.get('/orders', orderController.indexweb);



//user router
router.get('/customers/:id', UserController.one);
router.post('/customers/:id/changeName', UserController.changeName);
router.post('/customers/:id/changePass', UserController.changePass);
module.exports = router;