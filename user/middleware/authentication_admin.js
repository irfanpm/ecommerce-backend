const jwt =require('jsonwebtoken')

module.exports= (req, res, next) => {
    try {
    let authHeader = req.headers.authorization;
    if (authHeader == undefined) {
      res.status(401).send({ error: "no tocken provider" });
    }
    let token = authHeader.split(" ")[1];
    jwt.verify(token, "adminsecret", function (err, decoded) {
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