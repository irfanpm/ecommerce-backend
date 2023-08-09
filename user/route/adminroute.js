var express = require('express')
 var adminrouter = express.Router()
var admincontroller = require('../controller/admin')
var authjwt = require('../middleware/authentication_admin')

adminrouter.post('/admin/login',admincontroller.login)
adminrouter.get('/admin/users',authjwt,admincontroller.users)
adminrouter.get('/admin/users/:id',admincontroller.user)
adminrouter.get('/admin/products',admincontroller.products)
adminrouter.get('/admin/products/category/:categoryname',admincontroller.categoryproduct)
adminrouter.get('/admin/products/:id',admincontroller.product)
adminrouter.post('/admin/products',admincontroller.addproduct)
adminrouter.put('/admin/products',admincontroller.updateproduct)
adminrouter.delete('/admin/products',admincontroller.deleteproduct)







 module.exports = adminrouter