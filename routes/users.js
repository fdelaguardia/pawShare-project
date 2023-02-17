var express = require('express');
var router = express.Router();

const User = require('../models/User.model')                //getting access from the User model

const mongoose = require('mongoose')

const bcryptjs = require('bcryptjs');
const saltRounds = 10;





router.get('/signup', (req, res, next) => {                 //when website goes to http://localhost:4000/users/signup renders the views/users/signup.hbs page
  res.render('users/signup.hbs')
})

router.post('/signup', (req, res, next) => {                //gathering the information from the sign up
  const { firstName, lastName, email, password } = req.body;   

  if( !firstName || !lastName || !email || !password ){     //if any input is blank render the same page with an error message
    res.render('users/signup.hbs', {errorMessage: 'All fields are mandaroty. Please provide your first name, last name, email, and password.'})
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('users/signup.hbs', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }
  
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => {
      return bcryptjs.hash(password, salt);
    })                              //generate unreadable password
    .then((hashedPassword) => {
      return User.create({          //create a new user in the database
        firstName,
        lastName,
        email,
        password: hashedPassword
      });
    })
    .then((newUser) => {            //console log the new user and redirect to the login page
      console.log('Newly created user is: ', newUser)
      res.redirect('/users/login')
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('users/signup.hbs', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('users/signup.hbs', {
           errorMessage: 'The email needs to be unique. This email is already registered to an account.'
        });
      } else {
        next(error);
      }
    })

})





router.get('/login', (req, res, next) => {                 //when website goes to http://localhost:4000/users/login renders the views/users/login.hbs page
  res.render('users/login.hbs')
})

router.post('/login', (req, res, next) => {

  const { firstName, lastName, email, password } = req.body;

  if( !email || !password ){                               //if any input is blank render the same page with an error message 
    res.render('users/login.hbs', {errorMessage: 'All fields are mandaroty. Please provide your email, and password.'})
    return;
  }
  
  User.findOne({email})           //looks for a matching email in the database
    .then((user) => {
      if(!user){                  //if there are no user there is no email, so it's not registered
        res.render('users/login.hbs', {errorMessage: 'This email is not registered. Try with other email.'})
        return;
      } else if(bcryptjs.compareSync(password, user.password)){   //checks the password in the database to the password entered
        req.session.user = user   //create a new session for the user
        res.redirect('/home')
      } else{
        res.render('users/login.hbs', {errorMessage: 'Incorrect password'})
      }
    })
    .catch((err) => {
      console.log(err)
    })

})






module.exports = router;
