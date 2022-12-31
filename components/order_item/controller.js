const orderItemService = require('./service');

exports.getAll = async (id) => {
    let data = await orderItemService.getAll(id);
    data = data.map(item => {
        item = {
            ...item?._doc
        }
        return item;
    });
    return data;
}


exports.insert = async (body) => {
    return await orderItemService.insert(body);
}



