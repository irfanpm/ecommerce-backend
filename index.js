var express =require('express')
const api = express()
const bodyparser = require('body-parser')
const  mongoose  = require('mongoose')
const userroute = require('./ecommerce_backend/route/userroute')
const adminroute=require('./ecommerce_backend/route/adminroute')

api.use(bodyparser.json())

mongoose.connect('mongodb://localhost/irfan')

api.use('/api',userroute,adminroute)
api.listen(9000,()=>{
    console.log('http://127.0.0.1:9000');
})