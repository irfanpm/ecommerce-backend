var userSchema = require("../MODELS/userdb");
var jwt = require("jsonwebtoken");
var productSchema = require("../MODELS/productdb");

module.exports = {
  register: async (req, res) => {
    const { username, email, password } = req.body;
    await userSchema.create({
      Username: username,
      Email: email,
      Password: password,
    });

    res.send("successfully");
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const login = await userSchema.find({
        Username: username,
        Password: password,
      });
      console.log(login);

      if (login.length != 0) {
        let resp = {
          id: login[0].id,
        };
        console.log(resp);
        let token = jwt.sign(resp, "secret", { expiresIn: 86400 });
        res.send({ auth: true, token: token });
      } else {
        res.json("not");
      }
    } catch (error) {
      res.send(error.message);
    }
  },

  verifyToken: (req, res, next) => {
    let authHeader = req.headers.authorization;
    if (authHeader == undefined) {
      res.status(401).send({ error: "no tocken provider" });
    }
    let token = authHeader.split(" ")[1];
    jwt.verify(token, "secret", function (err, decoded) {
      if (err) {
        res.status(500).send({ error: "authentication failed" });
      } else {
        next();
      }
    });
  },

  productcategory: async (req, res) => {
    const product = req.params.categoryname;

    const prd = await productSchema.find({
      category: product,
    });
    res.json(prd);
  },
  product: async (req, res) => {
    const product = req.params.id;

    const productdetail = await productSchema.find({
      _id: product,
    });
    res.json(productdetail);
  },
  addcart: async (req, res) => {
    for (x of req.body.product) {
      await userSchema.updateOne(
        { _id: req.params.id },
        { $push: { cart: x.id } }
      );
    }
    res.send("{status:sucess}");
  },

  cartview: async (req, res) => {
    const user = await userSchema.find({ _id: req.params.id }).populate("cart");

    res.send(user[0].cart);
  },
  addwishlist: async (req, res) => {
    const prd = req.body.product;
    for (x in prd) {
      await userSchema.updateOne(
        { _id: req.params.id },
        { $push: { wishlist: prd[x] } }
      );
    }
    res.send("{status:sucess}");
  },
  wishlistview: async (req, res) => {
    const user = await userSchema
      .find({ _id: req.params.id })
      .populate("wishlist");

    res.send(user[0].wishlist);
  },
  wishlistdelete: async (req, res) => {
    await userSchema.updateOne(
      { _id: req.params.id },
      { $pull: { wishlist: req.body.id } }
    );

    res.json("{status: ‘success’}");
  },
};
