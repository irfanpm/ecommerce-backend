const joi = require('joi')

const authschema = joi.object({
    username:joi.string().required(),
    email:joi.string().email().lowercase(),
    password:joi.string().required()


})
const auth_productschema= joi.object({
    title:joi.string().required(),
    description:joi.string().required(),
    price:joi.number().required(),
    image:joi.string().required(),
    category:joi.string().required()
})
module.exports={
    authschema,
    auth_productschema

}