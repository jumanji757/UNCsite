const express = require('express');
const router = express.Router();
const roster = require('../controllers/roster');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateRoster} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});


router.route('/')
    .get(catchAsync(roster.index))
    .post(isLoggedIn, upload.array('image'), validateRoster, catchAsync(roster.addPlayer));
    // creates new player


router.get('/new', isLoggedIn, roster.renderNewForm);



router.get('/highlights', (req, res) => {
    res.render('UNCroster/highlights');
});


router.route('/:id')
    .get(catchAsync(roster.showPlayer))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateRoster, catchAsync(roster.updatePlayer))
    .delete(isLoggedIn, isAuthor, catchAsync(roster.deletePlayer))



router.get('/:id/edit', isLoggedIn,isAuthor, catchAsync(roster.editPlayer));



// logic is in controller directory

module.exports = router;
