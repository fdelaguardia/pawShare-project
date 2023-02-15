var express = require('express');
var router = express.Router();

const fileUploader = require('../config/cloudinary.config');

const Pet = require('../models/Pet.model')
const Post = require('../models/Post.model')





router.get('/', function(req, res, next) {
    const user = req.session.user;                  //gettting the user information via the session
    Pet.find()              //finding all pets registered in the website and rendering the home.hbs
        .populate('owner')
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





router.get('/new-pet', (req, res, next) => {
    res.render('pets/new-pet.hbs')
})

router.post('/new-pet', fileUploader.single('iconImage'), (req, res, next) => {

    const { name, breed, gender, age, petBio } = req.body
    
    
    if( !name || !breed || !gender || !age || !petBio ){     //if any input is blank render the same page with an error message
        res.render('pets/new-pet.hbs', {errorMessage: 'All fields are mandaroty. Please provide your pets name, breed, gender, age, and icon image.'})
        return;
    }

    Pet.create({
        name,
        breed,
        gender,
        age,
        petBio,
        owner: req.session.user._id,
        iconImage: req.file.path
    })
    .then((pet) => {
        console.log(pet)
        res.redirect(`/home`)
    })
    .catch((err) => {
        console.log(err)
    })
})




router.get('/pet-page/:id', (req, res, next) => {

    const user = req.session.user;             //gettting the user information via the session

    Pet.findById(req.params.id)
        .then((foundPet) => {
            
            if(String(foundPet.owner._id) === user._id){
                Post.find({pet: req.params.id})
                    .populate('pet')
                    .then((foundPosts) => {
                        res.render('pets/my-pet-page', {foundPet, user, foundPosts})
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            } else {
                Post.find({pet: req.params.id})
                    .populate('pet')
                    .then((foundPosts) => {
                        res.render('pets/pet-page', {foundPet, user, foundPosts})
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        })
        .catch((err) => {
            console.log(err)
        })
})





router.get('/owners-page/:id', (req, res, next) => {

    const user = req.session.user;             //gettting the user information via the session

    Pet.find({owner: req.params.id})
    .populate('owner')
    .then((foundPets) => {
        
        if(req.params.id === user._id){
            res.redirect(`/home/account/${req.params.id}`)
        } else {
            res.render('pets/owners-page.hbs', {foundPets, user})
        }
    })
    .catch((err) => {
        console.log(err)
    })

})





router.get('/new-post/:id', (req, res, next) => {
    const id = req.params.id
    res.render('posts/new-post.hbs', {id})
})
router.post('/new-post/:id', fileUploader.single('postImage'), (req, res, next) => {
   
    Post.create({
        description: req.body.description,
        postImage: req.file.path,
        pet: req.params.id,
        owner: req.session.user._id
    })
    .then((postCreated) => {
        console.log(postCreated)
        res.redirect(`/home/pet-page/${req.params.id}`)
    })
    .catch((err) => {
        console.log(err)
    })
})





router.get('/edit-pet/:id', (req, res, next) => {
    Pet.findById(req.params.id)
      .then((foundPet) => {
        res.render('pets/edit-pet.hbs', foundPet)
      })
      .catch((err) => {
        console.log(err)
      })
})
router.post('/edit-pet/:id', fileUploader.single('iconImage'), (req, res, next) => {
    const { name, breed, gender, age, petBio } = req.body
    
    
    if( !name || !breed || !gender || !age || !petBio ){     //if any input is blank render the same page with an error message
        res.render('pets/new-pet.hbs', {errorMessage: 'All fields are mandaroty. Please provide your pets name, breed, gender, age, and icon image.'})
        return;
    }

    Pet.findByIdAndUpdate(req.params.id, {
        name,
        breed,
        gender,
        age,
        petBio,
        iconImage: req.file.path 
    }, {new: true})
    .then((updatedPet) => {
        console.log(updatedPet)
        res.redirect(`/home/pet-page/${req.params.id}`)
    })
    .catch((err) => {
        console.log(err)
      })
})




module.exports = router;
