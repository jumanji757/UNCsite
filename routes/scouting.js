const express = require('express');
const router = express.Router({mergeParams: true});
const {validateTake, isLoggedIn, isScoutAuthor}= require('../middleware');
const scouting = require('../controllers/scouting');
const catchAsync = require('../utils/catchAsync');


router.post('/', isLoggedIn, catchAsync(scouting.createScout));

router.delete('/:scoutId', isLoggedIn, isScoutAuthor, catchAsync(scouting.deleteScout));

// logic is in controllers directory
module.exports = router;
