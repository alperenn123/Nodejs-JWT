const router = require("express").Router();
const User = require("../model/User");
const brypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");
// Validation

router.post("/register", async (req, res) => {
  // Data validation
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // checking if the user already in the database
  const emailExist = await User.findOne({
    email: req.body.email,
  });
  if (emailExist) {
    return res.status(400).send("Email already exist");
  }
  // Hash the password
  const salt = await brypt.genSalt(10);
  const hashedPassword = await brypt.hash(req.body.password, salt);
  // create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({ userID: savedUser._id });
  } catch (err) {
    console.log("error during save", err);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return res.status(400).send("Email or password wrong");
  }
  const validPass = await brypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Email or password wrong");

  //Create and assing a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
  res.send("logged in");
});

module.exports = router;
