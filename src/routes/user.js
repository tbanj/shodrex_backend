const express = require('express');
const { add, getUsers, deleteTable, createTable, getUserQueryData, getUser,
    deleteRecord, updateRecord, getSearchUser,
    getSameRecDates, login, extendToken } = require('../controllers/users');
const auth = require('../middleware/auth');

const router = express.Router();



router
    .get('/search/:firstName', getSearchUser);


router
    .post('/search', getSameRecDates);

router.post('/table', createTable)
    .delete('/table', deleteTable);

router
    .route('/login')
    .post(login);

router
    .get('/extendtoken', auth, extendToken);


router
    .get('/:id', getUser)
    .put('/:id', updateRecord)
    .delete('/:id', deleteRecord);

router.post('/', add)
    .get('/', getUsers);




module.exports = router;