var userSchema = require("../MODELS/userdb");
var jwt = require("jsonwebtoken");
var productSchema = require("../MODELS/productdb");
require("dotenv").config();
const bcrypt=require('bcrypt')
const { authschema } = require("./validation_schema");
let temp;
module.exports = {
  register: async (req, res) => {
    const { error, value } = await authschema.validate(req.body);
    const { username, email, password } = value;

    if (error) {
      res.status(422).json({
        status: "error",
        message: error.details[0].message,
      });
    } else {
      bcrypt.hash(password,10,async function(err,hash){
      await userSchema.create({
        Username: username,
        Email: email,
        Password: hash,
      })
    });
      res.status(200).json({
        status: "success",
        message: "successfully register ",
      });
    }
  },

  login: async (req, res) => {
    const { error, value } = await authschema.validate(req.body);
    const { username, password } = value;

    if (error) {
      res.status(422).json({
        status: "error",
        message: error.details[0].message,
      });
    } else {
      const user = await userSchema.find({
        Username: username,
      })
      console.log(user)
      console.log(password)

      if (user) {
        bcrypt.compare(password,user[0].Password,(err,result)=>{
          if(result){
        let resp = {
          id: user[0].id,
        };
        let token = jwt.sign(resp, process.env.ACESS_TOKEN_SECRET, {
          expiresIn: 86400,
        });
        if(token){
        res.status(200).json({
          status: "success",
          message: "successfully login ",
          auth: true,
          token: token,
        });

      }
          
    }else{
        res.json({err:"failure"})
      }
    });
  }
       else {
        res.json("this user not available");
      }
    }
  },

  viewProducts: async (req, res) => {
    const product = await productSchema.find();
    res.status(200).json({
      status: "success",
      message: "successfully fetched user product details",
      data: product,
    });
  },

  viewProductCategory: async (req, res) => {
    const product = req.params.categoryname;

    const prd = await productSchema.find({
      category: product,
    });
    if (prd.length != 0) {
      res.status(200).json({
        status: "success",
        message: "successfully fetched user product details",
        data: prd,
      });
    } else {
      res.json("the product not available");
    }
  },
  viewOneProduct: async (req, res) => {
    const product = req.params.id;

    const productdetail = await productSchema.find({
      _id: product,
    });
    if (productdetail.length != 0) {
      res.status(200).json({
        status: "success",
        message: "successfully fetched user product details",
        data: productdetail,
      });
    } else {
      res.json("this product is not avilable");
    }
  },
  addToCart: async (req, res) => {
    //TODO: add updateOne with add to set
    for (x of req.body.product) {
      const avilable = await productSchema.find({ _id: x.id });
      if (avilable.length != 0) {
        await userSchema.updateOne(
          { _id: req.params.id },
          { $push: { cart: x.id } }
        );
        res.status(200).json({
          status: "success",
          message: "successfully add cart",
        });
      } else {
        res.send("this product not avilable");
      }
    }
  },

  viewCart: async (req, res) => {// TODO: standarise err responce
    const user = await userSchema.find({ _id: req.params.id }).populate("cart");
    if (user[0].cart.length != 0) {
      res.status(200).json({
        status: "success",
        message: "successfully fetched user cart",
        data: user[0].cart,
      });
    } else {
      res.json(" no product available");
    }
  },
  addWishlist: async (req, res) => {
    const prd = req.body.product;
    for (x in prd) {
      if (prd.length != 0) {
        await userSchema.updateOne(
          { _id: req.params.id },
          { $push: { wishlist: prd[x] } }
        );
        res.status(200).json({
          status: "success",
          message: "successfully added product in wishlist",
        });
      } else {
        res.send("{status:this product not available}");
      }
    }
  },
  viewWishlist: async (req, res) => {
    const user = await userSchema
      .find({ _id: req.params.id })
      .populate("wishlist");

    res.status(200).json({
      status: "success",
      message: "successfully fetched user wishlist",
      data: user[0].wishlist,
    });
  },

  wishlistDelete: async (req, res) => {
    const product = await productSchema.find({ _id: req.params.id });
    if (product.length != 0) {
      await userSchema.updateOne(
        { _id: req.params.id },
        { $pull: { wishlist: req.body.id } }
      );

      res.status(200).json({
        status: "success",
        message: "successfully fetched user cart",
      });
    } else {
      res.json("this product not avilable");
    }
  },
  paymentMethod: async (req, res) => {
    const stripe = require("stripe")(process.env.STRIPE_KEY);
    const user = await userSchema.find({ _id: req.params.id }).populate("cart");
    const cartitem = user[0].cart.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: item.description,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      };
    });
    console.log(cartitem);
    if (cartitem != 0) {
      const session = await stripe.checkout.sessions.create({
        line_items: cartitem,
        mode: "payment",
        success_url: `http://127.0.0.1:9000/api/users/payment/success`,
        cancel_url: `http://127.0.0.1:9000/api/users/payment/cancel`,
      });
      temp = {
        cartitem: user[0].cart,
        id: req.params.id,
        paymentid: session.id,
        amount: session.amount_total / 100,
      };

      res.send({ url: session.url });
    } else {
      res.send("user no cart item");
    }
  },
  paymentSuccess: async (req, res) => {
    const user = await userSchema.find({ _id: temp.id });
    if (user.length != 0) {
      await userSchema.updateOne(
        { _id: temp.id },
        {
          $push: {
            order: {
              product: temp.cartitem,
              date: new Date(),
              orderid: Math.random(),
              paymentid: temp.paymentid,
              totalamount: temp.amount,
            },
          },
        }
      );
      await userSchema.updateOne({ _id: temp.id }, { cart: [] });
    }
    res.status(200).json({
      status: "success",
      message: "successfully added in order",
    });
  },
  paymentCancel: async (req, res) => {
    res.json("cancel");
  },
};
