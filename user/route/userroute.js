var express =require("express")
var userrouter = express.Router()
var controller = require('../controller/user')
var authjwt = require('../middleware/authentication_user')


userrouter.post('/users/register',controller.register)
userrouter.post('/users/login',controller.login)
userrouter.get('/users/products',authjwt,controller.products)
userrouter.get('/users/products/category/:categoryname',authjwt,controller.productcategory )
userrouter.get('/users/products/:id',authjwt,controller.product)
userrouter.post('/users/:id/cart',authjwt,controller.addcart)
userrouter.get('/users/:id/cart',authjwt,controller.cartview)
userrouter.post('/users/:id/wishlists',authjwt,controller.addwishlist)
userrouter.get('/users/:id/wishlists',authjwt,controller.wishlistview)
userrouter.delete('/users/:id/wishlists',authjwt,controller.wishlistdelete)
userrouter.post('/payment/:id',controller.stripe)
userrouter.post('/users/payment/sucess',controller.success)
userrouter.post('/users/payment/cancel',controller.cancel)



module.exports=userrouter;
