const express = require('express');
const router = express.Router({mergeParams: true});
const {validateTake, isLoggedIn, isReviewAuthor}= require('../middleware')
const takes = require('../controllers/takes')
const catchAsync = require('../utils/catchAsync');


router.post('/', isLoggedIn, validateTake, catchAsync(takes.createTake));

router.delete('/:takeId', isLoggedIn, isReviewAuthor, catchAsync(takes.deleteTake));

// logic is in controllers directory
module.exports = router;
