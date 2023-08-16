var userSchema = require("../MODELS/userdb");
var jwt = require("jsonwebtoken");
var productSchema = require("../MODELS/productdb");
require("dotenv").config();
const { authschema } = require("./validation_schema");
let temp
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
      await userSchema.create({
        Username: username,
        Email: email,
        Password: password,

      });
      res.status(200).json({
        status: "success",
        message: "successfully register ",
      })
    }

  
  },

  login: async (req, res) => {
    const {error,value}=await authschema.validate(req.body)
    const { username, password } = value;

    
    if (error) {
      res.status(422).json({
        status: "error",
        message: error.details[0].message,
      });
    }else{

    const login = await userSchema.find({
      Username: username,
      Password: password,
    });

    if (login.length != 0) {
      let resp = {
        id: login[0].id,
      };
      let token = jwt.sign(resp, process.env.ACESS_TOKEN_SECRET, { expiresIn: 86400 });
      res.status(200).json({
        status: "success",
        message: "successfully login ",
        auth: true,
        token: token
      })
    } else {
      res.json("this user not available");
    }
  }
  },

  products: async (req, res) => {
    const product= await productSchema.find()
    res.status(200).json({
      status: "success",
      message: "successfully fetched user product details",
      data: product,
    })

  },

  productcategory: async (req, res) => {
    const product = req.params.categoryname;

    const prd = await productSchema.find({
      category: product,
    });
    if (prd.length != 0) {
      res.status(200).json({
        status: "success",
        message: "successfully fetched user product details",
        data: prd,
      })
      } else {
      res.json("the product not available");
    }
  },
  product: async (req, res) => {
    const product = req.params.id;

    const productdetail = await productSchema.find({
      _id: product,
    });
    if (productdetail.length != 0) {
      res.status(200).json({
        status: "success",
        message: "successfully fetched user product details",
        data: productdetail,
      })
    } else {
      res.json("this product is not avilable");
    }
  },
  addcart: async (req, res) => {
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
        })     
       } else {
        res.send("this product not avilable");
      }
    }
  },

  cartview: async (req, res) => {
    const user = await userSchema.find({ _id: req.params.id }).populate("cart");
    if (user[0].cart.length != 0) {
      res.status(200).json({
        status: "success",
        message: "successfully fetched user cart",
        data: user[0].cart
      })   
     } else {
      res.json(" no product available");
    }
  },
  addwishlist: async (req, res) => {
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
      })
      } else {
        res.send("{status:this product not available}");
      }
    }
  },
  wishlistview: async (req, res) => {
    const user = await userSchema
      .find({ _id: req.params.id })
      .populate("wishlist");

      res.status(200).json({
        status: "success",
        message: "successfully fetched user wishlist",
        data: user[0].wishlist
      })  
  },

  wishlistdelete: async (req, res) => {
    const product = await productSchema.find({ _id: req.params.id });
    if (product.length != 0) {
      await userSchema.updateOne(
        { _id: req.params.id },
        { $pull: { wishlist: req.body.id } }
      );

      res.status(200).json({
        status: "success",
        message: "successfully fetched user cart",
      })    
      } else {
      res.json("this product not avilable");
    }


  },
  stripe: async (req, res) => {
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
    if(cartitem!=0){
   

    const session = await stripe.checkout.sessions.create({
      line_items: cartitem,
      mode: "payment",
      success_url: `http://127.0.0.1:9000/api/users/payment/success`,
      cancel_url: `http://127.0.0.1:9000/api/users/payment/cancel`,
    });
    temp={
      cartitem:user[0].cart,
      id:req.params.id,
      paymentid:session.id,
      amount:session.amount_total/100

     }

    res.send({ url: session.url });
    }else{
      res.send("user no cart item")
    }
    
  },
  sucess: async (req, res) => {
    const user = await userSchema.find({_id:temp.id})
     if(user.length!=0){
        await userSchema.updateOne({_id:temp.id},{$push:{order:{product:temp.cartitem,date:new Date(),orderid:Math.random(),paymentid:temp.paymentid,totalamount:temp.amount   }}})
        await userSchema.updateOne({_id:temp.id},{cart:[]})

     }
     res.status(200).json({
      status: "success",
      message: "successfully added in order",
    })   
   },
  cancel: async (req, res) => {
    res.json("cancel");
  },

};
