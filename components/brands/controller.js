const brandService = require('./service');

exports.getBrands = async () => {
    const data = await brandService.getBrands();
    return data;
}

exports.getBrandsSelected = async (id) => {
    let data = await brandService.getBrands();
    data = data.map(item => {
        item = {
            _id: item._id,
            name: item.name,
            selected: item._id == id
        }
        return item;
    })
    return data;
}