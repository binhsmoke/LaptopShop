const employeeModel = require('./model');

exports.login = async (username) => {
    try {
        const employee = await employeeModel.findOne({ username: username }, 'id username password');
        return employee;
    } catch (error) {
        console.log('service employee err', error)
    }
}

exports.register = async (username, password) => {
    const employee = new employeeModel({ username, password });
    return await employee.save();
}