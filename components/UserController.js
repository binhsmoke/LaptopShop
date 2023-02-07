const controller = require('../components/customers/controller')

class UserController {
 // [GET] /api/users/:id

 async one(req, res, next) {
    const { id } = req.params;
    await controller.getById(id)
        .then(function (result) {
            if (result) {
                res.json(result);
            } else {
                res.json({});
            }
        }).catch(error => {
            res.json(error);
        });
}


 // change info
    async changeName(req, res, next) {
        const { id } = req.params;
        const { name, phone, address, email } = req.body;
        await controller.update(id, name, phone, address, email)
            .then(function (result) {
                if (result) {
                    res.json({ message: 'Đổi tên người dùng thành công' });
                }
            }).catch(error => {
                console.log(error);
            });
    }

    async changePass(req, res, next) {
        const { id } = req.params;
        const { password, newPassword } = req.body;
        const user = await controller.changePass(id, password, newPassword);
        if (user == 1) {
            res.json({ message: 'Mật khẩu hiện tại không đúng', status: false });
        } else {
            res.json({ message: 'Đổi mật khẩu thành công', status: true });
        }
    }
}

module.exports = new UserController();