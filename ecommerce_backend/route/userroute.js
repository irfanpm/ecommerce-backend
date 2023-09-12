var express =require("express")
var userrouter = express.Router()
var controller = require('../controller/user')
var authjwt = require('../middleware/authentication_user')
const errormiddle=require('../middleware/try_catch middleware')


userrouter.post('/users/register',errormiddle(controller.register))
userrouter.post('/users/login',errormiddle(controller.login))
userrouter.get('/users/products',authjwt,errormiddle(controller.viewProducts))
userrouter.get('/users/products/category/:categoryname',authjwt,errormiddle(controller.viewProductCategory) )
userrouter.get('/users/products/:id',authjwt, errormiddle(controller.viewOneProduct))
userrouter.post('/users/:id/cart',authjwt, errormiddle(controller.addToCart))
userrouter.get('/users/:id/cart',authjwt,errormiddle(controller.viewCart))
userrouter.post('/users/:id/wishlists',authjwt, errormiddle(controller.addWishlist))
userrouter.get('/users/:id/wishlists',authjwt, errormiddle( controller.viewWishlist))
userrouter.delete('/users/:id/wishlists',authjwt,errormiddle(controller.wishlistDelete))
userrouter.post('/payment/:id',authjwt,errormiddle(controller.paymentMethod))
userrouter.get('/users/payment/success',errormiddle(controller.paymentSuccess))
userrouter.post('/users/payment/cancel',errormiddle(controller.paymentCancel))



module.exports=userrouter;
