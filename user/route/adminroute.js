var express = require('express')
 var adminrouter = express.Router()
var admincontroller = require('../controller/controlleradmin')

adminrouter.post('/admin/login',admincontroller.login)
adminrouter.get('/admin/users',admincontroller.users)
adminrouter.get('/admin/users/:id',admincontroller.user)
adminrouter.get('/admin/products',admincontroller.products)
adminrouter.get('/admin/products/category/:categoryname',admincontroller.categoryproduct)
adminrouter.get('/admin/products/:id',admincontroller.product)





 module.exports = adminrouter