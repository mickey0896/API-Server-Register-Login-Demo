const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  try {
    const token = req.headers["authtoken"];
    console.log(token);

    if (!token) {
      return res.status(401).send("No Token");
    }
    const decoded = jwt.verify(token, "jwtsecret");
    req.user = decoded.user;

    next();
  } catch (err) {
    console.log(err, "55555555555555");
    res.send("Token Invalid").status(500);
  }
};
