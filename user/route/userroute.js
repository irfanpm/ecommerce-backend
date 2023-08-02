var express =require("express")
var userrouter = express.Router()
var controller = require('../controller/controlleruser')

userrouter.post('/users/register',controller.register)
userrouter.post('/users/login',controller.login)
userrouter.get('/users/products/category/:categoryname',controller.verifyToken,controller.productcategory )
userrouter.get('/users/products/:id',controller.verifyToken,controller.product)
userrouter.post('/users/:id/cart',controller.addcart)
userrouter.get('/users/:id/cart',controller.cartview)
userrouter.post('/users/:id/wishlists',controller.addwishlist)
userrouter.get('/users/:id/wishlists',controller.wishlistview)
userrouter.delete('/users/:id/wishlists',controller.wishlistdelete)


module.exports=userrouter;
