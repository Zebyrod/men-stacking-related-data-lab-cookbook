// controllers/foods.js

// /users/:userId/foods

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// router logic will go here - will be built later on in the lab

//INDEX ROUTE. /LANDING PAGE
router.get('/', async (req, res) => {
    try {
        // Look up the user from req.session
        const currentUser = await User.findById(req.session.user._id);
        // Render index.ejs, passing in all of the current user's pantry data in res.locals object
        res.render('foods/index.ejs', {
            pantry: currentUser.pantry,
        });
    } catch (error) {
        // If there are any errors console log it and redirect back to home page
        console.log(error);
        res.redirect('/');
    }
  });
  

// NEW ROUTE. 
router.get('/new', async (req, res) => {
    res.render('foods/new.ejs');
}); 

// DELETE ROUTE.

router.delete('/:itemId', async (req, res) => {
   try {
    const currentUser = await User.findById(req.session.user._id);
    // Use mongoose.deleteOne() to delete a food using the id supplied from req.params
    currentUser.pantry.id(req.params.itemId).deleteOne();
    // Save changes to the user
    await currentUser.save();
    // Redirect to the index
    res.redirect(`/users/${currentUser._id}/foods`);
   } catch (error) {
    console.log(error);
    res.redirect('/')
   }
});

// UPDATE ROUTE. 

router.put('/:itemId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const pantryItem = currentUser.pantry.id(req.params.itemId);
        pantryItem.set(req.body);
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/foods`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// CREATE ROUTE. 

router.post('/', async (req, res) => {
   try {
    //Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Push req.body (the new form data) into the pantry (foodSchema) array of the current user
    currentUser.pantry.push(req.body);
    // Now I want to save these changes to the user in the database
    await currentUser.save();
    // After saving this info in the database I want to redirect the user to the landing page
    res.redirect(`/users/${currentUser._id}/foods`);
   } catch (error) {
    // If there is any errors log in in the console and redirect to the home page
    console.log(error);
    res.redirect('/');
   };
});

// EDIT ROUTE. 
router.get('/:itemId/edit', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const pantryItem = currentUser.pantry.id(req.params.itemId);
        res.render(`foods/edit.ejs`, { pantry: pantryItem });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});
// SHOW ROUTE.  Commented out based on the instructions a show page is not required for this lab
// router.get('/:pantryId', async (req, res) => {
//     try {
//         const currentUser = await User.findById(req.session.user._id);
//         const pantry = currentUser.pantry.id(req.params.pantryId);
//         res.render('foods/show.ejs', {
//             pantry: currentUser.pantry._id,
//         })
//     } catch (error) {
//         console.log(error);
//         res.redirect('/');
//     }
// });

module.exports = router;