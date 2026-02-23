const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const { Resend } = require("resend");
const jwt = require("jsonwebtoken");
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendSignupEmail(user) {
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">Hello ${user.firstName},</h2>
      <p>Thank you for signing up! We’re excited to have you onboard.</p>
      <p>Your account has been successfully created with the email: <strong>${user.email}</strong>.</p>
      <p style="margin-top: 25px;">Welcome to our platform!</p>
      <p style="color: #888; font-size: 12px;">If you have any questions, just reply to this email.</p>
    </div>
  `;

  await resend.emails.send({
    from: "POSH WORLD <software@archsaintnexus.com>",
    to: user.email,
    subject: "Signup Successful",
    text: `Hello ${user.firstName}, your account has been successfully created!`,
    html: htmlBody,
  });
}

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
      const error = new Error("Email exists, please login");
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

    sendSignupEmail(user).catch((err) => console.error("Email error:", err));

    return res.status(201).json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      message: "Signup successful, confirmation email sent",
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
      {
        id: user.id,
        role: user.role,
      },
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
