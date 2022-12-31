const categoryModel = require('./model');

exports.getCategories = async () =>{
    return categoryModel.find({}, 'id name');
}
