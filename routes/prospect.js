const express = require('express');
const router = express.Router();
const prospect = require('../controllers/prospect');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isProAuthor, validateProspect} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});


router.route('/')
    .get(catchAsync(prospect.index))
    .post(isLoggedIn, upload.array('image'), validateProspect, catchAsync(prospect.addPlayer));
    // creates new player


router.get('/new', isLoggedIn, prospect.renderNewForm);




router.route('/:id')
    .get(catchAsync(prospect.showPlayer))
    .put(isLoggedIn, isProAuthor, upload.array('image'), validateProspect, catchAsync(prospect.updatePlayer))
    .delete(isLoggedIn, isProAuthor, catchAsync(prospect.deletePlayer))



router.get('/:id/edit', isLoggedIn,isProAuthor, catchAsync(prospect.editPlayer));



// logic is in controller directory

module.exports = router;
