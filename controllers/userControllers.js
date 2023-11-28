const user = require('../models/userModels');
const bcyptjs = require('bcryptjs');

const config = require('../config/config');

const jwt = require('jsonwebtoken');

// to validate the email
const validator = require("validator");

// to check the valid mobile number
const PhoneNumber = require("libphonenumber-js");


const create_token = async (id) => {
  try {
    const token = await jwt.sign({ _id: id }, config.secret_jwt);
    return token;
  }
  catch (error) {
    res.status(400).send(error.message);
  }
}


const securePassword = async (password) => {

  try {
    const passwordHash = await bcyptjs.hash(password, 10);
    return passwordHash;
  }
  catch (error) {
    res.status(400).send(error.message);
  }

}


const register_user = async (req, res) => {

  try {

    const spassword = await securePassword(req.body.password);



    const users = new user({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: spassword,
      confirmpassword: spassword,



    });
    // check for valid mail id
    const email = req.body.email;
    const isValidEmail = validator.isEmail(email);

    if (isValidEmail) {

      // check for valid mobile no.
      const mobileNumber = req.body.mobile;
      const parsedNumber = PhoneNumber.parse(mobileNumber, "IN"); // Here IN means Indian mobile no.
      const isPhoneNumber = PhoneNumber.isValidNumber(parsedNumber);
      if (isPhoneNumber) {
        //  check for password and confirm password
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;
        if (password === confirmpassword) {


          const userData = await user.findOne({ email: req.body.email });
          if (userData) {
            res.status(400).send({ success: false, msg: "This email is already exists" });
          }
          else {
            const user_data = await users.save();
            res.status(200).send({ success: true, msg: "Your have been successfully registered", data: { id: user_data._id, name: user_data.name, mobile: user_data.mobile, email: user_data.email } });
          }


        }
        else {
          res.status(400).send({ success: false, msg: "new and confirm password not matched" });
        }
      }
      else {
        res.status(400).send({ success: false, msg: "Insert Valid mobile number. Mobile number should be of 10 digits." });
      }
    }
    else {
      res.status(400).send({ success: false, msg: "Insert Valid email id" });
    }


  }
  catch (error) {

    res.status(400).send(error.message);
  }

}

// Log in method::::::

const user_login = async (req, res) => {
  try {
    const email = req.body.email;
    const mobile = req.body.mobile;
    const password = req.body.password;

    /* // It is not working using login
    const userData = await user.findOne({ email: email });
    const userMobile = await user.findOne({ mobile: mobile });


    if (userData || userMobile) {
      */

    const userData = await user.findOne({
      $or: [{ email: email }, { mobile: mobile }]
    });

    if (userData) {

      const passwordMatch = await bcyptjs.compare(password, userData.password);

      // userData.password is a hashing password

      if (passwordMatch) {

        const tokenData = await create_token(userData._id);

        const userResult = {
          _id: userData._id,
          name: userData.name,
          email: userData.email,


          mobile: userData.mobile,

          token: tokenData
        }
        const response = {
          success: true,
          msg: "User Details",
          data: userResult
        }
        res.status(200).send(response);

      }
      else {
        res.status(200).send({ success: false, msg: "Login details are incorrect" });
      }
    }
    else {
      res.status(200).send({ success: false, msg: "Login details are incorrect" });
    }

  }
  catch (error) {
    res.status(400).send(error.message)
  }
}

module.exports = {
  register_user,
  user_login

}