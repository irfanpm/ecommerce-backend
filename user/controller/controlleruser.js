var userSchema = require("../MODELS/userdb");
var jwt = require("jsonwebtoken");
var productSchema = require("../MODELS/productdb");
require("dotenv").config();

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
        let token = jwt.sign(resp, "secret", { expiresIn: 86400 });
        res.send({ auth: true, token: token });
      } else {
        res.json("this user not available");
      }
    } catch (error) {
      res.send(error.message);
    }
  },


  products: async(req,res)=>{

    res.json(await productSchema.find())

  },

  productcategory: async (req, res) => {
    const product = req.params.categoryname;

    const prd = await productSchema.find({
      category: product,
    });
    if(prd.length!=0){
    res.json(prd);
    }
    else{
      res.json('the product not available')
    }
  },
  product: async (req, res) => {
    const product = req.params.id;

    const productdetail = await productSchema.find({
      _id: product,
    });
    if(productdetail.length!=0){
    res.json(productdetail);
    }
    else{
      res.json("this product is not avilable")
    }
  },
  addcart: async (req, res) => {
    for (x of req.body.product) {
      const avilable=await productSchema.find({_id:x.id})
      console.log(avilable);
      if(avilable.length!=0){


      await userSchema.updateOne(
        { _id: req.params.id },
        { $push: { cart: x.id } }
      );
      res.send("{status:sucess}");
    }else{
      res.send("this product not avilable")
    }
  }
   
  },

  cartview: async (req, res) => {
    const user = await userSchema.find({ _id: req.params.id }).populate("cart");
    if(user[0].cart.length!=0){

    res.json(user[0].cart);
    }
    else
    {
      res.json(" no product available")
    }
  },
  addwishlist: async (req, res) => {
    const prd = req.body.product;
    for (x in prd) {
      if(prd.length!=0){
 
      await userSchema.updateOne(
        { _id: req.params.id },
        { $push: { wishlist: prd[x] } }
      );
      res.send("{status:sucess}");

    }
    else {
      res.send("{status:this product not available}")
    }
  }
 
  },
  wishlistview: async (req, res) => {
    const user = await userSchema
      .find({ _id: req.params.id })
      .populate("wishlist");

    res.send(user[0].wishlist);
  },
  
  wishlistdelete: async (req, res) => {
    const product=await productSchema.find({_id:req.params.id})
    if(product.length!=0){
    await userSchema.updateOne(
      { _id: req.params.id },
      { $pull: { wishlist: req.body.id } }
    );

    res.json("{status: ‘success’}");
    }else{
      res.json("this product not avilable")
    }
  },
  stripe:async(req,res)=>{
    const stripe = require('stripe')(process.env.STRIPE_KEY)
    const user =await userSchema.find({ _id: req.params.id }).populate("cart");
  const cartitem = user[0].cart.map((item)=>{
      return{
        price_data:{
          currency:"usd",
          product_data:{
            name:item.title,
            description:item.description
          }
          ,
          unit_amount:item.price*100

        },
        quantity:1,
      };


     })
     console.log(cartitem);
     




    const session = await stripe.checkout.sessions.create({
      line_items:cartitem,
      mode: 'payment',
      success_url: `http://127.0.0.1:9000/api/users/payment/sucess`,
      cancel_url: `http://127.0.0.1:9000/api/users/payment/cancel`,
    });
    res.send({url:session.url})
  



  },
  success:async(req,res)=>{
    res.json("sucess")

  },
  cancel:async(req,res)=>{
    res.json("cancel")
  }












};
