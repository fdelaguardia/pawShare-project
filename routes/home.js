var express = require('express');
var router = express.Router();

const Pet = require('../models/Pet.model')





router.get('/', function(req, res, next) {
    const user = req.session.user;                  //gettting the user information via the session
    Pet.find()              //finding all pets registered in the website and rendering the home.hbs
        .then((foundPets) => {
            res.render('home.hbs', {foundPets , user});
        })
        .catch((err) => {
            console.log(err)
        })
   
});





router.get('/account/:id', (req, res, next) => {
    const user = req.session.user;             //gettting the user information via the session
    Pet.find({owner: req.params.id})           
        .populate('owner')                     
        .then((foundPets) => {
            console.log(foundPets)
            res.render('pets/my-pets.hbs', {foundPets, user})
        })
        .catch((err) => {
            console.log(err)
        })
})





module.exports = router;
