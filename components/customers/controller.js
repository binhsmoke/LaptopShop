const customerService = require("./service");
const bcrypt = require('bcryptjs');

exports.login = async (username, password) => {

    const user = await customerService.login(username);
    let checkPassword;
    if (!user) {
        console.log('no existed username');
        return 1;
    } else {
        checkPassword = await bcrypt.compare(password, user.password);
    }
    if (!checkPassword) {
        console.log('wrong pass');
        return 2;
    }
    console.log('login success');
    return { id: user._id, username: user.username };


}

exports.register = async (username, password, confirmPassword, name, email, phone, address, image) => {

    let user = await customerService.login(username);
    if (user) {
        console.log('existed username');
        return 1;
    }

    const hash = await bcrypt.hash(password, await bcrypt.genSalt(10));
    let customer = await customerService.register(username, hash, name, email, phone, address, image);
    console.log('register success');
    return { _id: customer._id }

};


exports.getCustomers = async () => {
    try {
        let customers = await customerService.getAllCustomer();
        customers = customers.map((item) => {
            item = {
                _id: item._id,
                password: item.password,
                name: item.name,
                email: item.email,
                phone: item.phone,
                address: item.address,
                image: item.image
            }
            return item;
        })
        return customers;
    } catch (error) {
        console.log(error)
        return false;
    }
}
exports.getCustomerById = async (id) => {
    try {
        let customer = await customerService.getCustomerById(id);
        customer = {
            id: customer.id,
            password: customer.password,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            image: customer.image
        }
        return customer;
    }
    catch (error) {
        console.log('error', error);
        return null;
    }
}
exports.delete = async (id) => {
    try {
        await customerService.delete(id);
    } catch (error) {
        return null;
    }
}

exports.getById = async (id) => {
    let customer = await customerService.getById(id);
    customer = {
        ...customer?._doc
    }
    return customer;
}

exports.getAll = async () => {
    let data = await customerService.getAll();
    data = data.map(user => {
        user = {
            ...user?._doc
        }
        return user;
    });
    return data;
}

exports.update = async (id, name, phone, address, email) => {
    return await customerService.update(id, name, phone, address, email);
}

exports.getById = async (id) => {
    let user = await customerService.getById(id);
    user = {
        ...user?._doc
    }
    return user;
}
exports.changePass = async (id, password, newPassword) => {
    const user = await customerService.getById(id);
    //console.log('user: ', user.password);
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
        return 1;
    }
    const hash = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
    return await customerService.updatePassword(id, hash);
}
