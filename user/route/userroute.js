var express =require("express")
var userrouter = express.Router()
var controller = require('../controller/user')
var authjwt = require('../middleware/authentication_user')
const errormiddle=require('../middleware/try_catch middleware')


userrouter.post('/users/register',errormiddle(controller.register))
userrouter.post('/users/login',errormiddle(controller.login))
userrouter.get('/users/products',authjwt,errormiddle(controller.products))
userrouter.get('/users/products/category/:categoryname',authjwt,errormiddle(controller.productcategory) )
userrouter.get('/users/products/:id',authjwt, errormiddle(controller.product))
userrouter.post('/users/:id/cart',authjwt, errormiddle(controller.addcart))
userrouter.get('/users/:id/cart',authjwt,errormiddle(controller.cartview))
userrouter.post('/users/:id/wishlists',authjwt, errormiddle(controller.addwishlist))
userrouter.get('/users/:id/wishlists',authjwt, errormiddle( controller.wishlistview))
userrouter.delete('/users/:id/wishlists',authjwt,errormiddle(controller.wishlistdelete))
userrouter.post('/payment/:id',controller.stripe)
userrouter.get('/users/payment/success',controller.sucess)
userrouter.post('/users/payment/cancel',controller.cancel)



module.exports=userrouter;
