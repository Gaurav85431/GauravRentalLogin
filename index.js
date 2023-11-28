const express = require('express');
const app = express();

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

app.get('/auth/google', passwort.authenticate('google', {
  scope: ["profile", "email"]
}))

// app.get('/auth/google/callback', passwort.authenticate('google'));
const x = require('./controllers/userControllers');
app.get('/auth', x.user_login);


const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/myLonexRentalProject');

//user routes
const user_route = require('./routes/userRoutes');
const { access } = require('fs');

app.use('/api', user_route)


app.listen(3000, function () {
  console.log("Server is ready");
})