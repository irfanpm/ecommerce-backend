var express =require("express")
var router = express.Router()
var controller = require('../controller/controlleruser')

router.post('/users/register',controller.register)
router.post('/users/login',controller.login)
router.get('/users/products/category/:categoryname',controller.verifyToken,controller.productcategory )
router.get('/users/products/:id',controller.verifyToken,controller.product)
router.post('/users/:id/cart',controller.addcart)
router.get('/users/:id/cart',controller.cartview)
router.post('/users/:id/wishlists',controller.addwishlist)
router.get('/users/:id/wishlists',controller.wishlistview)


module.exports=router;
