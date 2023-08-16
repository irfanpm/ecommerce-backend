const jwt = require("jsonwebtoken")
require("dotenv").config();


module.exports= (req, res, next) => {
    try {
    let authHeader = req.headers.authorization;
    if (authHeader == undefined) {
      res.status(401).send({ error: "no tocken provider" });
    }
    let token = authHeader.split(" ")[1];
    jwt.verify(token,process.env.ACESS_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        res.status(500).send({ error: "authentication failed" });
      } else {
        next();
      }
    });
} catch(error){
    res.status(400).send("invalid token")
}
  }