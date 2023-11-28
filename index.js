const express = require('express');
const app = express();

const cors = require("cors");
const http = require("http");
app.use(cors());

const passwort = require('passport');
const googleStrategy = require('passport-google-oauth20');
passwort.use(new googleStrategy({

  clientID: "395572607380-643dgorchbqkr400qupj9ve39vv560vj.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "auth/google/callback"

}, (accessToken, refreshToken, profile, done) => {
  console.log(accessToken);
  console.log(refreshToken);
  console.log(profile);
}));

app.get('/', passwort.authenticate('google', {
  scope: ["profile", "email"]
}))

app.get('/auth/google/callback', passwort.authenticate('google'));

const myUser = require('./controllers/userControllers');
app.get('/auth/google/callback', myUser.user_login);


const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/myLonexRentalProject');

//user routes
const user_route = require('./routes/userRoutes');
const { access } = require('fs');

app.use('/api', user_route)


// app.listen(3000, function () {
//   console.log("Server is ready");
// })

const PORT = 8000;
const DB = "mongodb+srv://Gaurav:eP2ILjAadWqdYhMda@gaurav.hxxlayo.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(DB)
  .then(() => {
    console.log("Connected to MongoDB");
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Server is running on :${PORT}`);
    });
  })
  .catch(error => {
    console.error("Error connecting to MongoDB:", error);
  });
