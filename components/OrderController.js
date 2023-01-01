const orderController = require('../components/orders/controller');
const productController = require('../components/products/controller');
const customerController = require('../components/customers/controller');
// const cartController = require('../components/cart_item/controller');
const orderItemController = require('../components/order_item/controller');
const { enumStatusOrder } = require('../utils/constants');

class OrderController {

    // mobile app// mobile app// mobile app// mobile app// mobile app// mobile app// mobile app// mobile app// mobile app// mobile app// mobile app// mobile app
    async index(req, res, next) {
        const { id } = req.params;
        let orders = await orderController.getAll();
        orders = orders.filter(item => {
            return item.user_id._id == id;
        });
        res.json(orders);
    }
    async create(req, res, next) {
        const { id } = req.params;
        let { body } = req;
        // console.log("body>>", body);
        const data = {
            user_id: body.userID,
            payment_id: body.payment_id,
            status: enumStatusOrder.pending,
            total: body.total,
        }
        if (data.total == 0) {
            res.json({ message: 'Không có sản phẩm nào được mua' });
        } else {
            await orderController.insert(data)
                .then(async result => {
                    if (result) {
                        const result1 = body.cart.map(async item => {
                            const orderDetail = {
                                order_id: result._id,
                                quantity: item.quantity,
                                product_each: item.product
                            }
                            await orderItemController.insert(orderDetail);
                        });
                        Promise.all(result1).then(() => {
                            res.json({ message: 'Thanh toán thành công' })
                            .catch(error => res.json(error));
                        });
                    }
                })
                .catch();
        }
    }
    async one(req, res, next) {
        const {
            id, ido
        } = req.params;
        const order = await orderController.getById(ido);
        const user = await customerController.getById(id);
        const orderItem = await orderItemController.getAll(ido);
        const list = orderItem.map(async (item) => {
            const p = await productController.getById(item.product_each);
            item = {
                name: p.name,
                price: p.price,
                image: p.image,
                quantity: item.quantity
            }
            return item;
        })
        Promise.all(list).then((list) => {
            res.json({
                order: order,
                user: user,
                list: list
            })
        })
            .catch(error => res.json(error));
    }
    async pendingList(req, res, next) {
        const { id } = req.params;
        let orders = await orderController.getAll();
        if (orders.length > 0) {
            orders = orders.filter(item => {
                return item.user_id._id == id && item.status.code == enumStatusOrder.pending.code;
            });
            res.json(orders);
        } else {
            res.json(null);
        }
    }

    async shippingList(req, res, next) {
        const { id } = req.params;
        let orders = await orderController.getAll();
        if (orders.length > 0) {
            orders = orders.filter(item => {
                return item.user_id._id == id && item.status.code == enumStatusOrder.shipping.code;
            });
            res.json(orders);
        } else {
            res.json(null);
        }
    }

    //get cancel
    async cancelList(req, res, next) {
        const { id } = req.params;
        let orders = await orderController.getAll();
        if (orders.length > 0) {
            orders = orders.filter(item => {
                return item.user_id._id == id && item.status.code == enumStatusOrder.canceled.code;
            });
            res.json(orders);
        } else {
            res.json(null);
        }
    }
    //post cancel
    async cancelByUser(req, res, next) {
        const { id, ido } = req.params;
        await orderController.update(ido, enumStatusOrder.canceled)
            .then(() => {
                res.json({ message: 'Đã hủy đơn hàng' });
            })
            .catch(error => res.json(error));
    }

        //post take
        async receive(req, res, next) {
            const { id, ido } = req.params;
            await orderController.update(ido, enumStatusOrder.taken)
                .then(() => {
                    res.json({ message: 'Đã thanh toán' });
                })
                .catch(error => res.json(error));
        }
    //get taken
    async takenList(req, res, next) {
        const { id } = req.params;
        let orders = await orderController.getAll();
        if (orders.length > 0) {
            orders = orders.filter(item => {
                return item.user_id._id == id && item.status.code === enumStatusOrder.taken.code;
            });
            res.json(orders);
        } else {
            res.json(null);
        }
    }

    //web//web//web//web//web//web//web//web//web//web//web//web//web//web//web//web//web//web//web
    async indexweb(req, res, next) {
        const orders = await orderController.getAll();
        orders.forEach(item => {item.total= numberWithComma(item.total)})
        res.render('orders', { orders });
    }


    async oneweb(req, res, next) {
        const {
            id
        } = req.params;

        const order = await orderController.getById(id);
        const _user = await customerController.getById(order.user_id);
        const orderItem = await orderItemController.getAll(id);
        const list = orderItem.map(async (item) => {
            const p = await productController.getById(item.product_each);
            item = {
                name: p.name,
                price: numberWithComma(p.price),
                image: p.image,
                quantity: item.quantity
            }
            return item;
        })
        let isConfirmable = order.status.code == 1;
        let isCancelable= order.status.code == 1|| order.status.code==2 
        let formatTotal = numberWithComma(order.total)
        Promise.all(list).then((list) => {
            res.render('order_detail', { order, _user, list,isConfirmable,isCancelable,formatTotal });
        });
    }


    async ok(req, res, next) {
        const { id } = req.params;
        await orderController.update(id, enumStatusOrder.shipping)
            .then(() => {
                res.redirect('/orders');
            })
            .catch(error => res.json(error));
    }

    async cancel(req, res, next) {
        const { id } = req.params;
        await orderController.update(id, enumStatusOrder.canceled)
            .then(() => {
                res.redirect('/orders');
            })
            .catch(error => res.json(error));
    }

    async pending(req, res, next) {
        const { id } = req.params;
        await orderController.update(id, enumStatusOrder.pending)
            .then(() => {
                res.redirect('/orders');
            })
            .catch(error => res.json(error));
    }
}


//format
const numberWithComma = x => {
    try {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    } catch (error) {
      console.log(error);
    }
  };

module.exports = new OrderController();