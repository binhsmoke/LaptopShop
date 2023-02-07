const customerModel = require('./model');

exports.login = async (username) => {
    const customer = await customerModel.findOne({ username: username }, 'id username password');
    return customer;
}

exports.register = async (username, password, name, email, phone, address, image) => {
    const customer = new customerModel({ username, password, name, email, phone, address, image });
    return await customer.save();
}

exports.getAllCustomer = async () => {
    return await customerModel.find();
}

exports.delete = async (id) => {
    await customerModel.findByIdAndDelete(id);
}
exports.getCustomerById = async (id) => {
    const customer = await customerModel.findById(id);
    return customer;
};

exports.getById = async (id) => {
    const user = await customerModel.findById(id);
    return user;
}

exports.getAll = async () => {
    const users = customerModel.find().sort({ username: 1});
    return users;
}

exports.update = async (id, name, phone, address, email) => {
    return await customerModel.findByIdAndUpdate(id, {name:name , phone:phone, email:email, address: address});
}

exports.updatePassword = async (id, newPassword) => {
    return await customerModel.findByIdAndUpdate(id, {password: newPassword});
}
exports.getByEmail = async (email) => {
    const user = await customerModel.findOne({ email })
    return user
}


exports.updatePassword = async (user) => {
    await customerModel.updateOne(
        { _id: user._id },
        {
            $set:
            {
                password: user.password,
            }
        }
    )
}
