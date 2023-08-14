var express = require('express')
 var adminrouter = express.Router()
var admincontroller = require('../controller/admin')
var authjwt = require('../middleware/authentication_admin')
const errormiddle=require('../middleware/try_catch middleware')

adminrouter.post('/admin/login',errormiddle(admincontroller.login))
adminrouter.get('/admin/users',authjwt,errormiddle(admincontroller.users))
adminrouter.get('/admin/users/:id',authjwt,errormiddle(admincontroller.user))
adminrouter.get('/admin/products',authjwt,errormiddle(admincontroller.products))
adminrouter.get('/admin/products/category/:categoryname',authjwt,errormiddle(admincontroller.categoryproduct))
adminrouter.get('/admin/products/:id',authjwt,errormiddle(admincontroller.product))
adminrouter.post('/admin/products',authjwt,errormiddle(admincontroller.addproduct))
adminrouter.put('/admin/products',authjwt,errormiddle(admincontroller.updateproduct))
adminrouter.delete('/admin/products',authjwt,errormiddle(admincontroller.deleteproduct))
adminrouter.get('/admin/stats',authjwt,errormiddle(admincontroller.status))
adminrouter.get('/admin/orders',authjwt,errormiddle(admincontroller.orderdetails))







 module.exports = adminrouter