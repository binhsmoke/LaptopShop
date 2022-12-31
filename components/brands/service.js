const brandModel = require('./model');

exports.getBrands = async () =>{
    return brandModel.find({}, 'id name');
}
