var express = require("express");
var router = express.Router();

const upload = require("../utils/upload");
const brandController = require("../components/brands/controller");
const categoriesController = require("../components/categories/controller");
const productController = require("../components/products/controller");
const customerController = require("../components/customers/controller");
const employeeController = require("../components/employee/controller");
const productModel = require("../components/products/model");
const customerModel = require("../components/customers/model");
const employeeModel = require("../components/employee/model");
const orderController = require("../components/OrderController");
/* EMPLOYEE. */
router.get("/login", function (req, res, next) {
  res.render("login");
});
router.get("/logout", async function (req, res, next) {
  req.session.destroy(function (err) {
    res.redirect("/login");
  });
});

router.get("/products", async function (req, res, next) {
  const name = req.query.name;
  if (name) {
    productModel
      .find({ name: { $regex: new RegExp(name), $options: "i" } })
      .then((data) => {
        res.render("products", { products: data });
      });
  } else {
    const data = await productController.getProducts();
    data.forEach((item) => (item.price = numberWithComma(item.price)));
    res.render("products", { products: data });
  }
});

router.get("/product_insert", async function (req, res, next) {
  const categories = await categoriesController.getCategories();
  const brands = await brandController.getBrands();
  res.render("product_insert", { categories: categories, brands: brands });
});
router.post("/login", async function (req, res, next) {
  const { username, password } = req.body;
  // tiến hành đăng nhập
  const user = await employeeController.login(username, password);
  if (user) {
    // const token = jwt.sign({ id: user._id, username: user.username }, 'mykey');
    // req.session.token = token;
    console.log("ok");
    res.redirect("/products");
  } else {
    console.log("login wrong");
    res.redirect("/login");
  }
});
router.post("/", [upload.single("image")], async function (req, res, next) {
  let { body, file } = req;
  const listPro = await productController.getProducts();
  const check = listPro.filter((item) => item.name == body.name);
  if(check.length <=0) {
    let image = "";
    if (file) {
      // image = `http://192.168.43.229/images/${file.filename}`
      image = `http://localhost:3001/images/${file.filename}`;
      body = { ...body, image };
    }
    await productController.insert(body);
    // console.log("req.file", file);
    res.redirect("/products");
  }else{
    res.send(`<script>alert("Sản phẩm đã tồn tại"); window.location.href = "/product_insert"; </script>`);
  };
});

router.delete("/:id/delete", async function (req, res, next) {
  const { id } = req.params;
  await productController.delete(id);
  res.json({ result: true });
});

router.get("/:id/product_update", async function (req, res, next) {
  const { id } = req.params;
  const product = await productController.getProductById(id);
  // console.log("product", product);
  const categories = await categoriesController.getCategoriesSelected(
    product.categoryId._id
  );
  const brands = await brandController.getBrandsSelected(product.brandId._id);
  res.render("product_update", {
    product: product,
    categories: categories,
    brands: brands,
  });
});

router.post(
  "/:id/product_update",
  [upload.single("image")],
  async function (req, res, next) {
    let { body, file, params } = req;
    delete body.image;
    if (file) {
      // let image = `http://192.168.43.229:3001/images/${file.filename}`
      let image = `http://localhost:3001/images/${file.filename}`;
      body = { ...body, image };
    }
    await productController.update(params.id, body);
    res.redirect("/products");
  }
);

/* CUSTOMER. */
router.get("/customers", async function (req, res, next) {
  const name = req.query.name;
  if (name) {
    customerModel
      .find({ name: { $regex: new RegExp(name), $options: "i" } })
      .then((data) => {
        res.render("customers", { customers: data });
      });
  } else {
    const data = await customerController.getCustomers();
    const customers = data.map((c)=>{
      c={
        ...c,
        idU: c._id.toString().slice(-4)
      }
      return c
    })
    res.render("customers", { customers: customers });
  }
});

router.delete("/:id/deleteCustomer", async function (req, res, next) {
  const { id } = req.params;
  await customerController.delete(id);
  res.json({ result: true });
});

router.get("/orders", orderController.indexweb);
router.get("/orders/:id", orderController.oneweb);
router.post("/orders/:id/status/ok", orderController.ok);
router.post("/orders/:id/status/cancel", orderController.cancel);
router.post("/orders/:id/status/pending", orderController.pending);

// thong ke
router.get("/", function (req, res, next) {
  res.render("home");
});
router.get("/orders/10days/get", orderController.get10DaysAnalysis);
router.get("/orders/all/get", orderController.getAll);
router.get("/orders/sold/get", orderController.getSold);
router.get("/orders/today/get", orderController.getToday);
router.get("/customers/get-all", async function (req, res, next) {
  await customerController
    .getAll()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => res.json(error));
}); //get all for thong ke

router.get("/products/get-all", async function (req, res, next) {
  await productController
    .getProducts("asc")
    .then((p) => {
      res.json(p);
    })
    .catch((error) => res.json(error));
}); //get all for thong ke

//format
const numberWithComma = (x) => {
  try {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  } catch (error) {
    console.log(error);
  }
};

module.exports = router;
