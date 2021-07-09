const express = require("express");
const { db } = require('./config/database');
const Sequelize = require('sequelize');
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const path = require("path");
const env = require('./env');

//  // recordDate, ownPhone,ownSim, phoneActivitiesn wishPhone
// test DB
db.authenticate()
    .then(() => console.log(' Database connected...'))
    .catch((err) => console.log('Error: ', err));

const app = express();

//  body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());


// Survey route
// app.use('/', require('./routes/test'));
// Set static folder
app.use('/', express.static(path.join(__dirname, './public')));

app.use('/surveys', require('./routes/survey'));
// app.use('/firms', require('./routes/firms'));
app.use('/users', require('./routes/user'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
