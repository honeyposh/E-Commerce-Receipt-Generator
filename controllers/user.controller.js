const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.signup = async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.status = 400;
    return next(error);
  }
  try {
    const emailExist = await userModel.findOne({ email });
    if (emailExist) {
      const error = new Error("email exist please login");
      error.status = 400;
      return next(error);
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    const user = await userModel.create({
      email,
      password: hashPassword,
      firstName,
      lastName,
    });
    return res.status(201).json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    next(error);
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = new Error("Email and password are required");
      error.status = 400;
      return next(error);
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      const error = new Error("user doesnt exist please signup");
      error.status = 404;
      return next(error);
    }
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      const error = new Error("Please provide a valid password");
      error.status = 401;
      return next(error);
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60,
      secure: true,
      httpOnly: true,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
