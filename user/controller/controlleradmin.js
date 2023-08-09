var userSchema = require("../MODELS/userdb");
var jwt = require("jsonwebtoken");
var productSchema = require("../MODELS/productdb");

module.exports = {

  login: async (req, res) => {
    try {
      const admin = {
        username: "admin",
        password: "admin"
      };
      const { Username, Password } = req.body;

      if (admin.username == Username && admin.password == Password) {
        let resp = {
          id: admin.username,
        };
        let token = jwt.sign(resp,"adminsecret", { expiresIn: 86400 });
        res
          .status(200)
          .json({
            status: "success",
            message: "successfullt logged in",
            data: { jwt_token: token },
          });
      }
    } catch (error) {
      res.send(error);
    }
  },

  
  users: async (req, res) => {
    const users = await userSchema.find();

    res.status(200).json({
      status: "success",
      message: "successfully fetched user data",
      data: users,
    });
  },
  user: async (req, res) => {
    const user = await userSchema.find({ _id: req.params.id });
    res.status(200).json({
      status: "success",
      message: "successfully fetched user data",
      data: user,
    });
  },
  products: async (req, res) => {
    const products = await productSchema.find();

    res.status(200).json({
      status: "success",
      message: "successfully fetched product details",
      data: products,
    });
  },
  categoryproduct: async (req, res) => {
    const categoryprd = await productSchema.find({
      category: req.params.categoryname,
    });
    
    if (categoryprd.length != 0) {
      res.status(200).json({
        status: "success",
        message: "successfully fetched user product details",
        data: categoryprd,
      });
    } else {
      res.json("this category not avilable");
    }
  },
  product: async (req, res) => {
    const product = await productSchema.find({ _id: req.params.id });
    if (product.length != 0) {
      res.status(200).json({
        status: "success",
        message: "successfully fetched user product details",
        data: product,
      });
    } else {
      res.json("this id product not available");
    }
  },
  addproduct: async (req, res) => {
    const { title, description, image, price, category } = req.body;
    await productSchema.create({
      title: title,
      description: description,
      price: price,
      image: image,
      category: category,
    });
    res.status(201).json({
      status: "success",
      message: "Successfully created a product.",
    });
  },
  updateproduct: async (req, res) => {
    const { id, title, description, image, price, category } = req.body;
    await productSchema.findByIdAndUpdate(id, {
      $set: {
        title: title,
        description: description,
        image: image,
        price: price,
        category: category,
      },
    });

    res.json({
      status: "success",
      message: "Successfully updated a product.",
    });
  },
  deleteproduct:async(req,res)=>{
    const {id}=req.body
    const deleteprd=await productSchema.find({_id:id})
    if(deleteprd.length!=0){
        await productSchema.deleteOne({_id:id})
        res.json({
            status: 'success',
            message: 'Successfully deleted a product.',
            })

    }
    else{
        res.json("this id product not available")
    }


    


  }

};
