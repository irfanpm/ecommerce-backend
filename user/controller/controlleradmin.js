var userSchema = require('../MODELS/userdb')
var jwt = require("jsonwebtoken");
var productSchema = require("../MODELS/productdb");


module.exports = {

login:async(req,res)=>{
    try {
        const admin={
            
            username:'admin',
            password:'admin'

    }
    const { Username,Password } = req.body

    if( admin.username==Username && admin.password == Password ){
        
        let resp = {
            id:admin.username
        }
        let token = jwt.sign(resp, "adminsecret", { expiresIn: 86400 });
         res.status(200).json({ status:'success',message:'successfullt logged in', data:{jwt_token:token}}) 





    }


    }
    catch(error) {

        res.send(error)

    }


},

verifyToken: (req, res, next) => {
    let authHeader = req.headers.authorization;
    if (authHeader == undefined) {
      res.status(401).send({ error: "no tocken provider" });
    }
    let token = authHeader.split(" ")[1];
    jwt.verify(token, "adminsecret", function (err, decoded) {
      if (err) {
        res.status(500).send({ error: "authentication failed" });
      } else {
        next();
      }
    });
  },
users:async(req,res)=>{
   const users = await userSchema.find()

   res.status(200).json({
    status:'success',
    message:"successfully fetched user data",
    data:users

   })


},
user:async(req,res)=>{
    const user = await userSchema.find({_id:req.params.id})
    res.status(200).json({
        status:'success',
        message:"successfully fetched user data",
        data:user
    })


},
products:async(req,res)=>{
    const products = await productSchema.find()

    res.status(200).json({
        status:'success',
        message:"successfully fetched product details",
        data:products
    })
},
categoryproduct:async(req,res)=>{
    const categoryprd=await productSchema.find({category:req.params.categoryname})
    if(categoryprd.length!=0){
    res.status(200).json({
        status:'success',
        message:"successfully fetched user product details",
        data:categoryprd
    })
}
else{
    res.json('this category not avilable')
}

},
product:async(req,res)=>{
    const product = await productSchema.find({_id:req.params.id})
    if(product.length!=0){
        res.status(200).json({
            status:'success',
            message:"successfully fetched user product details",
            data:product
        })


    }
    else {
        res.json("this id product not available")
    }

}




}
