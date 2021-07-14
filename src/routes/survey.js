const express = require('express');
const { getSurveys, addSurvey, getSearchSurvey } = require('../controllers/survey');
const auth = require('../middleware/auth');

const router = express.Router();

// get Survey List
router.get('/', getSurveys);

router.post('/add', addSurvey)

router.get('/search', getSearchSurvey);


module.exports = router;