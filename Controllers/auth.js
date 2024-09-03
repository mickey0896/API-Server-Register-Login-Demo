const User = require("../Models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");

exports.register = async (req, res) => {
  try {
    //CheckUser
    const { name, password } = req.body;
    var user = await User.findOne({ name });
    if (user) {
      return res.send("User Already Exists !!!").status(400);
    }

    //Encrypt
    const salt = await bcrypt.genSalt(60);
    user = new User({
      name,
      password,
    });
    user.password = await bcrypt.hash(password, salt);

    //Save
    await user.save();
    res.send("Register Success");

    res.send(req.body);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.login = async (req, res) => {
  try {
    //Check User
    const { name, password } = req.body;
    var user = await User.findOneAndUpdate({ name }, { new: true });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send("Password Invalid");
      }
      //Payload
      var payload = {
        user: {
          name: user.name,
        },
      };
      //Generate Token
      jwt.sign(payload, "jwtsecret", { expiresIn: 10 }, (err, token) => {
        if (err) throw err;
        res.json({ token, payload });
      });
    } else {
      return res.status(400).send("User not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};
