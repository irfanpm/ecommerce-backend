var express = require('express')
 var adminrouter = express.Router()
var admincontroller = require('../controller/admin')
var authjwt = require('../middleware/authentication_admin')
const errormiddle=require('../middleware/try_catch middleware')

adminrouter.post('/admin/login',errormiddle(admincontroller.login))
adminrouter.get('/admin/users',errormiddle(admincontroller.users))
adminrouter.get('/admin/users/:id',errormiddle(admincontroller.user))
adminrouter.get('/admin/products',errormiddle(admincontroller.products))
adminrouter.get('/admin/products/category/:categoryname',errormiddle(admincontroller.categoryproduct))
adminrouter.get('/admin/products/:id',errormiddle(admincontroller.product))
adminrouter.post('/admin/products',errormiddle(admincontroller.addproduct))
adminrouter.put('/admin/products',errormiddle(admincontroller.updateproduct))
adminrouter.delete('/admin/products',errormiddle(admincontroller.deleteproduct))
adminrouter.get('/admin/stats',admincontroller.status)
adminrouter.get('/admin/orders',admincontroller.orderdetails)







 module.exports = adminrouter