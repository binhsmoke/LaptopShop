const productService = require('./service');
const date = require('../../utils/date');

exports.getProducts = async (sort) => {
    try {
        let products = await productService.getAllProduct();
        let newProducts = [];
        if (sort === 'asc') {
            newProducts = products.sort((p1, p2) => {
                return p2.price - p1.price;
            })
        } else {// sort desc
            newProducts = products.sort((p1, p2) => {
                return p1.price - p2.price;
            })
        }
        // console.log("product", products)
        newProducts = newProducts.map((item) => {
            item = {
                _id: item._id,
                categoryId: item.categoryId,
                brandId: item.brandId,
                name: item.name,
                price: item.price,
                image: item.image,
                image1: item.image1,
                image2: item.image2,
                image3: item.image3,
                image4: item.image4,
                quantity: item.quantity,
                description: item.description,
                released: date.format(item.released),
            }
            return item;
        })
        return newProducts;
    } catch (error) {
        console.log(error)
        return false;
    }
}

exports.getProductById = async (id) => {
    try {
        let product = await productService.getProductById(id);
        product = {
            _id: product._id,
            categoryId: product.categoryId,
            brandId: product.brandId,
            name: product.name,
            price: product.price,
            image: product.image,
            image1: product.image1,
            image2: product.image2,
            image3: product.image3,
            image4: product.image4,
            quantity: product.quantity,
            description: product.description,
            released: date.format(product.released),
        }
        return product;
    }
    catch (error) {
        console.log('error', error);
        return null;
    }
}


exports.insert = async (product) => {
    try {
        await productService.insert(product);
    } catch (error) {
        return null;
    }
}

exports.update = async (id, product) => {
    try {
        await productService.update(id, product);
    } catch (error) {
        return null;
    }
}

exports.delete = async (id) => {
    try {
        await productService.delete(id);
    } catch (error) {
        return null;
    }
}


exports.getById = async (id) => {
    let product = await productService.getById(id);
    product = {
        ...product?._doc
    }
    return product;
}