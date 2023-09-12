var express = require('express')
 var adminrouter = express.Router()
var admincontroller = require('../controller/admin')
var authjwt = require('../middleware/authentication_admin')
const errormiddle=require('../middleware/try_catch middleware')

adminrouter.post('/admin/login',errormiddle(admincontroller.login))
adminrouter.get('/admin/users',authjwt,errormiddle(admincontroller.getAllUsers))
adminrouter.get('/admin/users/:id',authjwt,errormiddle(admincontroller.getUserById))
adminrouter.get('/admin/products',authjwt,errormiddle(admincontroller.getAllProducts))
adminrouter.get('/admin/products/category/:categoryname',authjwt,errormiddle(admincontroller.getCategoryProducts))
adminrouter.get('/admin/products/:id',authjwt,errormiddle(admincontroller.getProductById))
adminrouter.post('/admin/products',authjwt,errormiddle(admincontroller.addProduct))
adminrouter.put('/admin/products',authjwt,errormiddle(admincontroller.updateProduct))
adminrouter.delete('/admin/products',authjwt,errormiddle(admincontroller.deleteProduct))
adminrouter.get('/admin/stats',authjwt,errormiddle(admincontroller.getStatus))
adminrouter.get('/admin/orders',authjwt,errormiddle(admincontroller.getOrderDetails))







 module.exports = adminrouter