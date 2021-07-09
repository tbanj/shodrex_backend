const express = require('express');
const { add, getUsers, deleteTable, createTable, getUserQueryData, getUser,
    deleteRecord, updateRecord, getSearchUser,
    getSameRecDates } = require('../controllers/users');

const router = express.Router();

router.post('/', add)
    .get('/', getUsers);

router.post('/table', createTable)
    .delete('/table', deleteTable);

router
    .get('/:id', getUser)
    .put('/:id', updateRecord)
    .delete('/:id', deleteRecord);

router
    .get('/search/:term', getSearchUser);

router
    .post('/search', getSameRecDates);


module.exports = router;