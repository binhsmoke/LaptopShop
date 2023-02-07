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
            return item.user_id == id;
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
                        }).catch(error => res.json(error));;
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
        // console.log('>>>>orders', orders);
        // console.log('>>>>id', id);
        // console.log('req.params ne >>', req.params)
        if (orders.length > 0) {
            orders = orders.filter(item => {
                return item.user_id.equals(id) && item.status.code == enumStatusOrder.pending.code;
            });
            res.json(orders);
        // console.log('orders ne >>', orders)
        } else {
            res.json(null);
        }
    }

    async shippingList(req, res, next) {
        const { id } = req.params;
        let orders = await orderController.getAll();
        if (orders.length > 0) {
            orders = orders.filter(item => {
                return item.user_id.equals(id) && item.status.code == enumStatusOrder.shipping.code;
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
                return item.user_id.equals(id) && item.status.code == enumStatusOrder.canceled.code;
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
                return item.user_id.equals(id) && item.status.code === enumStatusOrder.taken.code;
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

    async getToday(req, res, next) {
        let today = new Date();
        let endDay = today.setUTCHours(23, 59, 59, 999);
        let startDay = today.setUTCHours(0, 0, 0, 0);
        let orders = await orderController.getDay(startDay, endDay);
        res.json(orders);
    }

    async get10DaysAnalysis(req, res, next) {
        let today = new Date();
        today = today.setUTCHours(23, 59, 59, 999);
        let last = today - (6 * 24 * 60 * 60 * 1000);
        last = new Date(last);
        last = last.setUTCHours(0, 0, 0, 0);
        today = new Date(today);
        last = new Date(last);
        let list10Days = [];
        for (var i = 0; i <= 7; i++) {
            var value = new Date(today - (i * 24 * 60 * 60 * 1000));
            value.setUTCHours(0, 0, 0, 0);
            value = new Date(value);
            var day = value.getDay();
            list10Days.push({ date: value, day: convertDay(day), total: 0 });
        }
        const listOrder = await orderController.getDay(last, today)
            .then((result) => {
                if (result) {
                    result = result.map(element => {
                        element = {
                            date: new Date(new Date(element.updatedAt).setUTCHours(0, 0, 0, 0)),
                            total: element.total
                        }
                        return element;
                    });
                    return result;
                }
            })
            .then((result) => {
                list10Days = list10Days.concat(result);
                const list = list10Days.reduce((acc, element) => {
                    if (element.date in acc) {
                        acc[element.date].total = element.total + acc[element.date].total
                    } else {
                        acc[element.date] = element;
                    }
                    return acc;
                }, {});
                const list1 = Object.values(list);
                res.json(list1.reverse());
            })
            .catch(error => res.json(error));
    }

    async getAll(req, res, next) {
        let orders = await orderController.getAll();
        res.json(orders);
    }

    async getSold(req, res, next) {
        let orders = await orderController.getAll();
        orders = orders.filter(item => {
            return item.status.code == 3;   //get don hang thanh cong
        })
        res.json(orders);
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
  function convertDay(day) {
    switch (day) {
        case 0:
            return 'CN';
        case 1:
            return 'T2';
        case 2:
            return 'T3';
        case 3:
            return 'T4';
        case 4:
            return 'T5';
        case 5:
            return 'T6';
        case 6:
            return 'T7';
    }
}
module.exports = new OrderController();